/**
 * Renderer Process Application Script - High Precision Real-Time Sync Engine & Settings Theme Manager
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const widgetRoot = document.getElementById('widget-root');
  const trackTitle = document.getElementById('track-title');
  const trackArtist = document.getElementById('track-artist');
  const appTag = document.getElementById('app-tag');
  const playbackStatusTag = document.getElementById('playback-status-tag');
  const timeCurrent = document.getElementById('time-current');
  const timeTotal = document.getElementById('time-total');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const progressBarBg = document.getElementById('progress-bar-bg');
  const lyricsWrapper = document.getElementById('lyrics-wrapper');
  const lyricsContainer = document.getElementById('lyrics-container');
  const settingsWrapper = document.getElementById('settings-wrapper');
  const headerBar = document.getElementById('header-bar');

  // Mini Playback Control Elements
  const btnPlayPause = document.getElementById('btn-playpause');
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');

  // Header Control Buttons
  const btnSettings = document.getElementById('btn-settings');
  const btnClickThrough = document.getElementById('btn-click-through');
  const lockOpenIcon = document.querySelector('.lock-open-icon');
  const lockClosedIcon = document.querySelector('.lock-closed-icon');
  const btnMinimize = document.getElementById('btn-minimize');
  const btnClose = document.getElementById('btn-close');

  // Settings Panel Elements
  const btnCloseSettings = document.getElementById('btn-close-settings');
  const selectLanguage = document.getElementById('select-language');
  const sliderOpacity = document.getElementById('slider-opacity');
  const valueOpacity = document.getElementById('value-opacity');
  const sliderBlur = document.getElementById('slider-blur');
  const valueBlur = document.getElementById('value-blur');
  const toggleAlwaysOnTop = document.getElementById('toggle-always-on-top');
  const toggleDimPaused = document.getElementById('toggle-dim-paused');
  const toggleAutoStart = document.getElementById('toggle-auto-start');
  const selectLyricAlign = document.getElementById('select-lyric-align');
  const sliderFontSize = document.getElementById('slider-font-size');
  const valueFontSize = document.getElementById('value-font-size');
  const sliderTimeOffset = document.getElementById('slider-time-offset');
  const valueTimeOffset = document.getElementById('value-time-offset');
  const toggleGlow = document.getElementById('toggle-glow');
  const btnResetSettings = document.getElementById('btn-reset-settings');



  // State Variables
  let currentLyrics = [];
  let lineElements = [];
  let activeIndex = -1;
  let isClickThrough = false;
  let totalDuration = 0;
  let currentPlaybackStatus = 'Stopped';
  let isSettingsVisible = false;

  // High-Precision Live Timeline Interpolation State
  let lastKnownPosition = 0;
  let lastPositionTimestamp = performance.now();
  let animFrameId = null;

  // i18n Translation Dictionary
  const translations = {
    tr: {
      settingsTitle: '⚙️ Uygulama Ayarları',
      sectionLanguage: '🌐 Dil (Language)',
      labelLanguage: 'Arayüz Dili:',
      sectionPresets: '🎨 Hazır Renk Paletleri',
      sectionAppearance: '✨ Görünüm & Saydamlık',
      labelOpacity: 'Saydamlık Düzeyi:',
      labelBlur: 'Bulanıklık Efekti:',
      sectionWindowBehavior: '📌 Pencere & Davranış',
      labelAlwaysOnTop: 'Hep Üstte Kal:',
      labelDimPaused: 'Duraklatıldığında Soluklaştır:',
      labelAutoStart: 'Başlangıçta Çalıştır:',
      sectionLyricsStyle: '🎤 Şarkı Sözü & Hizalama',
      labelLyricAlign: 'Metin Hizalaması:',
      alignCenter: 'Ortala (Center)',
      alignLeft: 'Sola Yasla (Left)',
      alignRight: 'Sağa Yasla (Right)',
      labelFontSize: 'Aktif Söz Boyutu:',
      labelTimeOffset: 'Zaman İlerleme (Offset):',
      labelGlow: 'Neon Vurgu (Glow):',
      btnReset: 'Varsayılanlara Sıfırla',
      placeholderWait: 'Sistemde çalan müzik algılandığında şarkı sözleri canlı senkronize akacaktır.',
      placeholderNotFound: 'Şarkı sözü bulunamadı.',
      trackWaiting: 'Müzik Bekleniyor...',
      trackWaitingDesc: 'Sisteminizde (Spotify/YouTube/Chrome) bir müzik başlatın',
      statusPlaying: '▶ ÇALINIYOR',
      statusPaused: '⏸ DURAKLATILDI',
      statusStopped: '⏹ DURDU',
      btnSettingsTitle: 'Ayarlar (Settings)',
      btnLockUnlocked: 'Tıklamayı Alta Geçir (Lock Mode)',
      btnLockLocked: 'Kilitli (Tıklamalar alta geçer). Kilidi açmak için üst bara gelin, Ctrl+Alt+L basın veya sağ alttaki tepsi ikonunu kullanın.'
    },
    en: {
      settingsTitle: '⚙️ Widget Settings',
      sectionLanguage: '🌐 Language',
      labelLanguage: 'UI Language:',
      sectionPresets: '🎨 Color Presets',
      sectionAppearance: '✨ Appearance & Opacity',
      labelOpacity: 'Opacity Level:',
      labelBlur: 'Blur Effect:',
      sectionWindowBehavior: '📌 Window & Behavior',
      labelAlwaysOnTop: 'Always on Top:',
      labelDimPaused: 'Dim when Paused:',
      labelAutoStart: 'Start on System Boot:',
      sectionLyricsStyle: '🎤 Lyrics Styling',
      labelLyricAlign: 'Text Alignment:',
      alignCenter: 'Center',
      alignLeft: 'Left',
      alignRight: 'Right',
      labelFontSize: 'Active Line Size:',
      labelTimeOffset: 'Sync Offset:',
      labelGlow: 'Neon Glow:',
      btnReset: 'Reset to Defaults',
      placeholderWait: 'Lyrics will stream synchronously when media playback is detected on system.',
      placeholderNotFound: 'Lyrics not found.',
      trackWaiting: 'Waiting for Music...',
      trackWaitingDesc: 'Start playing music on your system (Spotify/YouTube/Chrome)',
      statusPlaying: '▶ PLAYING',
      statusPaused: '⏸ PAUSED',
      statusStopped: '⏹ STOPPED',
      btnSettingsTitle: 'Settings',
      btnLockUnlocked: 'Click-Through Mode (Lock)',
      btnLockLocked: 'Locked (Clicks pass through). Hover header bar, press Ctrl+Alt+L or use system tray to unlock.'
    }
  };

  // Theme Presets Map
  const PRESETS = {
    violet: {
      primary: '#8b5cf6',
      secondary: '#06b6d4',
      glowShadow: '0 0 20px rgba(139, 92, 246, 0.6)'
    },
    emerald: {
      primary: '#10b981',
      secondary: '#06b6d4',
      glowShadow: '0 0 20px rgba(16, 185, 129, 0.6)'
    },
    midnight: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      glowShadow: '0 0 20px rgba(59, 130, 246, 0.6)'
    },
    sunset: {
      primary: '#ec4899',
      secondary: '#f97316',
      glowShadow: '0 0 20px rgba(236, 72, 153, 0.6)'
    },
    crystal: {
      primary: '#e2e8f0',
      secondary: '#38bdf8',
      glowShadow: '0 0 20px rgba(226, 232, 240, 0.5)'
    },
    cyberpunk: {
      primary: '#00f3ff',
      secondary: '#ff0055',
      glowShadow: '0 0 20px rgba(0, 243, 255, 0.7)'
    },
    amber: {
      primary: '#f59e0b',
      secondary: '#ef4444',
      glowShadow: '0 0 20px rgba(245, 158, 11, 0.6)'
    },
    dusk: {
      primary: '#a855f7',
      secondary: '#f43f5e',
      glowShadow: '0 0 20px rgba(168, 85, 247, 0.6)'
    },
    toxic: {
      primary: '#84cc16',
      secondary: '#10b981',
      glowShadow: '0 0 20px rgba(132, 204, 22, 0.6)'
    },
    aurora: {
      primary: '#14b8a6',
      secondary: '#8b5cf6',
      glowShadow: '0 0 20px rgba(20, 184, 166, 0.6)'
    }
  };

  const DEFAULT_SETTINGS = {
    language: 'en',
    preset: 'violet',
    opacity: 85,
    blur: 24,
    alwaysOnTop: true,
    dimOnPause: true,
    lyricAlign: 'center',
    fontSize: 18,
    timeOffset: 0,
    glow: true
  };

  let currentSettings = { ...DEFAULT_SETTINGS };

  // Load and Apply Saved Settings
  function loadSettings() {
    try {
      const saved = localStorage.getItem('lyrics_widget_settings');
      if (saved) {
        currentSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Could not load saved settings', e);
    }

    if (window.api && window.api.getAutoStart) {
      window.api.getAutoStart().then(state => {
        if (toggleAutoStart) toggleAutoStart.checked = Boolean(state);
      });
    }
    applySettings();
  }

  function saveSettings() {
    try {
      localStorage.setItem('lyrics_widget_settings', JSON.stringify(currentSettings));
    } catch (e) {
      console.warn('Could not save settings to localStorage:', e);
    }
  }

  function applySettings() {
    const lang = currentSettings.language || 'tr';
    const dict = translations[lang] || translations.tr;

    // Apply i18n text
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    if (btnSettings) btnSettings.title = dict.btnSettingsTitle;

    // Apply Theme Colors
    const preset = PRESETS[currentSettings.preset] || PRESETS.violet;
    document.documentElement.style.setProperty('--primary-accent', preset.primary);
    document.documentElement.style.setProperty('--secondary-accent', preset.secondary);

    // Apply Opacity & Blur
    const opacityVal = (currentSettings.opacity / 100).toFixed(2);
    document.documentElement.style.setProperty('--bg-opacity', opacityVal);
    document.documentElement.style.setProperty('--blur-amount', `${currentSettings.blur}px`);

    // Apply Lyric Alignment
    const align = currentSettings.lyricAlign || 'center';
    lyricsContainer.className = `lyrics-container align-${align}`;

    // Apply Font Size & Glow
    document.documentElement.style.setProperty('--active-lyric-font-size', `${currentSettings.fontSize}px`);
    if (currentSettings.glow) {
      document.documentElement.style.setProperty('--lyric-glow-shadow', preset.glowShadow);
    } else {
      document.documentElement.style.setProperty('--lyric-glow-shadow', 'none');
    }

    // Sync Settings Form UI Inputs
    if (selectLanguage) selectLanguage.value = currentSettings.language;
    if (sliderOpacity) {
      sliderOpacity.value = currentSettings.opacity;
      valueOpacity.textContent = `${currentSettings.opacity}%`;
    }
    if (sliderBlur) {
      sliderBlur.value = currentSettings.blur;
      valueBlur.textContent = `${currentSettings.blur}px`;
    }
    if (toggleAlwaysOnTop) toggleAlwaysOnTop.checked = Boolean(currentSettings.alwaysOnTop);
    if (toggleDimPaused) toggleDimPaused.checked = Boolean(currentSettings.dimOnPause);
    if (selectLyricAlign) selectLyricAlign.value = currentSettings.lyricAlign || 'center';
    if (sliderFontSize) {
      sliderFontSize.value = currentSettings.fontSize;
      valueFontSize.textContent = `${currentSettings.fontSize}px`;
    }
    if (sliderTimeOffset) {
      sliderTimeOffset.value = currentSettings.timeOffset || 0;
      const offsetSec = (currentSettings.timeOffset || 0) / 10;
      valueTimeOffset.textContent = `${offsetSec >= 0 ? '+' : ''}${offsetSec.toFixed(1)}s`;
    }
    if (toggleGlow) toggleGlow.checked = currentSettings.glow;

    document.querySelectorAll('.preset-card').forEach(card => {
      if (card.dataset.preset === currentSettings.preset) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Update status badge language text & dim state
    updatePlaybackStatus(currentPlaybackStatus);
    updateClickThroughUI();
  }

  // Smooth Fade View Switcher
  function toggleSettingsView(show) {
    const targetShow = show !== undefined ? show : !isSettingsVisible;
    if (targetShow === isSettingsVisible) return;

    isSettingsVisible = targetShow;

    if (isSettingsVisible) {
      lyricsWrapper.classList.add('fade-out');
      setTimeout(() => {
        lyricsWrapper.classList.add('hidden');
        lyricsWrapper.classList.remove('fade-out');

        settingsWrapper.classList.remove('hidden');
        settingsWrapper.classList.add('fade-in');
        setTimeout(() => settingsWrapper.classList.remove('fade-in'), 350);
      }, 250);
    } else {
      settingsWrapper.classList.add('fade-out');
      setTimeout(() => {
        settingsWrapper.classList.add('hidden');
        settingsWrapper.classList.remove('fade-out');

        lyricsWrapper.classList.remove('hidden');
        lyricsWrapper.classList.add('fade-in');

        // Immediately re-center lyrics on current playing second!
        const now = performance.now();
        const statusLower = String(currentPlaybackStatus).toLowerCase();
        let livePos = lastKnownPosition;

        if (statusLower === 'playing') {
          const elapsedSec = (now - lastPositionTimestamp) / 1000;
          livePos = lastKnownPosition + elapsedSec;
        }
        const offsetSec = (currentSettings.timeOffset || 0) / 10;
        syncLyricsWithTime(livePos + offsetSec, true);

        setTimeout(() => lyricsWrapper.classList.remove('fade-in'), 350);
      }, 250);
    }
  }

  // Interactive Controls Hover - Enables mouse interaction over header & player controls even when widget body is locked
  const interactiveRegions = [headerBar, document.querySelector('.player-bar')];
  interactiveRegions.forEach(region => {
    if (region) {
      region.addEventListener('mouseenter', () => {
        if (isClickThrough && window.api && window.api.setIgnoreMouseEvents) {
          window.api.setIgnoreMouseEvents(false);
        }
      });

      region.addEventListener('mouseleave', () => {
        if (isClickThrough && window.api && window.api.setIgnoreMouseEvents) {
          window.api.setIgnoreMouseEvents(true, { forward: true });
        }
      });
    }
  });

  // Window Drag Support
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  const dragRegion = document.getElementById('drag-region');
  dragRegion.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.screenX;
    startY = e.screenY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.screenX - startX;
    const deltaY = e.screenY - startY;
    startX = e.screenX;
    startY = e.screenY;
    if (window.api && window.api.moveWindow) {
      window.api.moveWindow(deltaX, deltaY);
    }
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Utility to format seconds into mm:ss
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  // Update Status Badge (Playing / Paused / Stopped) & Paused Dimming Effect
  function updatePlaybackStatus(status) {
    currentPlaybackStatus = status || 'Stopped';
    const statusLower = String(currentPlaybackStatus).toLowerCase();
    const lang = currentSettings.language || 'tr';
    const dict = translations[lang] || translations.tr;

    if (statusLower === 'playing') {
      playbackStatusTag.textContent = dict.statusPlaying;
      playbackStatusTag.className = 'status-tag playing';
      progressBarFill.classList.remove('is-paused');
      widgetRoot.classList.remove('is-dimmed');
      if (iconPlay && iconPause) {
        iconPlay.classList.add('hidden');
        iconPause.classList.remove('hidden');
      }
    } else if (statusLower === 'paused') {
      playbackStatusTag.textContent = dict.statusPaused;
      playbackStatusTag.className = 'status-tag paused';
      progressBarFill.classList.add('is-paused');
      if (iconPlay && iconPause) {
        iconPlay.classList.remove('hidden');
        iconPause.classList.add('hidden');
      }
      if (currentSettings.dimOnPause) {
        widgetRoot.classList.add('is-dimmed');
      } else {
        widgetRoot.classList.remove('is-dimmed');
      }
    } else {
      playbackStatusTag.textContent = dict.statusStopped;
      playbackStatusTag.className = 'status-tag paused';
      progressBarFill.classList.add('is-paused');
      if (currentSettings.dimOnPause) {
        widgetRoot.classList.add('is-dimmed');
      } else {
        widgetRoot.classList.remove('is-dimmed');
      }
    }

    if (btnPlayPause && btnPlayPause.classList.contains('is-loading')) {
      btnPlayPause.classList.remove('is-loading');
      btnPlayPause.classList.add('pop-in');
      setTimeout(() => btnPlayPause.classList.remove('pop-in'), 320);
    }

    if (activeIndex >= 0 && lineElements[activeIndex]) {
      if (statusLower === 'paused') {
        lineElements[activeIndex].classList.add('paused-active');
      } else {
        lineElements[activeIndex].classList.remove('paused-active');
      }
    }
  }

  // 60 FPS Real-Time Timeline & Lyrics Interpolation Loop
  function startLiveRenderLoop() {
    if (animFrameId) cancelAnimationFrame(animFrameId);

    function loop() {
      const now = performance.now();
      const statusLower = String(currentPlaybackStatus).toLowerCase();
      let livePos = lastKnownPosition;

      if (statusLower === 'playing') {
        const elapsedSec = (now - lastPositionTimestamp) / 1000;
        livePos = lastKnownPosition + elapsedSec;
        if (totalDuration > 0 && livePos > totalDuration) {
          livePos = totalDuration;
        }
      }

      const offsetSec = (currentSettings.timeOffset || 0) / 10;
      updateProgress(livePos, totalDuration);
      syncLyricsWithTime(livePos + offsetSec);

      animFrameId = requestAnimationFrame(loop);
    }

    loop();
  }

  // Handle position tick from SMTC
  function handlePositionUpdate(position, duration, status) {
    if (status) {
      updatePlaybackStatus(status);
    }

    if (duration && duration > 0) {
      totalDuration = duration;
      timeTotal.textContent = formatTime(totalDuration);
    }

    const now = performance.now();
    const statusLower = String(currentPlaybackStatus).toLowerCase();

    if (statusLower === 'playing') {
      if (lastKnownPosition - position > 2.5) {
        lastKnownPosition = position;
        activeIndex = -1;
      } else if (position - lastKnownPosition > 3.0) {
        lastKnownPosition = position;
      } else {
        lastKnownPosition = Math.max(lastKnownPosition, position);
      }
    } else {
      lastKnownPosition = position;
    }

    lastPositionTimestamp = now;
  }

  // Subscribe to Media Changes from Main Process
  if (window.api) {
    window.api.onMediaChange((data) => {
      const { track, position, duration, status, lyricsData } = data;
      const lang = currentSettings.language || 'tr';
      const dict = translations[lang] || translations.tr;

      if (!track || !track.title) {
        trackTitle.textContent = dict.trackWaiting;
        trackArtist.textContent = dict.trackWaitingDesc;
        appTag.textContent = 'SMTC';
        totalDuration = 0;
        timeTotal.textContent = '00:00';
        lastKnownPosition = 0;
        activeIndex = -1;
        lastPositionTimestamp = performance.now();
        updateProgress(0, 0);
        updatePlaybackStatus('Stopped');
        renderPlaceholder(dict.placeholderWait);
        return;
      }

      trackTitle.textContent = track.title;
      trackArtist.textContent = track.artist || 'Bilinmeyen Sanatçı';
      appTag.textContent = (track.app || 'SMTC').toUpperCase().slice(0, 10);
      
      totalDuration = duration || track.duration || 0;
      timeTotal.textContent = formatTime(totalDuration);

      activeIndex = -1;
      handlePositionUpdate(position || 0, totalDuration, status);

      if (lyricsData && lyricsData.lyrics && lyricsData.lyrics.length > 0) {
        currentLyrics = lyricsData.lyrics;
        renderLyrics(currentLyrics, lyricsData.synced);
      } else {
        currentLyrics = [];
        renderPlaceholder(dict.placeholderNotFound);
      }
    });

    window.api.onPositionUpdate((data) => {
      const { position, duration, status } = data;
      handlePositionUpdate(position, duration, status);
    });

    window.api.onClickThroughState((state) => {
      isClickThrough = state;
      updateClickThroughUI();
    });
  }

  // Start 60 FPS smooth interpolation loop
  startLiveRenderLoop();

  // Render Lyrics Lines into Container
  function renderLyrics(lyrics, isSynced) {
    lyricsContainer.innerHTML = '';
    lineElements = [];
    activeIndex = -1;
    lyricsContainer.style.transform = 'translateY(0px)';

    if (!lyrics || lyrics.length === 0) {
      const lang = currentSettings.language || 'tr';
      const dict = translations[lang] || translations.tr;
      renderPlaceholder(dict.placeholderNotFound);
      return;
    }

    lyrics.forEach((item, idx) => {
      const lineEl = document.createElement('div');
      lineEl.className = 'lyric-line';
      lineEl.textContent = item.line;
      lineEl.dataset.index = idx;
      lineEl.dataset.time = item.time;

      if (!isSynced) {
        lineEl.style.opacity = '0.8';
        lineEl.style.fontSize = '14px';
      }

      lineEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (item.time >= 0 && totalDuration > 0) {
          activeIndex = idx;
          handlePositionUpdate(item.time, totalDuration, currentPlaybackStatus);
          if (window.api && window.api.seekPosition) {
            window.api.seekPosition(item.time);
          }
        }
      });

      lyricsContainer.appendChild(lineEl);
      lineElements.push(lineEl);
    });
  }

  function renderPlaceholder(message) {
    lyricsContainer.innerHTML = `<div class="lyric-placeholder">${message}</div>`;
    lineElements = [];
    activeIndex = -1;
    lyricsContainer.style.transform = 'translateY(0px)';
  }

  // Sync Lyrics Scroll to Playback Time
  function syncLyricsWithTime(currentTime, forceRecenter = false) {
    if (currentLyrics.length === 0 || lineElements.length === 0) return;

    let foundIndex = -1;
    for (let i = 0; i < currentLyrics.length; i++) {
      if (currentLyrics[i].time <= currentTime) {
        foundIndex = i;
      } else {
        break;
      }
    }

    if (foundIndex < activeIndex && activeIndex >= 0 && !forceRecenter) {
      const activeLineTime = currentLyrics[activeIndex] ? currentLyrics[activeIndex].time : 0;
      if (activeLineTime - currentTime < 1.5) {
        foundIndex = activeIndex;
      }
    }

    if (foundIndex !== -1 && (foundIndex !== activeIndex || forceRecenter)) {
      if (activeIndex >= 0 && lineElements[activeIndex] && activeIndex !== foundIndex) {
        lineElements[activeIndex].classList.remove('active', 'paused-active');
      }

      activeIndex = foundIndex;
      const activeEl = lineElements[activeIndex];

      if (activeEl) {
        activeEl.classList.add('active');
        if (String(currentPlaybackStatus).toLowerCase() === 'paused') {
          activeEl.classList.add('paused-active');
        }

        const wrapperHeight = lyricsWrapper.clientHeight;
        if (wrapperHeight > 0) {
          const activeOffsetTop = activeEl.offsetTop + (activeEl.offsetHeight / 2);
          const targetY = (wrapperHeight / 2) - activeOffsetTop;

          lyricsContainer.style.transform = `translateY(${targetY}px)`;
        }
      }
    }
  }

  function updateProgress(position, duration) {
    timeCurrent.textContent = formatTime(position);
    if (duration > 0) {
      const pct = Math.min(100, Math.max(0, (position / duration) * 100));
      progressBarFill.style.width = `${pct}%`;
    } else {
      progressBarFill.style.width = '0%';
    }
  }

  // Progress Bar Seek Event
  progressBarBg.addEventListener('click', (e) => {
    if (totalDuration > 0) {
      const rect = progressBarBg.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = clickX / rect.width;
      const seekSec = pct * totalDuration;
      activeIndex = -1;
      handlePositionUpdate(seekSec, totalDuration, currentPlaybackStatus);
      if (window.api && window.api.seekPosition) {
        window.api.seekPosition(seekSec);
      }
    }
  });

  // Click-Through UI Update
  function updateClickThroughUI() {
    const lang = currentSettings.language || 'tr';
    const dict = translations[lang] || translations.tr;

    if (isClickThrough) {
      widgetRoot.classList.add('is-locked');
      lockOpenIcon.classList.add('hidden');
      lockClosedIcon.classList.remove('hidden');
      btnClickThrough.title = dict.btnLockLocked;
    } else {
      widgetRoot.classList.remove('is-locked');
      lockOpenIcon.classList.remove('hidden');
      lockClosedIcon.classList.add('hidden');
      btnClickThrough.title = dict.btnLockUnlocked;
    }
  }

  btnClickThrough.addEventListener('click', async () => {
    if (window.api && window.api.setClickThrough) {
      const newState = await window.api.setClickThrough(!isClickThrough);
      isClickThrough = newState;
      updateClickThroughUI();
    }
  });

  // Window Controls
  btnMinimize.addEventListener('click', () => window.api && window.api.minimizeApp());
  btnClose.addEventListener('click', () => window.api && window.api.closeApp());



  // Settings Panel Event Listeners
  btnSettings.addEventListener('click', () => toggleSettingsView());
  btnCloseSettings.addEventListener('click', () => toggleSettingsView(false));

  selectLanguage.addEventListener('change', (e) => {
    currentSettings.language = e.target.value;
    saveSettings();
    applySettings();
  });

  document.querySelectorAll('.preset-card').forEach(card => {
    card.addEventListener('click', () => {
      currentSettings.preset = card.dataset.preset;
      saveSettings();
      applySettings();
    });
  });

  sliderOpacity.addEventListener('input', (e) => {
    currentSettings.opacity = parseInt(e.target.value, 10);
    valueOpacity.textContent = `${currentSettings.opacity}%`;
    applySettings();
  });
  sliderOpacity.addEventListener('change', () => saveSettings());

  sliderBlur.addEventListener('input', (e) => {
    currentSettings.blur = parseInt(e.target.value, 10);
    valueBlur.textContent = `${currentSettings.blur}px`;
    applySettings();
  });
  sliderBlur.addEventListener('change', () => saveSettings());

  toggleAlwaysOnTop.addEventListener('change', (e) => {
    currentSettings.alwaysOnTop = e.target.checked;
    if (window.api && window.api.toggleAlwaysOnTop) {
      window.api.toggleAlwaysOnTop();
    }
    saveSettings();
  });

  toggleDimPaused.addEventListener('change', (e) => {
    currentSettings.dimOnPause = e.target.checked;
    saveSettings();
    applySettings();
  });

  if (toggleAutoStart) {
    toggleAutoStart.addEventListener('change', async (e) => {
      if (window.api && window.api.setAutoStart) {
        await window.api.setAutoStart(e.target.checked);
      }
    });
  }

  if (window.api && window.api.onAutoStartChange) {
    window.api.onAutoStartChange((state) => {
      if (toggleAutoStart) toggleAutoStart.checked = Boolean(state);
    });
  }

  selectLyricAlign.addEventListener('change', (e) => {
    currentSettings.lyricAlign = e.target.value;
    saveSettings();
    applySettings();
  });

  sliderFontSize.addEventListener('input', (e) => {
    currentSettings.fontSize = parseInt(e.target.value, 10);
    valueFontSize.textContent = `${currentSettings.fontSize}px`;
    applySettings();
  });
  sliderFontSize.addEventListener('change', () => saveSettings());

  sliderTimeOffset.addEventListener('input', (e) => {
    currentSettings.timeOffset = parseInt(e.target.value, 10);
    const offsetSec = currentSettings.timeOffset / 10;
    valueTimeOffset.textContent = `${offsetSec >= 0 ? '+' : ''}${offsetSec.toFixed(1)}s`;
    applySettings();
  });
  sliderTimeOffset.addEventListener('change', () => saveSettings());

  toggleGlow.addEventListener('change', (e) => {
    currentSettings.glow = e.target.checked;
    saveSettings();
    applySettings();
  });

  btnResetSettings.addEventListener('click', () => {
    currentSettings = { ...DEFAULT_SETTINGS };
    saveSettings();
    applySettings();
  });

  // Playback Control Button Event Listener
  if (btnPlayPause) {
    btnPlayPause.addEventListener('click', (e) => {
      e.stopPropagation();
      btnPlayPause.classList.add('is-loading');
      if (window.api && window.api.controlMedia) {
        window.api.controlMedia('playpause');
      }
    });
  }

  // Initialize Settings on startup
  loadSettings();
});
