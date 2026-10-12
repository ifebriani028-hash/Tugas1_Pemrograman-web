document.addEventListener("DOMContentLoaded", function() {
    // 1. Login & Validasi Form
    const loginForm = document.getElementById('loginForm');
    const modalBox = document.getElementById('modalBox');
    const modalMessage = document.getElementById('modalMessage');
    const closeModal = document.querySelector('.close');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = document.getElementById('email').value.trim();
            const passwordInput = document.getElementById('password').value.trim();

            // validasi keberadaan data pengguna di data.js
            if (typeof dataPengguna !== 'undefined') {
                const userFound = dataPengguna.find(u => u.email === emailInput && u.password === passwordInput);

                if (userFound) {
                    localStorage.setItem('sittaUser', JSON.stringify(userFound));
                    window.location.href = "dashboard.html";
                } else {
                    showModal("Email/password yang anda masukkan salah!");
                }
            } else {
                showModal("Data pengguna belum dimuat!");
            }
        });
    }

    // Button Lupa Password & Daftar
    const btnLupaPassword = document.getElementById('btnLupaPassword');
    const btnDaftar = document.getElementById('btnDaftar');

    if (btnLupaPassword) {
        btnLupaPassword.addEventListener('click', (e) => {
            e.preventDefault();
            showModal("Silakan hubungi administrator UT-Daerah atau Pusat untuk reset password.");
        });
    }

    if (btnDaftar) {
        btnDaftar.addEventListener('click', (e) => {
            e.preventDefault();
            showModal("Pendaftaran akun baru dilakukan melalui sistem registrasi utama UT.");
        });
    }

    function showModal(message) {
        if (modalBox) {
            modalMessage.innerText = message;
            modalBox.style.display = "block";
        }
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modalBox.style.display = "none";
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modalBox) {
            modalBox.style.display = "none";
        }
    });

    // 2. Halaman Dashboard
    const greetingMessage = document.getElementById('greetingMessage');
    const userInfo = document.getElementById('userInfo');

    if (greetingMessage) {
        const activeUser = JSON.parse(localStorage.getItem('sittaUser'));
        const jam = new Date().getHours();
        let waktu = "pagi";
        if (jam >= 11 && jam < 15) {
            waktu = "siang";
        } else if (jam >= 15 && jam < 18) {
            waktu = "sore";
        } else if (jam >= 18 && jam < 4) {
            waktu = "malam";
        }
        greetingMessage.innerText = `Selamat ${waktu} ${activeUser.nama}`;
    }

    // 3. Tracking
    const btnCariDO = document.getElementById('btnCariDO');
    const noDOInput = document.getElementById('noDO');

    function prosesTracking() {
        if (!noDOInput) return;
        const noDO = noDOInput.value.trim();
        const resultSection = document.getElementById('trackingResult');
        
        if (noDO === "") {
            alert("Masukkan Nomor Delivery Order terlebih dahulu!");
            return;
        }

        if (typeof dataTracking !== 'undefined' && dataTracking[noDO]) {
            const data = dataTracking[noDO];
            if (resultSection) resultSection.classList.remove('hidden');
            
            const setVal = (id, text) => {
                const el = document.getElementById(id);
                if (el) el.innerText = text;
            };

            setVal('resNama', data.nama);
            setVal('resNoDO', "No. DO: " + data.nomorDO);
            setVal('resKurir', data.ekspedisi);
            setVal('resTanggal', data.tanggalKirim);
            setVal('resPaket', data.paket);
            setVal('resTotal', data.total);

            const timelineList = document.getElementById('timelineList');
            if (timelineList) {
                timelineList.innerHTML = "";
                data.perjalanan.forEach(p => {
                    let li = document.createElement('li');
                    li.innerHTML = `<b>[${p.waktu}]</b> ${p.keterangan}`;
                    timelineList.appendChild(li);
                });
            }
        } else {
            alert("Nomor Delivery Order tidak ditemukan!");
            if (resultSection) resultSection.classList.add('hidden');
        }
    }

    if (btnCariDO) {
        btnCariDO.addEventListener('click', prosesTracking);
    }

    if (noDOInput) {
        noDOInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                prosesTracking();
            }
        });
    }

    // 4. Stok Bahan Ajar
    const stokContainer = document.getElementById('stokContainer');

    function renderStok() {
        if (!stokContainer) return;
        stokContainer.innerHTML = "";
        
        if (typeof dataBahanAjar !== 'undefined') {
            dataBahanAjar.forEach(item => {
                let card = document.createElement('div');
                card.className = 'stok-card';
                card.innerHTML = `
                    <img src="${item.cover}" alt="${item.namaBarang}" onerror="this.src='https://via.placeholder.com/120x160?text=Cover+BMP'">
                    <h4>${item.namaBarang}</h4>
                    <p><b>Kode Lokasi:</b> ${item.kodeLokasi}</p>
                    <p><b>Kode Barang:</b> ${item.kodeBarang}</p>
                    <p><b>Jenis:</b> ${item.jenisBarang}</p>
                    <p><b>Edisi:</b> ${item.edisi}</p>
                    <p><b>Stok Tersedia:</b> ${item.stok}</p>
                `;
                stokContainer.appendChild(card);
            });
        }
    }

    renderStok();

    // Tambah Stok Baru
    const formTambahStok = document.getElementById('formTambahStok');
    if (formTambahStok) {
        formTambahStok.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const kodeLokasi = document.getElementById('kodeLokasi').value;
            const kodeBarang = document.getElementById('kodeBarang').value;
            const namaBarang = document.getElementById('namaBarang').value;
            const jenisBarang = document.getElementById('jenisBarang').value;
            const edisi = document.getElementById('edisi').value;
            const stok = parseInt(document.getElementById('stok').value);
            const cover = document.getElementById('cover').value;

            if (typeof dataBahanAjar !== 'undefined') {
                dataBahanAjar.push({ kodeLokasi, kodeBarang, namaBarang, jenisBarang, edisi, stok, cover });
                renderStok();
            }
            
            formTambahStok.reset();
            alert("Data bahan ajar baru berhasil ditambahkan!");
        });
    }
});