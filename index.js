// Author: Dimas Erlansyah
// Tanggal dibuat: 31 Desember 2024
// Status: Masih Tahap Pengembangan
// Deskripsi: Bot WhatsApp buat Kantin Sekolah yang terhubung ke database MySQL
// Fitur: Menampilkan Pesan menu, promo, info kantin, dan interaksi sama user lewat WhatsApp

const qrcode = require('qrcode-terminal'); // Buat QR Code di terminal biar bisa scan
const { Client, LocalAuth } = require('whatsapp-web.js'); // Library buat bot WhatsApp
const mysql = require('mysql2'); // Buat koneksi ke database MySQL

// Koneksi ke database MySQL
const connection = mysql.createConnection({
    host: 'localhost', // Tempat database jalan
    user: 'root', // Username MySQL
    password: 'DimasPenjualan123', // Password database
    database: 'penjualan_db' // Nama database
});

// Cek koneksi database
connection.connect((err) => {
    if (err) {
        console.error('Error konek ke database: ' + err.stack); // Kalo error muncul error di terminal
        return;
    }
    console.log('Koneksi ke database berhasil!'); // Kalo sukses, muncul pesan sukses
});

// Set up WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth(), // Pake autentikasi lokal biar nggak perlu scan tiap kali
    puppeteer: {
        executablePath: '/usr/bin/google-chrome', // Path Chrome buat WhatsApp Web
        headless: true // Mode headless, jadi nggak perlu tampilan browser
    }
});

// Handle QR code buat login
client.on('qr', qr => {
    console.log('Scan QR Code ini pake WhatsApp kamu:');
    qrcode.generate(qr, { small: true }); // Tampil QR Code di terminal
});

// Handle bot siap terhubung
client.on('ready', () => {
    console.log('Bot WhatsApp siap digunakan!'); // Tampil pesan kalo bot udah siap
});

