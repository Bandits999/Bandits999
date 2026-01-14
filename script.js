function changeMahri(id, isInitial = false) {
const next = document.getElementById(id);
if (!next) return;
const current = document.querySelector('.tabContent.isActive');
if (current === next) return;

// Simpan ID tab ke localStorage
localStorage.setItem('activeTab', id);

if (isInitial) {
    // Jika ini pemuatan awal, pindah tab secara instan tanpa animasi
    if (current) {
    current.classList.remove('isActive');
    current.style.display = 'none';
    }
    next.style.display = 'block';
    next.classList.add('isActive');
    return;
}

next.style.display = 'block';
if (current) {
    current.classList.add('isFadingOut');
    setTimeout(() => {
    current.classList.remove('isActive', 'isFadingOut');
    current.style.display = 'none';
    requestAnimationFrame(() => next.classList.add('isActive'));
    }, 220);
} else {
    requestAnimationFrame(() => next.classList.add('isActive'));
}
}

function updateAge() {
const birthDate = new Date(2000, 11, 30); // 30 Desember 2000 (Bulan di JS dimulai dari 0)
const today = new Date();
let age = today.getFullYear() - birthDate.getFullYear();
const m = today.getMonth() - birthDate.getMonth();

if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
}

document.getElementById('ageTag').innerText = `Age • ${age}`;
document.getElementById('ageValue').innerText = age;
}

// Jalankan fungsi saat halaman selesai dimuat
window.onload = () => {
updateAge();
// Cek apakah ada tab yang tersimpan di localStorage
const savedTab = localStorage.getItem('activeTab');
if (savedTab) changeMahri(savedTab, true);
};
