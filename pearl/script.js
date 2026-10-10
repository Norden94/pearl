/* ============================================================
   ✏️  EDIT #1 — THE LOVE LETTER (typewriter text)
   ============================================================ */
const letterText =
`I don't really know how to say this in a way that sounds as beautiful as you look, so I built a whole website instead.

Every time you sent me a picture, my day got a little brighter — and I kept every single one.

You have this way of making ordinary moments feel like something worth remembering. Your smile, your voice, the way you laugh at your own jokes… I notice all of it.

I notice you.

So here are the 14 pictures you sent me, and 14 reasons why you're my favourite person in the world.`;

/* ============================================================
   ✏️  EDIT #2 — 14 REASONS WHY YOU LIKE HER
   ============================================================ */
const reasons = [
  "The way your eyes light up when you talk about something you love.",
  "Your laugh — I'd do anything just to hear it one more time.",
  "How kind you are, even when nobody's watching.",
  "The way you say my name.",
  "You make ordinary days feel like something to look forward to.",
  "How strong you are, even on the days you don't feel it.",
  "The little things you remember about me.",
  "Your smile. It genuinely ruins my concentration.",
  "How easy it is to talk to you — like we've known each other forever.",
  "The way you care about the people around you.",
  "You're beautiful without even trying.",
  "How you make me want to be a better version of myself.",
  "Every conversation with you ends too soon.",
  "Because you're you — and that's more than enough."
];

/* ============================================================
   ⚙️  EVERYTHING BELOW IS AUTOMATIC — DO NOT EDIT
   ============================================================ */

/* ---------- Floating hearts ---------- */
const heartsBg = document.getElementById('heartsBg');
const emojis = ['💗','💖','🤍','💕','❤️','🌸','✨','💫'];
for (let i = 0; i < 22; i++){
  const h = document.createElement('span');
  h.className = 'heart';
  h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  h.style.left = Math.random() * 100 + 'vw';
  h.style.fontSize = (11 + Math.random() * 20) + 'px';
  h.style.animationDuration = (11 + Math.random() * 14) + 's';
  h.style.animationDelay = (Math.random() * 14) + 's';
  heartsBg.appendChild(h);
}

/* ---------- Cursor glow ---------- */
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
});
document.addEventListener('touchmove', e => {
  const t = e.touches[0];
  glow.style.transform = `translate(${t.clientX}px, ${t.clientY}px) translate(-50%,-50%)`;
}, {passive:true});

/* ---------- Typewriter letter ---------- */
const letterBody = document.getElementById('letterBody');
const signature  = document.getElementById('signature');
let typeStarted = false;

function startTypewriter(){
  if (typeStarted) return;
  typeStarted = true;

  let i = 0;
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  letterBody.appendChild(cursor);

  function type(){
    if (i < letterText.length){
      cursor.insertAdjacentText('beforebegin', letterText.charAt(i));
      i++;
      const delay = letterText.charAt(i-1) === '\n' ? 180 : (18 + Math.random() * 30);
      setTimeout(type, delay);
    } else {
      cursor.remove();
      signature.classList.add('show');
    }
  }
  type();
}

/* ---------- 3D CAROUSEL (Reads photos directly from HTML) ---------- */
const carousel = document.getElementById('carousel');
const cCounter = document.getElementById('cCounter');
const cards = carousel.querySelectorAll('.card3d');
const total = cards.length;
const angleStep = 360 / total;
const radius = 340;
let activeIndex = 0;

/* This sets the 3D position for every photo already in the HTML */
cards.forEach((card, i) => {
  const angle = i * angleStep;
  card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
});

function updateCarousel(){
  const rot = -activeIndex * angleStep;
  carousel.style.transform = `rotateY(${rot}deg)`;
  cCounter.textContent = `${activeIndex + 1} / ${total}`;
  cards.forEach((c, i) => {
    c.classList.toggle('active', i === activeIndex);
  });
}
function nextCard(){ activeIndex = (activeIndex + 1) % total; updateCarousel(); }
function prevCard(){ activeIndex = (activeIndex - 1 + total) % total; updateCarousel(); }

document.getElementById('cNext').onclick = nextCard;
document.getElementById('cPrev').onclick = prevCard;

/* auto-rotate carousel gently */
let autoRotate = setInterval(nextCard, 4200);
carousel.addEventListener('mouseenter', () => clearInterval(autoRotate));
carousel.addEventListener('mouseleave', () => autoRotate = setInterval(nextCard, 4200));

/* drag / swipe to rotate */
let dragStartX = 0, dragging = false;
const stage = document.querySelector('.carousel-stage');
stage.addEventListener('mousedown', e => { dragStartX = e.clientX; dragging = true; });
window.addEventListener('mouseup', e => {
  if (!dragging) return;
  dragging = false;
  const dx = e.clientX - dragStartX;
  if (Math.abs(dx) > 40) dx > 0 ? prevCard() : nextCard();
});
let touchStartX = 0;
stage.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, {passive:true});
stage.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 40) dx > 0 ? prevCard() : nextCard();
}, {passive:true});

updateCarousel();

/* ---------- Build reasons ---------- */
const rGrid = document.getElementById('reasonsGrid');
reasons.forEach((r, i) => {
  const d = document.createElement('div');
  d.className = 'reason reveal';
  d.innerHTML = `<span class="num">${i+1}</span><p>${r}</p>`;
  rGrid.appendChild(d);
});