// Handle pesan dari user
client.on('message', message => {
    const lowerCaseMessage = message.body.toLowerCase(); // Convert pesan jadi huruf kecil buat cek lebih gampang

    // Balas pesan 'halo' dari user
    if (lowerCaseMessage === 'halo') {
        message.reply(`Halo! 👋\nIni bot WhatsApp dari *Dimas Erlansyah*. Terima kasih udah hubungi kami.\n\nKetik *Menu* buat liat daftar menu makanan.`);
    }
    // Kalo user nanya 'menu', kirimkan daftar menu dari database
    else if (lowerCaseMessage === 'menu') {
        const query = 'SELECT nama_produk, harga FROM penjualan'; // Ambil data menu dan harga

        connection.query(query, (err, results) => {
            if (err) {
                message.reply('Gagal ambil menu. Coba lagi nanti.'); // Kalo error, kasih tau user
                console.error(err); // Log error di terminal
                return;
            }

            let menuText = '🍽️ *Menu Kantin Sekolah Hari Ini* 🍽️\n\n';
            results.forEach((menu, index) => {
                menuText += `${index + 1}️⃣ *${menu.nama_produk}* - Rp${menu.harga}\n`; // Tampil menu dan harga
            });

            menuText += '\nKetik nomor menu buat pesen!';
            message.reply(menuText); // Kirimkan daftar menu ke user
        });
    }
    // Kalo user nanya 'promo', kasih info promo
    else if (lowerCaseMessage === 'promo') {
        message.reply(`🎉 *Promo Hari Ini* 🎉\n*Diskon 10%* untuk semua menu di Kantin Sekolah! 💸\n\nJangan lewatkan kesempatan ini! Promo hanya berlaku hari ini! Ketik "Menu" untuk memilih makanan yang Anda inginkan.`);
    }
    // Kalo user nanya 'info', kasih info tentang kantin
    else if (lowerCaseMessage === 'info') {
        message.reply(`📢 *Informasi Kantin Sekolah* 📢\n\n*Kantin Sekolah* menyediakan berbagai makanan sehat dan bergizi untuk mendukung aktivitas belajar. Kami buka setiap hari dari 07:00 - 14:00.\n\n📍 Lokasi: Lantai 1, Gedung Utama Sekolah\n📞 Hubungi Kami: wa.me/1234567890\n\nKami siap melayani Anda dengan sepenuh hati!`);
    }
    // Kalo user nanya 'jam operasional', kasih jam operasional kantin
    else if (lowerCaseMessage === 'jam operasional') {
        message.reply(`⏰ *Jam Operasional Kantin Sekolah* ⏰\n\nKantin Sekolah buka setiap hari Senin sampai Jumat, mulai pukul 07:00 - 14:00.\n\nJangan lewatkan kesempatan untuk makan sehat dan enak!`);
    }
    // Kalo user nanya 'terima kasih', balas dengan ucapan terima kasih
    else if (lowerCaseMessage === 'terima kasih') {
        message.reply(`Terima kasih telah menghubungi Kantin Sekolah! 😊 Kami siap melayani Anda dengan sepenuh hati. Jika ada pertanyaan lebih lanjut, jangan ragu untuk bertanya.`);
    }
    // Kalo user nanya 'makanan sehat', kasih info makanan sehat
    else if (lowerCaseMessage === 'makanan sehat') {
        message.reply(`🍏 *Makanan Sehat di Kantin Sekolah* 🍏\nKami menyediakan makanan sehat dan bergizi untuk mendukung aktivitas belajar, seperti *Gado-Gado*, *Soto Ayam*, dan *Mie Goreng*.\nCek menu lebih lengkap dengan mengetik "Menu"`);
    }
    // Kalo user nanya 'lokasi', kasih info lokasi kantin
    else if (lowerCaseMessage === 'lokasi') {
        message.reply(`📍 *Lokasi Kantin Sekolah* 📍\nKami terletak di Lantai 1, Gedung Utama Sekolah.\nTunggu apa lagi? Ayo mampir dan nikmati makanan lezat kami!`);
    }
    // Kalo user nanya 'cara bayar', kasih info cara bayar
    else if (lowerCaseMessage === 'cara bayar') {
        message.reply(`💳 *Cara Pembayaran di Kantin Sekolah* 💳\nKami menerima pembayaran tunai dan dengan aplikasi pembayaran digital seperti OVO, Gopay, dan DANA.\nNikmati kemudahan bertransaksi di kantin kami!`);
    }
    // Kalo user nanya 'vegan', kasih info menu vegan
    else if (lowerCaseMessage === 'vegan') {
        message.reply(`🌱 *Menu Vegan di Kantin Sekolah* 🌱\nKami memiliki pilihan menu vegan seperti *Gado-Gado* dan *Soto Ayam* yang cocok untuk Anda yang menjaga pola makan sehat.\nCek menu lainnya dengan mengetik "Menu"`);
    }
    // Kalo user nanya 'best seller', kasih info menu best seller
    else if (lowerCaseMessage === 'best seller') {
        message.reply(`🔥 *Menu Best Seller* 🔥\nMenu yang paling banyak diminati adalah *Nasi Goreng* dan *Mie Ayam*. Rasakan kenikmatannya! Ketik "Menu" untuk melihat semua pilihan.`);
    }
    // Kalo user nanya 'promo lain', kasih info promo lain
    else if (lowerCaseMessage === 'promo lain') {
        message.reply(`🎁 *Promo Menarik Lainnya* 🎁\nSelain diskon 10% hari ini, kami juga memiliki promo *Beli 1 Gratis 1* untuk menu *Sate Ayam*. Jangan lewatkan kesempatan ini!`);
    }
    // Kalo user nanya 'porsi besar', kasih info porsi besar
    else if (lowerCaseMessage === 'porsi besar') {
        message.reply(`🍽️ *Porsi Besar* 🍽️\nJika Anda suka makan dengan porsi besar, kami punya *Nasi Goreng* dan *Mie Goreng* yang bisa memuaskan perut Anda. Ayo pesan sekarang!`);
    }
    // Kalo user nanya 'menu anak', kasih info menu anak
    else if (lowerCaseMessage === 'menu anak') {
        message.reply(`🍔 *Menu Anak di Kantin Sekolah* 🍔\nKami juga menyediakan menu yang cocok untuk anak-anak seperti *Sate Ayam* dan *Gado-Gado*. Nikmati makanan sehat untuk buah hati Anda!`);
    }
    // Kalo user nanya 'pedas', kasih info menu pedas
    else if (lowerCaseMessage === 'pedas') {
        message.reply(`🌶️ *Menu Pedas di Kantin Sekolah* 🌶️\nKami punya menu pedas seperti *Mie Goreng* dan *Sate Ayam* yang akan memanjakan lidah Anda. Berani coba?`);
    }
    // Kalo user nanya 'pengiriman', kasih info pengiriman makanan
    else if (lowerCaseMessage === 'pengiriman') {
        message.reply(`🚚 *Pengiriman Makanan* 🚚\nKami tidak melayani pengiriman makanan saat ini. Anda bisa datang langsung ke Kantin Sekolah dan nikmati makanan lezat kami!`);
    }
    // Kalo user nanya 'liburan', kasih info liburan kantin
    else if (lowerCaseMessage === 'liburan') {
        message.reply(`🎉 *Buka di Liburan* 🎉\nKantin Sekolah tutup pada hari libur nasional, namun buka seperti biasa di hari kerja. Jangan lewatkan kesempatan untuk menikmati makanan enak!`);
    }
});

// Mulai bot WhatsApp
client.initialize(); // Kalo semua siap, jalankan bot
