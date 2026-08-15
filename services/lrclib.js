/**
 * LRCLIB API Service & LRC Timestamp Parser
 * Docs: https://lrclib.net/docs
 */

const BASE_URL = 'https://lrclib.net/api';

/**
 * Parses LRC formatted string into structured timestamp array.
 * 
 * @param {string} lrcText 
 * @param {number} [offsetSeconds=0] - Manual time offset adjustment
 * @returns {Array<{ time: number, line: string }>}
 */
function parseLRC(lrcText, offsetSeconds = 0) {
  if (!lrcText || typeof lrcText !== 'string') return [];

  const lines = lrcText.split(/\r?\n/);
  const result = [];
  
  const timeRegex = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?\]/g;

  for (const line of lines) {
    const matches = [...line.matchAll(timeRegex)];
    if (matches.length === 0) continue;

    const lyricText = line.replace(timeRegex, '').trim();

    for (const match of matches) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const millisecondsRaw = match[3] || '0';
      const milliseconds = parseInt(millisecondsRaw.padEnd(3, '0').slice(0, 3), 10);

      let totalSeconds = minutes * 60 + seconds + milliseconds / 1000 + offsetSeconds;
      
      result.push({
        time: Math.max(0, totalSeconds),
        line: lyricText || '♪'
      });
    }
  }

  result.sort((a, b) => a.time - b.time);
  return result;
}

/**
 * Parses plain un-synced lyrics text into simple lines
 */
function parsePlainLyrics(plainText) {
  if (!plainText) return [];
  return plainText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => ({ time: 0, line }));
}

/**
 * Fetch best match lyrics for a track
 */
async function fetchLyrics(artist, title, duration) {
  if (!title) {
    return { synced: false, lyrics: [] };
  }

  const cleanTitle = title.replace(/\(feat\..*?\)/gi, '').replace(/\[.*?\]/g, '').trim();
  const cleanArtist = (artist || '').replace(/\(feat\..*?\)/gi, '').trim();
  const query = `${cleanArtist.split(" - ")[0]} ${cleanTitle.split("(")[0]}`.trim();

  try {
    const searchUrl = `${BASE_URL}/search?q=${encodeURIComponent(query)}`;
    const res = await fetch(searchUrl);
    if (res.ok) {
      const results = await res.json();
      if (Array.isArray(results) && results.length > 0) {
        const valid = results.filter(item => item.syncedLyrics || item.plainLyrics);
        if (valid.length > 0) {
          let best = valid.find(v => v.syncedLyrics) || valid[0];
          return {
            id: best.id,
            trackName: best.trackName,
            artistName: best.artistName,
            albumName: best.albumName || '',
            synced: Boolean(best.syncedLyrics),
            lyrics: best.syncedLyrics ? parseLRC(best.syncedLyrics) : parsePlainLyrics(best.plainLyrics),
            rawSynced: best.syncedLyrics || '',
            rawPlain: best.plainLyrics || ''
          };
        }
      }
    }
  } catch (err) {
    console.error('[LRCLIB] Lyrics fetch error:', err.message);
  }

  return {
    id: null,
    trackName: title,
    artistName: artist,
    albumName: '',
    synced: false,
    lyrics: [{ time: 0, line: 'Şarkı sözü bulunamadı' }]
  };
}

module.exports = {
  parseLRC,
  parsePlainLyrics,
  fetchLyrics
};
