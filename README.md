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

## Proteksi akses: PIN + Firebase Anonymous Auth

Aplikasi ini sekarang meminta **PIN 6 digit** setiap kali dibuka, sebelum
data (baik lokal maupun Firestore) bisa diakses. Setelah PIN benar, aplikasi
login secara anonim ke Firebase Auth, dan Firestore Security Rules diubah
menjadi:

```
allow read, write: if request.auth != null;
```

artinya permintaan baca/tulis ke Firestore sekarang ditolak kalau belum
login — tidak lagi terbuka untuk siapa saja seperti sebelumnya.

Catatan jujur soal batasannya: ini adalah **penghalang di level aplikasi**,
bukan enkripsi tingkat data sensitif/finansial besar. PIN disimpan dalam
kode sebagai hash SHA-256, tapi karena aplikasi ini statis (tanpa server
sendiri) dan ruang kombinasi PIN 6 digit relatif kecil, seseorang yang
benar-benar paham teknis Firebase dan berniat menyerang tetap punya jalan
untuk mem-bypass PIN (misalnya dengan memanggil Firebase Auth API langsung,
karena anonymous sign-in memang dirancang terbuka untuk siapa saja yang
punya `apiKey` publik proyek ini). Untuk kas harian keluarga/tim kecil, ini
cukup sebagai penghalang terhadap orang iseng yang kebetulan tahu alamat
situsnya — tapi bukan proteksi setara sistem finansial sungguhan. Kalau
kebutuhan keamanan Anda meningkat, itu perlu arsitektur backend sungguhan
(login email/password atau Google, plus server proxy) di luar cakupan
aplikasi statis semacam ini.

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
- Akses kini dilindungi PIN (lihat bagian "Proteksi akses" di atas) — ini
  penghalang level aplikasi, bukan enkripsi kelas enterprise.
- Fitur "impor screenshot mutasi rekening" aktif memakai OCR lokal
  (Tesseract.js) — akurasinya kasar, selalu periksa ulang hasilnya sebelum
  disimpan (lihat bagian di atas).
