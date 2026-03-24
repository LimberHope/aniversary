fetch('Img/girasol.svg')
  .then(res => res.text())
  .then(svgText => {
    const container = document.getElementById('tree-container');
    container.innerHTML = svgText;
    const svg = container.querySelector('svg');
    if (!svg) return;

    const allPaths = Array.from(svg.querySelectorAll('path'));
    allPaths.forEach(path => {
      path.style.stroke = '#222';
      path.style.strokeWidth = '2.5';
      path.style.fillOpacity = '0';
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.transition = 'none';
    });

    const pathCount = allPaths.length;
    const maxStaggerWindowMs = 650;
    const perPathDelayMs = pathCount > 1 ? Math.max(2, Math.floor(maxStaggerWindowMs / pathCount)) : 0;
    const drawDurationMs = 520;
    const fillStartMs = 60;

    setTimeout(() => {
      allPaths.forEach((path, i) => {
        const delayMs = i * perPathDelayMs;
        path.style.transition = `stroke-dashoffset ${drawDurationMs}ms cubic-bezier(.77,0,.18,1) ${delayMs}ms, fill-opacity 260ms ${delayMs + fillStartMs}ms`;
        path.style.strokeDashoffset = 0;
        setTimeout(() => {
          path.style.fillOpacity = '1';
          path.style.stroke = '';
          path.style.strokeWidth = '';
        }, delayMs + fillStartMs);
      });

      const totalDuration = drawDurationMs + (pathCount - 1) * perPathDelayMs + 120;
      setTimeout(() => {
        svg.classList.add('move-and-scale');
        setTimeout(() => {
          showDedicationText();
          startFloatingObjects();
          showCountdown();
          showName();
          unmuteVideoFromUserGesture();
        }, 0);
      }, totalDuration);
    }, 50);

    const heartPaths = allPaths.filter(el => {
      const style = el.getAttribute('style') ?? '';
      return style.includes('#FC6F58') || style.includes('#C1321F');
    });
    heartPaths.forEach(path => {
      path.classList.add('animated-heart');
    });
  });

function getURLParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function showDedicationText() {
  let text = `Para mi bubu:\n\nla verdad ando muy sorprendido por estos hermosos 7 meses juntos \n\ntan solo miranos mi vida... mira cuanto tiempo ya hemos pasado y cuando nos falta por recorrer.\n\nTe amo muchisimo solo no sueltes mi mano mi amor que yo no soltare la tuya y quisiera estar en cada etapa en cada logro o caida pero quiero estar ahi a tu lado.\n\n Lo inevitable son los obstaculos pero lo posible es volver a levantarse las veces que sean necesarias, dame tu manita caminemos juntos que yo sere tu soporte y yo celebrare todos tus logros ya sean grandes o pequeños.`;
  if (!text) {
    text = decodeURIComponent(text).replace(/\\n/g, '\n');
  }
  const container = document.getElementById('dedication-text');
  container.classList.add('typing');
  let i = 0;
  function type() {
    if (i <= text.length) {
      container.textContent = text.slice(0, i);
      i++;
      setTimeout(type, text[i - 2] === '\n' ? 350 : 45);
    }
  }
  type();
}

function startFloatingObjects() {
  const container = document.getElementById('floating-objects');
  let count = 0;
  function spawn() {
    let el = document.createElement('div');
    el.className = 'floating-petal';
    el.style.left = `${Math.random() * 90 + 2}%`;
    el.style.top = `${100 + Math.random() * 10}%`;
    el.style.opacity = 0.7 + Math.random() * 0.3;
    container.appendChild(el);

    const duration = 6000 + Math.random() * 4000;
    const drift = (Math.random() - 0.5) * 60;
    setTimeout(() => {
      el.style.transition = `transform ${duration}ms linear, opacity 1.2s`;
      el.style.transform = `translate(${drift}px, -110vh) scale(${0.8 + Math.random() * 0.6}) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = 0.2;
    }, 30);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, duration + 2000);

    if (count++ < 32) setTimeout(spawn, 350 + Math.random() * 500);
    else setTimeout(spawn, 1200 + Math.random() * 1200);
  }
  spawn();
}

function showCountdown() {
  const container = document.getElementById('countdown');
  let startDate = new Date("2025-08-23"); 
  let eventDate = new Date("2026-08-23");

  function update() {
    const now = new Date();
    let diff = now - startDate;
    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let eventDiff = eventDate - now;
    let eventDays = Math.max(0, Math.floor(eventDiff / (1000 * 60 * 60 * 24)));
    let eventHours = Math.max(0, Math.floor((eventDiff / (1000 * 60 * 60)) % 24));
    let eventMinutes = Math.max(0, Math.floor((eventDiff / (1000 * 60)) % 60));
    let eventSeconds = Math.max(0, Math.floor((eventDiff / 1000) % 60));

    container.innerHTML =
      `Dias juntos: <b>${days}</b> días<br>` +
      `Nuestro primer añito: <b>${eventDays}d ${eventHours}h ${eventMinutes}m ${eventSeconds}s</b>`;
    container.classList.add('visible');
  }
  update();
  setInterval(update, 1000);
}


function showName() {
  const container = document.getElementById('name-text');
  container.innerHTML = `Mi Bubucita`;
  container.classList.add('visible');
}

function playBackgroundMusic() {
  const audio = document.getElementById('bg-music');
  const video = document.getElementById('bg-video');
  const media = audio ?? video;
  if (!media) return;

  const isVideo = media.tagName === 'VIDEO';

  let btn = document.getElementById('music-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'music-btn';
    btn.textContent = 'Presiona';
    btn.style.position = 'fixed';
    btn.style.bottom = '18px';
    btn.style.right = '18px';
    btn.style.zIndex = 99;
    btn.style.background = 'rgba(255,255,255,0.85)';
    btn.style.border = 'none';
    btn.style.borderRadius = '24px';
    btn.style.padding = '10px 18px';
    btn.style.fontSize = '1.1em';
    btn.style.cursor = 'pointer';
    document.body.appendChild(btn);
  }

  media.loop = true;
  if (isVideo) {
    video.muted = true;
    video.setAttribute('playsinline', '');
    video.volume = 1;

    function syncVideoSoundButton() {
      btn.textContent = video.muted ? 'Quieres escuchar?' : 'Silenciar';
      if (!video.muted) {
        btn.style.display = 'none';
      }
    }

    function unmuteVideoFromUserGesture() {
      if (!video.muted) return;
      video.muted = false;
      video.removeAttribute('muted');
      video.play().catch(() => {});
      syncVideoSoundButton();
    }

    document.addEventListener(
      'click',
      (e) => {
        if (e.target.closest('#music-btn')) return;
        unmuteVideoFromUserGesture();
      },
      { capture: true }
    );

    btn.onclick = (e) => {
      e.stopPropagation();
      if (video.paused) {
        video.play().catch(() => {});
      }
      if (video.muted) {
        unmuteVideoFromUserGesture();
        return;
      }
      video.muted = true;
      video.setAttribute('muted', '');
      syncVideoSoundButton();
    };
    return;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  playBackgroundMusic();
});
