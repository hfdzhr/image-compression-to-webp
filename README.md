# Image Compression CLI

Alat baris perintah (CLI) sederhana untuk mengompresi dan mengonversi gambar ke format WebP menggunakan library `sharp`.

## Fitur

- Mengonversi berbagai format gambar ke WebP secara otomatis.
- Mendukung kompresi massal (multiple files).
- Mendukung pemindaian folder secara rekursif.
- Menghitung rasio kompresi (persentase pengecilan ukuran).
- Opsi untuk menghapus file asli setelah proses selesai.
- Pengaturan kualitas kompresi.

## Instalasi

Pastikan Anda telah menginstal Node.js di sistem Anda.

1. Clone repositori ini atau unduh kodenya.
2. Instal dependensi:

```bash
npm install
```

3. (Opsional) Tautkan secara global agar bisa dipanggil dari mana saja:

```bash
npm link
```

## Penggunaan

Jika sudah menggunakan `npm link`:

```bash
image-compress [options] <file...>
```

Atau menggunakan node secara langsung:

```bash
node index.js [options] <file...>
```

### Opsi

| Opsi | Alias | Tipe | Deskripsi | Default |
|------|-------|------|-----------|---------|
| `--quality` | `-q` | Number | Kualitas kompresi (0-100) | `80` |
| `--delete` | `-d` | Boolean | Hapus file asli setelah kompresi | `false` |
| `--recursive` | `-R` | Boolean | Scan folder secara rekursif | `false` |
| `--rename` | `-r` | String | Ubah nama file (hanya untuk satu file) | `null` |
| `--help` | | | Tampilkan bantuan | |

## Contoh Penggunaan

### 1. Kompresi Satu Gambar
```bash
image-compress photo.jpg
```
*Hasil: `photo.webp`*

### 2. Kompresi dengan Kualitas Tertentu
```bash
image-compress photo.jpg -q 60
```

### 3. Mengubah Nama File Output
```bash
image-compress photo.jpg -r hasil-kompresi
```
*Hasil: `hasil-kompresi.webp`*

### 4. Kompresi Semua Gambar dalam Folder
```bash
image-compress ./images
```

### 5. Kompresi Folder Secara Rekursif dan Hapus File Asli
```bash
image-compress ./images -R -d
```

## Format yang Didukung
`.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`, `.gif`, `.avif`, `.tiff`

## Lisensi
ISC
