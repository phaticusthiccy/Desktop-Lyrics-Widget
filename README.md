<p align="center">
  <img src="assets/icon.ico" width="96" height="96" alt="Desktop Lyrics Widget Logo" />
</p>

<h1 align="center">🎵 Desktop Lyrics & Mini-Player Widget</h1>

<p align="center">
  Windows işletim sisteminde çalmakta olan tüm müzikleri (<b>Spotify, YouTube, YouTube Music, Apple Music, Chrome, Edge, Brave</b> vb.) anlık algılayan, <b>LRCLIB</b> veritabanından zaman damgalı canlı şarkı sözlerini çeken, <b>Glassmorphism</b> saydam tasarıma sahip modern masaüstü widget'ı.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Electron-30.0-47848F?style=for-the-badge&logo=electron&logoColor=white" alt="Electron" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/LRCLIB-API-8B5CF6?style=for-the-badge" alt="LRCLIB" />
  <img src="https://img.shields.io/badge/Windows-SMTC-0078D6?style=for-the-badge&logo=windows&logoColor=white" alt="Windows SMTC" />
</p>

---

## 🌟 Öne Çıkan Özellikler

- **🎧 Evrensel Medya Algılama**: Windows SMTC servisi ve Web Oynatıcı kısayol entegrasyonu sayesinde Spotify masaüstü uygulamasının yanı sıra tarayıcılarda (Chrome, Edge, Brave vb.) açılan YouTube ve web müziklerini anında tespit eder.
- **⏯️ Yükleme & POP Animasyonlu Oynat/Durdur Butonu**: Medya butonuna basıldığında arka plandan onay gelene kadar neon nabız ve dönme animasyonu gösterilir. Gerçek yanıt teyit edildiği an buton şık bir **POP zıplama efekti** ile son ikon halini alır.
- **🎤 Canlı Şarkı Sözü Senkronizasyonu**: [LRCLIB API](https://lrclib.net/) veritabanından zaman damgalı (`syncedLyrics`) sözleri çekerek milisaniye hassasiyetinde canlı akar.
- **⚙️ Gelişmiş Ayarlar Sekmesi**:
  - **🌐 Dil Seçeneği**: Türkçe ve İngilizce (i18n) dil desteği.
  - **🎨 10 Adet Hazır Renk Paleti**: 2 satır × 5 sütun ızgarada 10 farklı neon teması (`Violet`, `Mint`, `Midnight`, `Sunset`, `Crystal`, `Cyber`, `Amber`, `Dusk`, `Toxic`, `Aurora`).
  - **✨ Görünüm & Saydamlık**: Canlı saydamlık (%20 - %100) ve arka plan bulanıklık (blur: 0px - 40px) kontrolleri.
  - **📌 Pencere Davranışları**:
    - **Hep Üstte Kal**: Diğer uygulamaların üzerinde kalma modu.
    - **Duraklatıldığında Soluklaştır**: Müzik durduğunda otomatik %50 soluklaşma.
    - **🚀 Başlangıçta Çalıştır**: Windows açılışında otomatik başlama desteği.
  - **🎤 Söz Hizalama & Zaman Offset'i**: Metni Ortala/Sola/Sağa hizalama, Söz Boyutu slider'ı ve `-3.0s` ... `+3.0s` canlı zaman kaydırma ayarı.
- **🔒 Tıklamayı Alta Geçirme (Lock Mode)**: Kod yazarken veya oyun oynarken farenin widget arkasındaki pencerelere tıklamasını sağlar (`setIgnoreMouseEvents`).
- **📦 Windows `.exe` Derleme Desteği**: `npm run build` ile tek dosya Taşınabilir (`Portable EXE`) veya Kurulum programı (`Setup Installer`) üretme.

---

## 📁 Proje Yapısı

```
YT-SpotifyWidget/
├── main.js                  # Electron Main Process (Pencere, IPC, Tray, Autostart)
├── preload.js               # Main & Renderer arası güvenli IPC köprüsü
├── package.json             # Bağımlılıklar, meta veriler ve build konfigürasyonu
├── .gitignore               # Yok sayılan proje klasörleri ve loglar
├── services/
│   ├── lrclib.js            # LRCLIB API entegrasyonu ve LRC parser
│   └── mediaListener.js     # Windows SMTC medya dinleme servisi
├── scripts/
│   ├── get-media.ps1        # Medya ve oynatma durumunu çeken PowerShell betiği
│   └── control-media.ps1    # Medya kontrolü (Oynat/Durdur) PowerShell betiği
└── renderer/
    ├── index.html           # Widget ve Ayarlar HTML yapısı
    ├── styles.css           # Glassmorphism, temalar ve animasyon stilleri
    └── app.js               # Canlı senkronizasyon ve Ayarlar yönetimi
```

---

## 🛠️ Kurulum ve Çalıştırma

### Gereksinimler
- **Node.js** (v18+)
- **Windows 10 / 11**

### 1. Bağımlılıkları Kurun
```bash
npm install
```

### 2. Geliştirme Modunda Çalıştırın
```bash
npm start
```

### 3. Windows `.exe` Dosyalarını Derleyin (Build)
```bash
npm run build
```
Derleme tamamlandığında **`dist/`** klasörü içinde derlenmiş çıktı dosyalarınız oluşur:
- **`dist/Desktop Lyrics Widget 1.0.0.exe`** (Portable / Taşınabilir EXE)
- **`dist/Desktop Lyrics Widget Setup 1.0.0.exe`** (Windows Kurucu)

---

## 🎮 Kontroller ve Kısayollar

| Buton / Kısayol | Açıklama |
| :--- | :--- |
| **⚙️ Ayarlar Butonu** | Ayarlar sekmesini yumuşak fade efektiyle açar/kapatır. |
| **🔓 / 🔒 Kilit Butonu** | Tıklamayı alta geçirme modunu (Click-Through) açar/kapatır. |
| **⌨️ Ctrl + Alt + L** | Her yerden kilit modunu açıp kapatan global kısayol. |
| **⏯️ Oynat / Duraklat** | Müziği duraklatır veya tekrar çalıştırır (Yükleme ve Pop animasyonlu). |
| **Üst Bar (Sürükleme)** | Fare sol tıkı ile widget'ı ekranda istediğiniz konuma taşımanızı sağlar. |
| **İlerleme Çubuğu** | Şarkıda belirli bir saniyeye sarma/ilerleme için tıklanabilir. |

---

## 📄 Lisans

Bu proje **MIT** lisansı ile lisanslanmıştır.
