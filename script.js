const video = document.querySelector('#hero-video');
const control = document.querySelector('#motion-control');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveData = navigator.connection?.saveData === true;
const soundtrack = document.querySelector('#soundtrack');
const soundControl = document.querySelector('#sound-control');
const motionMarkVideo = document.querySelector('#motion-mark-video');
const motionMarkControl = document.querySelector('#motion-mark-control');

addEventListener('DOMContentLoaded', () => {
  window.setTimeout(() => document.querySelector('.intro').classList.add('is-done'), 350);
});

function setPaused(paused) {
  control.dataset.paused = String(paused);
  control.setAttribute('aria-pressed', String(paused));
  control.setAttribute('aria-label', paused ? 'Play background video' : 'Pause background video');
  control.querySelector('.control-label').textContent = paused ? 'Play' : 'Pause';
}

if (reduceMotion || saveData) {
  video.removeAttribute('autoplay');
  video.pause();
  setPaused(true);
} else {
  video.play().then(() => setPaused(false)).catch(() => setPaused(true));
}

control.addEventListener('click', () => {
  if (video.paused) video.play().then(() => setPaused(false));
  else { video.pause(); setPaused(true); }
});

function setMotionMarkPaused(paused) {
  motionMarkControl.dataset.paused = String(paused);
  motionMarkControl.setAttribute('aria-pressed', String(paused));
  motionMarkControl.setAttribute('aria-label', paused ? 'Play motion mark' : 'Pause motion mark');
  motionMarkControl.querySelector('.control-label').textContent = paused ? 'Play' : 'Pause';
}

if (reduceMotion || saveData) {
  motionMarkVideo.pause();
  setMotionMarkPaused(true);
} else {
  motionMarkVideo.play().then(() => setMotionMarkPaused(false)).catch(() => setMotionMarkPaused(true));
}

motionMarkControl.addEventListener('click', () => {
  if (motionMarkVideo.paused) motionMarkVideo.play().then(() => setMotionMarkPaused(false));
  else { motionMarkVideo.pause(); setMotionMarkPaused(true); }
});

soundControl.addEventListener('click', async () => {
  const turningOn = soundtrack.paused;
  if (turningOn) {
    soundtrack.currentTime = video.currentTime;
    soundtrack.volume = .72;
    await soundtrack.play();
  } else {
    soundtrack.pause();
  }
  soundControl.setAttribute('aria-pressed', String(turningOn));
  soundControl.setAttribute('aria-label', turningOn ? 'Turn soundtrack off' : 'Turn soundtrack on');
  soundControl.querySelector('span:last-child').textContent = turningOn ? 'Sound on' : 'Sound off';
});
video.addEventListener('pause', () => soundtrack.pause());
video.addEventListener('play', () => {
  if (soundControl.getAttribute('aria-pressed') === 'true') {
    soundtrack.currentTime = video.currentTime;
    soundtrack.play();
  }
});

const progress = document.querySelector('#film-progress');
const currentTime = document.querySelector('#time-current');
video.addEventListener('timeupdate', () => {
  if (!video.duration) return;
  progress.style.width = `${(video.currentTime / video.duration) * 100}%`;
  const seconds = Math.floor(video.currentTime);
  currentTime.textContent = `00:${String(seconds).padStart(2, '0')}`;
});