/* ---------- Scratch card ---------- */
const canvas = document.getElementById('scratchCanvas');
const ctx    = canvas.getContext('2d');
const wrap   = document.getElementById('scratchWrap');
const hint   = document.getElementById('scratchHint');
let scratching = false, revealed = false;

function sizeCanvas(){
  const rect = wrap.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = rect.width  * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  drawCover(rect.width, rect.height);
}
function drawCover(w, h){
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0,   '#5c1c45');
  grad.addColorStop(0.5, '#8a2e5e');
  grad.addColorStop(1,   '#3a1130');
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 90; i++){
    ctx.fillStyle = `rgba(255,255,255,${Math.random()*0.35})`;
    ctx.beginPath();
    ctx.arc(Math.random()*w, Math.random()*h, Math.random()*1.6, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  ctx.font = '500 16px Poppins, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SCRATCH ME', w/2, h/2);
}
function scratchAt(x, y){
  const rect = canvas.getBoundingClientRect();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x - rect.left, y - rect.top, 28, 0, Math.PI*2);
  ctx.fill();
}

function checkRevealed(){
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let cleared = 0;
  for (let i = 3; i < data.length; i += 4 * 40){
    if (data[i] < 40) cleared++;
  }
  const ratio = cleared / (data.length / (4*40));
  if (ratio > 0.55 && !revealed){
    revealed = true;
    canvas.classList.add('gone');
    hint.style.opacity = '0';
    burstHearts(window.innerWidth/2, window.innerHeight/2, 20);
  }
}

canvas.addEventListener('mousedown', e => { scratching = true; scratchAt(e.clientX, e.clientY); });
canvas.addEventListener('mousemove', e => { if (scratching) scratchAt(e.clientX, e.clientY); });
window.addEventListener('mouseup', () => { if (scratching){ scratching = false; checkRevealed(); } });
canvas.addEventListener('touchstart', e => { scratching = true; scratchAt(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); }, {passive:false});
canvas.addEventListener('touchmove', e => { scratchAt(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); }, {passive:false});
canvas.addEventListener('touchend', () => { scratching = false; checkRevealed(); });

window.addEventListener('resize', () => { if (!revealed) sizeCanvas(); });
setTimeout(sizeCanvas, 100);

/* ---------- Heart burst helper ---------- */
function burstHearts(cx, cy, count){
  for (let i = 0; i < count; i++){
    const s = document.createElement('span');
    s.className = 'burst';
    s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    s.style.left = cx + 'px';
    s.style.top  = cy + 'px';
    s.style.setProperty('--x', (Math.random() - 0.5) * 800 + 'px');
    s.style.setProperty('--y', (Math.random() - 0.5) * 800 - 100 + 'px');
    s.style.setProperty('--r', (Math.random() - 0.5) * 720 + 'deg');
    s.style.fontSize = (14 + Math.random() * 24) + 'px';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1800);
  }
}

/* ---------- Yes / No buttons ---------- */
const yesBtn = document.getElementById('yesBtn');
const noBtn  = document.getElementById('noBtn');
const yesResponse = document.getElementById('yesResponse');
const qButtons = document.getElementById('qButtons');
let noCount = 0;
const noTexts = [
  "Let me think…", "Are you sure?", "Really sure?", "Think again 🥺",
  "Last chance…", "Surely not?", "You might regret this…",
  "Give it another thought 💭", "Are you absolutely certain?",
  "This could be a mistake…", "Have a heart 💔",
  "Don't do this to me 😭", "You're breaking my heart…",
  "I'm gonna cry…", "Please? 🥺"
];

yesBtn.addEventListener('click', e => {
  yesResponse.classList.add('show');
  qButtons.style.opacity = '.35';
  qButtons.style.pointerEvents = 'none';
  yesBtn.textContent = 'She said yes 💕';
  const rect = yesBtn.getBoundingClientRect();
  burstHearts(rect.left + rect.width/2, rect.top + rect.height/2, 40);
  setTimeout(() => burstHearts(window.innerWidth/2, window.innerHeight/2, 30), 400);
});

noBtn.addEventListener('click', () => {
  noBtn.textContent = noTexts[Math.min(noCount, noTexts.length - 1)];
  noCount++;
  noBtn.style.transform = `scale(${Math.max(0.55, 1 - noCount * 0.06)})`;
  yesBtn.style.transform = `scale(${Math.min(1.6, 1 + noCount * 0.08)})`;
  if (noCount >= noTexts.length){
    noBtn.textContent = "Okay fine… yes 💗";
    noBtn.onclick = () => yesBtn.click();
  }
});

/* ---------- Music toggle ---------- */
const music    = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
let playing = false;

musicBtn.addEventListener('click', () => {
  if (!playing){
    music.play().then(() => {
      playing = true;
      musicBtn.classList.add('playing');
      musicBtn.textContent = '♫';
    }).catch(() => {
      musicBtn.textContent = '✕';
      setTimeout(() => musicBtn.textContent = '♪', 1200);
    });
  } else {
    music.pause();
    playing = false;
    musicBtn.classList.remove('playing');
    musicBtn.textContent = '♪';
  }
});

/* ---------- Scroll reveal + trigger typewriter ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting){
      e.target.classList.add('visible');
      if (e.target.closest('#letter')) startTypewriter();
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

window.addEventListener('load', () => {
  const letterRect = document.querySelector('.letter').getBoundingClientRect();
  if (letterRect.top < window.innerHeight * 0.85) startTypewriter();
});

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') nextCard();
  if (e.key === 'ArrowLeft')  prevCard();
});