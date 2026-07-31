# Buku Kas Harian — versi iPhone (PWA)

Aplikasi pencatatan kas harian (pemasukan & pengeluaran bersama) dalam satu
file HTML mandiri (single-file React app, dibungkus sendiri / self-unpacking).
Repo ini menambahkan lapisan PWA (Progressive Web App) di atas file tersebut
supaya bisa **di-install ke Home Screen iPhone dan terasa seperti aplikasi
native**, tanpa perlu Mac, Xcode, atau akun Apple Developer.

## Isi repo

- `index.html` — aplikasi utama (tidak diubah logikanya, hanya ditambahkan
  meta tag iOS/PWA, link manifest, dan pendaftaran service worker).
- `manifest.json` — deskriptor PWA (nama, ikon, warna tema, mode standalone).
- `service-worker.js` — cache sederhana agar halaman tetap bisa dibuka saat
  sinyal lemah. Data transaksi tetap tersimpan di `localStorage` perangkat,
  bukan di cache ini — artinya **data tidak sinkron otomatis antar perangkat**
  kecuali aplikasi sumbernya memang mengimplementasikan sinkronisasi sendiri.
- `icons/` — ikon aplikasi (180×180 untuk iOS, 192×192 & 512×512 untuk PWA).

Catatan jujur: saya tidak memodifikasi logika aplikasi (form transaksi,
kategori, impor screenshot mutasi, dsb.) — itu murni hasil ekspor dari
pembuatnya. Saya hanya menambahkan lapisan agar bisa di-install sebagai app
di iPhone.

## Kenapa bukan aplikasi native (bukan file .ipa)?

Aplikasi native iOS (yang tampil di App Store) wajib dikompilasi lewat Xcode
di komputer Mac dan ditandatangani dengan akun Apple Developer — sesi ini
tidak punya akses ke Mac/Xcode, jadi saya tidak bisa membuatkan file .ipa.
Pendekatan PWA di sini adalah cara paling realistis untuk mendapatkan
pengalaman "seperti app" di iPhone tanpa proses tersebut: ikon di Home
Screen, layar penuh tanpa address bar, dan bisa dibuka offline.

## Cara mengunggah ke GitHub

Sesi ini tidak punya koneksi GitHub yang sudah diotorisasi, jadi push perlu
dilakukan dari komputer Anda:

```bash
cd path/ke/folder/repo-ini
git init
git add .
git commit -m "Buku Kas Harian - PWA untuk iPhone"
git branch -M main
git remote add origin https://github.com/<username-anda>/buku-kas-harian.git
git push -u origin main
```

Ganti `<username-anda>` dan nama repo sesuai keinginan Anda. Buat dulu repo
kosongnya di github.com (New repository) sebelum menjalankan `git push`.

## Cara mengaktifkan GitHub Pages (agar bisa dibuka lewat URL https://)

1. Buka repo di GitHub → tab **Settings** → **Pages**.
2. Di bagian **Build and deployment**, pilih source **Deploy from a branch**.
3. Pilih branch **main**, folder **/ (root)**, lalu **Save**.
4. Tunggu 1-2 menit, GitHub akan memberi URL seperti:
   `https://<username-anda>.github.io/buku-kas-harian/`

PWA/Add to Home Screen di iPhone mensyaratkan halaman diakses lewat **https**
(bukan dibuka sebagai file lokal), jadi langkah GitHub Pages ini penting.

## Cara install ke iPhone (Add to Home Screen)

1. Buka URL GitHub Pages di atas menggunakan **Safari** di iPhone (harus
   Safari, bukan Chrome — iOS hanya mengizinkan install PWA lewat Safari).
2. Tap ikon **Share** (kotak dengan panah ke atas) di toolbar bawah.
3. Pilih **Add to Home Screen**.
4. Beri nama (default: "Kas Harian"), lalu tap **Add**.
5. Ikon aplikasi akan muncul di Home Screen dan terbuka layar penuh tanpa
   address bar Safari, seperti aplikasi biasa.

## Batasan yang perlu diketahui

- Data disimpan di `localStorage` browser pada perangkat masing-masing.
  Jika beberapa orang mencatat dari HP berbeda, catatan **tidak otomatis
  tergabung** kecuali aplikasi ini memang punya mekanisme sinkronisasi
  (misalnya lewat backend/API) — dari struktur file yang saya periksa, saya
  tidak menemukan pemanggilan API eksternal, jadi kemungkinan besar
  penyimpanan bersifat lokal per perangkat. Mohon diverifikasi langsung
  dengan mencoba mencatat dari dua perangkat berbeda dan mengecek apakah
  datanya sinkron.
- Menghapus aplikasi dari Home Screen atau membersihkan data Safari akan
  menghapus seluruh catatan (karena datanya ada di localStorage, bukan di
  server).
- Fitur "impor screenshot mutasi rekening" (jika ada di aplikasi) mungkin
  memerlukan koneksi ke layanan AI eksternal untuk membaca gambar — ini
  di luar apa yang bisa saya verifikasi tanpa menjalankan aplikasinya
  langsung.
