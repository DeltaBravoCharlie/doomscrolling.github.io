const video = document.getElementById('doom-video');
const body = document.body;

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

// Pause updates when scrolling stops
function checkScrollPause() {
  const now = Date.now();
  if (isScrolling && now - lastScroll > 100) {
    isScrolling = false;
  }
  requestAnimationFrame(checkScrollPause);
}

checkScrollPause();

// Mobile touch optimization (prevents accidental scroll lag)
video.addEventListener('touchstart', e => e.preventDefault(), { passive: false });
