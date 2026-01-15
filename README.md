<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<title>Doom Scroll Scrub - Mobile</title>
<style>
  html, body {
    margin: 0;
    padding: 0;
    height: 5000px; /* Adjust based on video length */
    background: #000;
    overscroll-behavior: contain; /* prevents bounce on iOS */
  }

  #video-container {
    position: sticky;
    top: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: black;
    overflow: hidden;
  }

  #doom-video {
    width: 100%;
    height: auto;
    max-height: 100%;
    display: block;
  }

  .overlay {
    position: absolute;
    cursor: pointer;
    border: 2px solid rgba(255,255,255,0.5);
    background: rgba(255,255,255,0.1);
    transition: transform 0.2s;
    touch-action: manipulation; /* improves touch responsiveness */
  }

  .overlay:hover {
    transform: scale(1.05);
    border-color: yellow;
    background: rgba(255,255,0,0.2);
  }

  .overlay span {
    color: white;
    font-size: 12px;
    position: absolute;
    top: -18px;
    left: 0;
  }
</style>
</head>
<body>

<div id="video-container">
  <video id="doom-video" src="doom-playthrough.mp4" preload="auto" muted playsinline></video>
</div>

<script>
const video = document.getElementById('doom-video');
const body = document.body;

// Keyframes with relative positions for responsive design
const keyframes = [
  { time: 5, link: 'clue1.html', x: 0.5, y: 0.3, width: 0.25, height: 0.12, label: "Clue 1" },
  { time: 12, link: 'clue2.html', x: 0.2, y: 0.6, width: 0.22, height: 0.1, label: "Clue 2" },
  { time: 20, link: 'clue3.html', x: 0.7, y: 0.4, width: 0.2, height: 0.15, label: "Clue 3" }
];

// Create overlay elements
keyframes.forEach(kf => {
  const div = document.createElement('div');
  div.className = 'overlay';
  div.style.top = `${kf.y * 100}%`;
  div.style.left = `${kf.x * 100}%`;
  div.style.width = `${kf.width * 100}%`;
  div.style.height = `${kf.height * 100}%`;
  div.onclick = () => window.location.href = kf.link;

  const label = document.createElement('span');
  label.textContent = kf.label;
  div.appendChild(label);

  document.getElementById('video-container').appendChild(div);
});

// Scroll → video scrub (scroll only)
let ticking = false;
let lastScroll = 0;
let isScrolling = false;

function updateVideoTime() {
  if(video.duration) {
    const scrollFraction = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    video.currentTime = scrollFraction * video.duration;
  }
}

window.addEventListener('scroll', () => {
  isScrolling = true;
  lastScroll = Date.now();

  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateVideoTime();
      ticking = false;
    });
    ticking = true;
  }
});

// Mobile touch optimization: prevent accidental scroll lag
video.addEventListener('touchstart', e => e.preventDefault(), { passive: false });

// Pause video updates when scrolling stops
function checkScrollPause() {
  const now = Date.now();
  if (isScrolling && now - lastScroll > 100) {
    isScrolling = false;
  }
  requestAnimationFrame(checkScrollPause);
}

checkScrollPause();
</script>

</body>
</html>
