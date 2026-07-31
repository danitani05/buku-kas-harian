# Buku Kas Harian — versi iPhone (PWA + Firestore)

Aplikasi pencatatan kas harian (pemasukan & pengeluaran bersama) dalam satu
file HTML mandiri (single-file React app, dibungkus sendiri / self-unpacking).
Repo ini menambahkan dua lapisan di atas file aslinya:

1. **PWA** — supaya bisa di-install ke Home Screen iPhone dan terasa seperti
   aplikasi native, tanpa perlu Mac, Xcode, atau akun Apple Developer.
2. **Firebase Firestore** — supaya data tersimpan di cloud dan bisa diakses
   dari beberapa HP/perangkat berbeda, bukan hanya di satu perangkat.

## Isi repo

- `index.html` — aplikasi utama. Logika pencatatan transaksi tidak diubah,
  hanya ditambahkan: meta tag iOS/PWA, link manifest, pendaftaran service
  worker, SDK Firebase (compat), dan implementasi `window.storage` yang
  dipakai kode aslinya untuk baca/tulis data (lihat bagian Firestore di bawah).
- `manifest.json` — deskriptor PWA (nama, ikon, warna tema, mode standalone).
- `service-worker.js` — cache sederhana agar halaman (bukan datanya) tetap
  bisa dibuka saat sinyal lemah.
- `icons/` — ikon aplikasi (180×180 untuk iOS, 192×192 & 512×512 untuk PWA).

## Penyimpanan data: Firebase Firestore

Project Firebase: **buku-kas-harian-6c5ce** (paket gratis/Spark, region
Jakarta - asia-southeast2). Data tersimpan di koleksi Firestore
`bukuKasHarian`, satu dokumen per jenis data (`categories-v1`, `expenses-v1`,
`device-name-v1`).

Catatan keamanan yang perlu Anda ketahui: security rules Firestore saat ini
mengizinkan **siapa pun membaca dan menulis** ke koleksi tersebut
(`allow read, write: if true`) — tanpa login. Ini sengaja dibuat sederhana
agar cocok dengan sifat aplikasi yang memang "bersama" tanpa akun. Konsekuensi:
siapa pun yang tahu `projectId` dan `apiKey` (yang memang tampil di kode
`index.html` publik ini — itu wajar untuk Firebase, bukan kebocoran) bisa ikut
menulis ke database yang sama. Untuk kas harian pribadi/keluarga/tim kecil
umumnya ini bisa diterima, tapi kalau ingin dibatasi hanya untuk yang Anda
percaya, beri tahu saya untuk menambahkan otentikasi (mis. kode akses
sederhana atau login Google) sebelum dipakai lebih luas.

Kelola database di
[Firebase Console](https://console.firebase.google.com/project/buku-kas-harian-6c5ce/firestore).

## Fitur "Impor dari screenshot" — OCR lokal (Tesseract.js), tanpa API key

Kode asli aplikasi ini memanggil `https://api.anthropic.com/v1/messages`
langsung dari browser tanpa API key — itu hanya berfungsi di lingkungan
preview khusus, bukan API sungguhan yang bisa dipakai publik, sehingga selalu
gagal di GitHub Pages.

Sebagai gantinya, fitur ini sekarang memakai **Tesseract.js**, mesin OCR
(pembaca teks dari gambar) yang berjalan sepenuhnya di browser/HP Anda sendiri:

- Tidak butuh API key, akun, atau server pihak ketiga apa pun.
- Tidak ada biaya dan tidak ada batas jumlah pemakaian.
- Gambar screenshot Anda tidak pernah dikirim ke mana pun — semua diproses
  lokal di perangkat.

Konsekuensinya: hasil ekstraksi jauh lebih kasar dibanding memakai model AI
(Claude/Gemini). Tesseract hanya membaca teks mentah dari gambar lalu kode
mencocokkan pola sederhana (tanggal, nominal dengan tanda +/-, sisa teks
sebagai deskripsi) — tidak benar-benar "memahami" tata letak seperti model
AI. Untuk hasil terbaik: gunakan screenshot yang tajam/tidak buram, dan selalu
**periksa & koreksi** daftar transaksi hasil pindai sebelum disimpan, karena
deskripsi atau tanggal bisa saja salah baca terutama pada gambar yang kecil,
miring, atau berlatar belakang ramai.

Kalau nanti Anda ingin akurasi setara AI (Claude/Gemini) tinggal bilang saja —
itu tetap mungkin ditambahkan lewat proxy aman (mis. Cloudflare Worker) tanpa
mengekspos API key di kode publik ini.

## Kenapa bukan aplikasi native (bukan file .ipa)?

Aplikasi native iOS (yang tampil di App Store) wajib dikompilasi lewat Xcode
di komputer Mac dan ditandatangani dengan akun Apple Developer. Pendekatan
PWA di sini adalah cara paling realistis untuk mendapatkan pengalaman
"seperti app" di iPhone tanpa proses tersebut: ikon di Home Screen, layar
penuh tanpa address bar, dan bisa dibuka saat offline (halamannya saja —
data tetap butuh koneksi untuk sinkron ke Firestore).

## Cara mengaktifkan GitHub Pages (agar bisa dibuka lewat URL https://)

1. Buka repo di GitHub → tab **Settings** → **Pages**.
2. Di bagian **Build and deployment**, pilih source **Deploy from a branch**.
3. Pilih branch **main**, folder **/ (root)**, lalu **Save**.
4. GitHub akan memberi URL: `https://danitani05.github.io/buku-kas-harian/`

## Cara install ke iPhone (Add to Home Screen)

1. Buka URL GitHub Pages di atas menggunakan **Safari** di iPhone (harus
   Safari, bukan Chrome — iOS hanya mengizinkan install PWA lewat Safari).
2. Tap ikon **Share** (kotak dengan panah ke atas) di toolbar bawah.
3. Pilih **Add to Home Screen**, beri nama, tap **Add**.
4. Ikon aplikasi muncul di Home Screen, terbuka layar penuh tanpa address bar.

## Batasan yang perlu diketahui

- Data kini tersimpan di Firestore (cloud), bukan lagi hanya di
  `localStorage`. Beberapa perangkat yang membuka URL yang sama akan melihat
  data yang sama, dengan sedikit jeda (aplikasi mengambil data saat halaman
  dimuat, bukan realtime-push — refresh halaman untuk melihat catatan
  terbaru dari perangkat lain).
- Karena tidak ada login, siapa pun yang tahu alamat situs ini bisa
  membaca/menulis data kas — lihat bagian "Penyimpanan data" di atas.
- Fitur "impor screenshot mutasi rekening" aktif memakai OCR lokal
  (Tesseract.js) — akurasinya kasar, selalu periksa ulang hasilnya sebelum
  disimpan (lihat bagian di atas).
