<div align="center">

  <img src="assets/icon.ico" width="128" height="128" alt="Desktop Lyrics Widget Logo" />

  # 🎵 Desktop Lyrics & Mini-Player Widget

  ### *Windows İçin Şeffaf, Canlı Senkronize Şarkı Sözü ve Mini Medya Oynatıcı Widget'ı*

  <p align="center">
    <a href="README.md"><img src="https://img.shields.io/badge/🇹🇷_Türkçe-Aktif-8B5CF6?style=for-the-badge" alt="Türkçe" /></a>
    <a href="README_EN.md"><img src="https://img.shields.io/badge/🇬🇧_English-İngilizce'ye_Geç-3B82F6?style=for-the-badge" alt="English" /></a>
  </p>

  [![Download Windows EXE](https://img.shields.io/badge/📥_İndir-Windows_.EXE-22c55e?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/phaticusthiccy/Desktop-Lyrics-Widget/releases/)
  [![GitHub License](https://img.shields.io/badge/Lisans-MIT-blue.svg?style=for-the-badge)](LICENSE)
  [![Electron](https://img.shields.io/badge/Electron-30.0-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![LRCLIB API](https://img.shields.io/badge/LRCLIB-API-8B5CF6?style=for-the-badge)](https://lrclib.net/)

  <p align="center">
    <b>Evrensel Windows Medya Oynatıcı ve Web Tarayıcı Şarkı Sözü Widget'ı</b><br/>
    <b>Spotify, YouTube, YouTube Music, Apple Music, Chrome, Edge ve Brave</b> üzerinde çalan müzikleri otomatik algılar ve şarkı sözlerini masaüstünüzde canlı akar.
  </p>

</div>

---

## 📌 İçindekiler

- [🎬 Canlı Kullanım Demosu \& Görseller](#-canlı-kullanım-demosu--görseller)
- [✨ Öne Çıkan Özellikler](#-öne-çıkan-özellikler)
- [🎨 10 Adet Hazır Renk Paleti](#-10-adet-hazır-renk-paleti)
- [🎮 Kontroller \& Global Kısayollar](#-kontroller--global-kısayollar)
- [🏗️ Mimari ve Proje Yapısı](#️-mimari-ve-proje-yapısı)
- [🚀 Hızlı Başlangıç \& Kurulum](#-hızlı-başlangıç--kurulum)
- [📦 Windows .EXE Derleme (Build)](#-windows-exe-derleme-build)
- [📄 Lisans](#-lisans)

---

## 🎬 Canlı Kullanım Demosu & Görseller

<div align="center">
  <h3>⚡ Canlı Senkronizasyon ve Medya Kontrol Demosu</h3>
  
  ![SS](https://github.com/user-attachments/assets/f9684f51-6153-4386-ac5b-65cb97953e21)

  <br/><br/>

  <h3>⚙️ Detaylı Kişiselleştirme & Ayarlar Sekmesi</h3>
  <img src="assets/settings.png" alt="Desktop Lyrics Widget Ayarlar Paneli" width="85%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
</div>

---

## ✨ Öne Çıkan Özellikler

| Özellik | Açıklama |
| :--- | :--- |
| **🎧 Evrensel Medya Algılama** | **Windows SMTC** ve web oynatıcı eylem yakalayıcıları ile güçlendirilmiştir. **Spotify Masaüstü**, **YouTube**, **YouTube Music**, **Apple Music**, **Chrome**, **Edge** ve **Brave** uygulamalarını sorunsuz destekler. |
| **⏯️ Dinamik Oynat/Durdur Butonu** | Tıklandığında döner/nabız atan yükleme animasyonuna geçer. Arka plandaki oynatıcıdan onay gelene kadar bekler ve gerçek teyit geldiğinde **POP zıplama efekti** ile son haline geçer. |
| **🎤 Yüksek Hassasiyetli Karaoke Motoru** | Açık kaynaklı **LRCLIB API** veritabanından zaman damgalı sözleri çeker ve milisaniyelik 60 FPS kaydırma döngüsüyle canlı akar. |
| **🔒 Tıklamayı Alta Geçirme (Lock Mode)** | Kod yazarken veya oyun oynarken farenin widget arkasındaki pencerelere tıklamasını sağlar (`setIgnoreMouseEvents`). UI veya `Ctrl + Alt + L` ile açılıp kapatılır. |
| **✨ Glassmorphic Estetik** | Canlı GPU bulanıklığı (`blur: 0px - 40px`), ayarlanabilir cam saydamlığı (%20 - %100) ve neon aktif söz ışıması. |
| **📌 Akıllı Pencere Davranışları** | **Hep Üstte Kal**, **Duraklatıldığında Soluklaştır** (Müzik durduğunda %50 soluklaşma) ve **Windows Başlangıçta Çalıştır** (`setLoginItemSettings`). |
| **⏱️ Canlı Offset & Hizalama** | Ses gecikmelerini `-3.0s` ... `+3.0s` zaman kaydırma ile düzeltin; sözleri **Ortala**, **Sola** veya **Sağa** hizalayın. |

---

## 🎨 10 Adet Hazır Renk Paleti

Widget görünümünüzü 2 satır × 5 sütun ızgarada sunulan 10 farklı hazır HSL gradyan temasıyla kişiselleştirin:

| Tema | Renk Örneği | Ana Vurgu | Neon Işıma Efekti |
| :--- | :---: | :--- | :--- |
| **Violet** | `🟣 Turkuaz/Mor` | `#8b5cf6` | `rgba(139, 92, 246, 0.6)` |
| **Mint** | `🟢 Zümrüt/Turkuaz` | `#10b981` | `rgba(16, 185, 129, 0.6)` |
| **Midnight** | `🔵 Mavi/Çivit` | `#3b82f6` | `rgba(59, 130, 246, 0.6)` |
| **Sunset** | `🟠 Pembe/Turuncu` | `#ec4899` | `rgba(236, 72, 153, 0.6)` |
| **Crystal** | `⚪ Kristal/Gök` | `#e2e8f0` | `rgba(226, 232, 240, 0.5)` |
| **Cyber** | `⚡ Neon Turkuaz/Magenta` | `#00f3ff` | `rgba(0, 243, 255, 0.7)` |
| **Amber** | `🔥 Altın/Kırmızı` | `#f59e0b` | `rgba(245, 158, 11, 0.6)` |
| **Dusk** | `🌆 Lavanta/Gül` | `#a855f7` | `rgba(168, 85, 247, 0.6)` |
| **Toxic** | `🧪 Asit/Zümrüt` | `#84cc16` | `rgba(132, 204, 22, 0.6)` |
| **Aurora** | `🌌 Kutup/Safir` | `#14b8a6` | `rgba(20, 184, 166, 0.6)` |

---

## 🎮 Kontroller & Global Kısayollar

| Eylem | Kısayol / Tetikleyici | İşlev |
| :--- | :--- | :--- |
| **Kilit Modu (Lock Mode)** | `Ctrl + Alt + L` | Tıklamayı alta geçirme modunu açan/kapatan global kısayol. |
| **Ayarlar Sekmesi** | `⚙️ İkonu` | Ayarlar sekmesini yumuşak fade efektiyle açar veya kapatır. |
| **Oynat / Duraklat** | `⏯️ Butonu` | Yükleme göstergesi ve pop zıplamasıyla müziği kontrol eder. |
| **Pencereyi Sürükle** | `Üst Bar` | Fare sol tıkı ile widget'ı ekranda istediğiniz konuma taşıyın. |
| **Zaman İlerleme** | `İlerleme Çubuğu` | Şarkıda belirli bir saniyeye sarma için tıklayın. |
| **Sistem Tepsi (Tray)** | `Sağ Tık Tepsi` | Kilit Modu, Hep Üstte Kal, Otomatik Başlatma & Çıkış menüsü. |

---

## 🏗️ Mimari ve Proje Yapısı

```
YT-SpotifyWidget/
├── main.js                  # Electron Main Process (Pencere, Tray, Kısayollar, Autostart)
├── preload.js               # İzolasyonlu güvenli IPC Köprüsü
├── package.json             # Meta veriler, bağımlılıklar ve Electron-Builder ayarları
├── .gitignore               # Yok sayılan derleme dosyaları ve loglar
├── assets/                  # İkonlar ve medya görselleri
│   ├── icon.ico             # Windows uygulama ikonu
│   ├── icon.svg             # Vektörel marka logosu
│   ├── action.mp4           # Canlı video gösterimi
│   └── settings.png         # Ayarlar ekran görüntüsü
├── services/
│   ├── lrclib.js            # LRCLIB API entegrasyonu ve LRC parser
│   └── mediaListener.js     # Windows SMTC & ASAR unpacked PowerShell IPC köprüsü
├── scripts/
│   ├── get-media.ps1        # UTF-8 Windows SMTC dinleme betiği
│   └── control-media.ps1    # Medya kontrol ve Web kısayol betiği
└── renderer/
    ├── index.html           # Widget HTML arayüzü
    ├── styles.css           # Glassmorphism, temalar ve keyframe animasyonları
    └── app.js               # 60 FPS kaydırma döngüsü ve UI yönetimi
```

---

## 🚀 Hızlı Başlangıç & Kurulum

### Gereksinimler
- **Node.js** (v18 veya üzeri)
- **Windows 10 / 11**

```bash
# 1. Depoyu klonlayın
git clone https://github.com/phaticusthiccy/Desktop-Lyrics-Widget.git
cd Desktop-Lyrics-Widget

# 2. Bağımlılıkları yükleyin
npm install

# 3. Geliştirici modunda çalıştırın
npm start
```

---

## 📦 Windows .EXE Derleme (Build)

Tek komutla kullanıma hazır Windows çalıştırılabilir dosyalarını derleyin:

```bash
npm run build
```

Derlenen çıktılar **`dist/`** klasörüne kaydedilir:
- **`dist/Desktop Lyrics Widget 1.0.0.exe`** — Taşınabilir, kurulum gerektirmeyen tek dosya Portable `.exe`.
- **`dist/Desktop Lyrics Widget Setup 1.0.0.exe`** — Başlat menüsü ve Masaüstü kısayolları oluşturan NSIS Kurulum programı.

---

## 📄 Lisans

Bu proje **MIT Lisansı** ile lisanslanmıştır. Detaylar için [`LICENSE`](LICENSE) dosyasına bakabilirsiniz.

<div align="center">
  <sub>❤️ <a href="https://github.com/phaticusthiccy">Phaticusthiccy</a> tarafından geliştirildi.</sub>
</div>
