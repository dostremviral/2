const JSON_URL = 'https://raw.githubusercontent.com/DoodstreamPro/_e/refs/heads/main/Video.json';

// Ambil video ID dari query parameter
const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get('v');

const videoPlayer = document.getElementById('video-player');
const videoTitle = document.getElementById('video-title');
const overlayControls = document.getElementById('overlay-controls');
const playOverlayBtn = document.getElementById('play-overlay-btn');
const backwardBtn = document.getElementById('backward-btn');
const forwardBtn = document.getElementById('forward-btn');
const videoContainer = document.getElementById('video-container');

let hideControlsTimeout;

// Fungsi untuk menampilkan overlay controls sementara
function showOverlayControls() {
  clearTimeout(hideControlsTimeout);
  overlayControls.style.opacity = '0.9';
  overlayControls.style.pointerEvents = 'auto';
  if (player.playing) {
    hideControlsTimeout = setTimeout(() => {
      overlayControls.style.opacity = '0';
      overlayControls.style.pointerEvents = 'none';
    }, 3000); // Sembunyikan overlay setelah 3 detik
  }
}

// Inisialisasi Plyr
const player = new Plyr(videoPlayer, {
  controls: ['play', 'progress', 'current-time', 'duration', 'mute', 'volume', 'settings', 'fullscreen'],
  settings: ['speed'],
  speed: { selected: 1, options: [0.5, 1, 1.5, 2] },
  autoplay: false,
  loop: { active: true },
  muted: true
});

// Pastikan Plyr controls selalu aktif
player.on('ready', () => {
  const plyrControls = document.querySelector('.plyr__controls');
  if (plyrControls) {
    plyrControls.style.display = 'flex';
  }
  showOverlayControls(); // Tampilkan overlay saat video dimuat
});

// Toggle overlay controls saat tombol play di tengah diklik
playOverlayBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  player.togglePlay();
  if (player.playing) {
    showOverlayControls(); // Mulai timer untuk menyembunyikan overlay
  } else {
    showOverlayControls(); // Tampilkan overlay tanpa timer saat pause
    clearTimeout(hideControlsTimeout); // Batalkan timer
  }
});

// Toggle overlay controls saat video diklik
videoContainer.addEventListener('click', (e) => {
  if (e.target.closest('#overlay-controls')) return;
  showOverlayControls();
});

// Update ikon play/pause saat video diputar atau dijeda
player.on('play', () => {
  playOverlayBtn.querySelector('i').classList.remove('fa-play');
  playOverlayBtn.querySelector('i').classList.add('fa-pause');
  showOverlayControls(); // Mulai timer untuk menyembunyikan overlay
});

player.on('pause', () => {
  playOverlayBtn.querySelector('i').classList.remove('fa-pause');
  playOverlayBtn.querySelector('i').classList.add('fa-play');
  showOverlayControls(); // Tampilkan overlay tanpa timer
  clearTimeout(hideControlsTimeout); // Batalkan timer
});

// Fungsi untuk mendeteksi double-click
let lastClickTimeBackward = 0;
let lastClickTimeForward = 0;
const DOUBLE_CLICK_THRESHOLD = 300; // Milidetik untuk mendeteksi double-click

backwardBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const currentTime = Date.now();
  if (currentTime - lastClickTimeBackward < DOUBLE_CLICK_THRESHOLD) {
    player.currentTime = Math.max(0, player.currentTime - 10);
    showOverlayControls(); // Tampilkan overlay setelah skip
  }
  lastClickTimeBackward = currentTime;
});

forwardBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const currentTime = Date.now();
  if (currentTime - lastClickTimeForward < DOUBLE_CLICK_THRESHOLD) {
    player.currentTime = Math.min(player.duration, player.currentTime + 10);
    showOverlayControls(); // Tampilkan overlay setelah skip
  }
  lastClickTimeForward = currentTime;
});

// Ambil data JSON
if (videoId) {
  fetch(JSON_URL)
    .then(response => response.json())
    .then(data => {
      const video = data.find(v => v.id === videoId);
      if (video) {
        videoPlayer.src = video.Url;
        videoTitle.textContent = video.Judul;
      } else {
        console.error('video dengan id tersebut tidak di temukan');
      
      }
    })
    .catch(error => {
      console.error('Error fetching video data:', error);
      
    });
} else {
  console.error('Error tidak di temukan id');      
}