document.querySelectorAll('.chapter').forEach((chapter) => {
  chapter.addEventListener('click', () => {
    const time = Number(chapter.dataset.time);
    video.currentTime = time;
    soundtrack.currentTime = time;
    video.play().then(() => setPaused(false));
    document.querySelectorAll('.chapter').forEach((item) => {
      const active = item === chapter;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    document.querySelector('#top').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: .14 });
document.querySelectorAll('.reveal').forEach((section) => observer.observe(section));

const finePointer = matchMedia('(pointer: fine)').matches;
const media = document.querySelector('[data-parallax]');
if (finePointer && !reduceMotion) {
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  addEventListener('pointermove', (event) => {
    targetX = (event.clientX / innerWidth - .5) * 14;
    targetY = (event.clientY / innerHeight - .5) * 10;
  }, { passive: true });
  const tick = () => {
    currentX += (targetX - currentX) * .06;
    currentY += (targetY - currentY) * .06;
    media.style.transform = `perspective(1200px) rotateY(${currentX * .06}deg) rotateX(${-currentY * .04}deg) translate3d(${currentX}px,${currentY}px,0)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let cursorX = 0, cursorY = 0, ringX = 0, ringY = 0;
  addEventListener('pointermove', (event) => { cursorX = event.clientX; cursorY = event.clientY; });
  document.querySelectorAll('a, button').forEach((item) => {
    item.addEventListener('pointerenter', () => ring.classList.add('is-hover'));
    item.addEventListener('pointerleave', () => ring.classList.remove('is-hover'));
  });
  const cursorTick = () => {
    ringX += (cursorX - ringX) * .14;
    ringY += (cursorY - ringY) * .14;
    dot.style.transform = `translate3d(${cursorX - 2.5}px,${cursorY - 2.5}px,0)`;
    ring.style.transform = `translate3d(${ringX - ring.offsetWidth / 2}px,${ringY - ring.offsetHeight / 2}px,0)`;
    requestAnimationFrame(cursorTick);
  };
  requestAnimationFrame(cursorTick);
}

const cuzzLauncher = document.querySelector('#cuzz-launcher');
const cuzzPanel = document.querySelector('#cuzz-panel');
const cuzzClose = document.querySelector('#cuzz-close');
const cuzzTranscript = document.querySelector('#cuzz-transcript');
const cuzzForm = document.querySelector('#cuzz-form');
const cuzzQuestion = document.querySelector('#cuzz-question');
const cuzzVoice = document.querySelector('#cuzz-voice');
let cuzzVoiceOn = true;

const cuzzReplies = {
  story: 'Chranch NYC is Harlem pressure with a future-facing mind. Real footage. Real motion. No clean-room personality.',
  visual: 'Say less. I’m taking you straight to the newest motion mark.',
  assistant: 'I can guide the site, put you on to the visuals, connect you to the channel, and help shape the next move.',
  youtube: 'The channel is one tap away. Hit YouTube in the navigation, and stay locked for the next drop.',
  hello: 'What’s good? I’m here. Ask me about Chranch, the visuals, or what we building next.',
  fallback: 'I hear you. Right now, I know this world, these visuals, and the next links. Ask me about Chranch, LIL CUZZ, or the latest film.'
};

let localVoiceAudio = null;
let localTtsPromise = null;
let localTts = null;
let pendingVoiceText = '';

function setCuzzSpeaking(speaking) {
  document.querySelector('.cuzz-twin-stage')?.classList.toggle('is-speaking', speaking);
}

async function getLocalTts() {
  if (!localTtsPromise) {
    cuzzVoice.innerHTML = '<span aria-hidden="true">◖</span> Natural voice loading…';
    localTtsPromise = import('https://cdn.jsdelivr.net/npm/kokoro-js/+esm').then(async ({ KokoroTTS }) => {
      const device = navigator.gpu ? 'webgpu' : 'wasm';
      const tts = await KokoroTTS.from_pretrained(window.LIL_CUZZ_VOICE.model, {
        dtype: 'q8',
        device
      });
      localTts = tts;
      cuzzVoice.innerHTML = '<span aria-hidden="true">◖</span> Natural voice ready';
      if (pendingVoiceText && cuzzVoiceOn && !cuzzPanel.hidden) {
        const queuedText = pendingVoiceText;
        pendingVoiceText = '';
        window.setTimeout(() => speakCuzz(queuedText), 80);
      }
      return tts;
    }).catch((error) => {
      localTtsPromise = null;
      localTts = null;
      pendingVoiceText = '';
      cuzzVoice.innerHTML = '<span aria-hidden="true">◖</span> Voice unavailable';
      console.info('Free natural voice unavailable.', error);
      return null;
    });
  }
  return localTtsPromise;
}

async function speakCuzz(text) {
  if (!cuzzVoiceOn) return;
  if (!localTts) {
    pendingVoiceText = text;
    getLocalTts();
    return;
  }
  if (window.LIL_CUZZ_VOICE?.enabled) {
    try {
      localVoiceAudio?.pause();
      setCuzzSpeaking(true);
      const audio = await localTts.generate(text, {
        voice: window.LIL_CUZZ_VOICE.voice,
        speed: window.LIL_CUZZ_VOICE.speed
      });
      const blob = await audio.toBlob();
      localVoiceAudio = new Audio(URL.createObjectURL(blob));
      localVoiceAudio.addEventListener('ended', () => setCuzzSpeaking(false), { once: true });
      localVoiceAudio.addEventListener('error', () => setCuzzSpeaking(false), { once: true });
      await localVoiceAudio.play();
      return;
    } catch (error) {
      setCuzzSpeaking(false);
      localTtsPromise = null;
      localTts = null;
      cuzzVoice.innerHTML = '<span aria-hidden="true">◖</span> Voice unavailable';
      console.info('Free natural voice generation failed.');
    }
  }
}

function addCuzzMessage(text, fromCuzz = true) {
  const message = document.createElement('div');
  message.className = `cuzz-message ${fromCuzz ? 'is-cuzz' : 'is-user'}`;
  const label = document.createElement('span');
  label.textContent = fromCuzz ? 'CUZZ' : 'YOU';
  const copy = document.createElement('p');
  copy.textContent = text;
  message.append(label, copy);
  cuzzTranscript.append(message);
  cuzzTranscript.scrollTop = cuzzTranscript.scrollHeight;
  if (fromCuzz) speakCuzz(text);
}

function answerCuzz(prompt, raw = '') {
  const input = raw.toLowerCase();
  let key = prompt;
  if (!key) {
    if (/hello|hey|yo|what('| i)s good/.test(input)) key = 'hello';
    else if (/story|chranch|who/.test(input)) key = 'story';
    else if (/visual|video|film|watch|play/.test(input)) key = 'visual';
    else if (/youtube|channel|subscribe/.test(input)) key = 'youtube';
    else if (/help|do|assistant|cuzz/.test(input)) key = 'assistant';
    else key = 'fallback';
  }
  window.setTimeout(() => {
    addCuzzMessage(cuzzReplies[key]);
    if (key === 'visual') document.querySelector('#motion-mark').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }, 280);
}

cuzzLauncher.addEventListener('click', () => {
  cuzzPanel.hidden = false;
  cuzzLauncher.setAttribute('aria-expanded', 'true');
  cuzzLauncher.hidden = true;
  window.setTimeout(() => { cuzzPanel.classList.add('is-open'); cuzzQuestion.focus(); }, 20);
  speakCuzz('Yo. I’m tapped in. You need the story, the visual, or the next move?');
});

cuzzClose.addEventListener('click', () => {
  cuzzPanel.classList.remove('is-open');
  pendingVoiceText = '';
  localVoiceAudio?.pause();
  setCuzzSpeaking(false);
  window.setTimeout(() => { cuzzPanel.hidden = true; cuzzLauncher.hidden = false; cuzzLauncher.setAttribute('aria-expanded', 'false'); cuzzLauncher.focus(); }, 220);
});

document.querySelectorAll('[data-cuzz-prompt]').forEach((button) => {
  button.addEventListener('click', () => {
    addCuzzMessage(button.textContent, false);
    answerCuzz(button.dataset.cuzzPrompt);
  });
});

cuzzForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const question = cuzzQuestion.value.trim();
  if (!question) return;
  addCuzzMessage(question, false);
  cuzzQuestion.value = '';
  answerCuzz('', question);
});

cuzzVoice.addEventListener('click', () => {
  cuzzVoiceOn = !cuzzVoiceOn;
  cuzzVoice.setAttribute('aria-pressed', String(cuzzVoiceOn));
  cuzzVoice.innerHTML = `<span aria-hidden="true">◖</span> Natural voice ${cuzzVoiceOn ? (localTts ? 'ready' : 'loading…') : 'off'}`;
  if (!cuzzVoiceOn) {
    pendingVoiceText = '';
    localVoiceAudio?.pause();
    setCuzzSpeaking(false);
  }
  else speakCuzz('Natural voice on.');
});

addEventListener('DOMContentLoaded', () => {
  if (window.LIL_CUZZ_VOICE?.enabled) window.setTimeout(() => getLocalTts(), 1200);
});
