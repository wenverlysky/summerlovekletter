/* ============================================================
   RETRO RECEIPT PRINTER — LOGIC
   ============================================================ */
(function () {
  'use strict';

  const DESIGN_W = 1920, DESIGN_H = 1037, MOBILE_BREAK = 900;

  /* ---------- Elements ---------- */
  const el = id => document.getElementById(id);
  const stage = el('stage'), msg = el('msg'), count = el('count');
  const printBtn = el('printBtn'), clearBtn = el('clearBtn');
  const printer = el('printer'), track = el('track'), receipt = el('receipt');
  const rBody = el('rBody'), rDate = el('rDate'), rTime = el('rTime'), rNo = el('rNo');
  const ledPrint = el('ledPrint'), ledErr = el('ledErr');
  const statusText = el('statusText'), miniScreen = el('miniScreen'), progressFill = el('progressFill');
  const soundOpt = el('sound'), fastOpt = el('fast');

  let busy = false, ticket = 1;
  const wait = ms => new Promise(r => setTimeout(r, ms));

  /* ============================================================
     1) สเกลผืนงาน 1920x1037 ให้พอดีหน้าจอ
     ============================================================ */
  function fitStage() {
    const w = window.innerWidth, h = window.innerHeight;
    const mobile = w < MOBILE_BREAK;
    document.body.classList.toggle('mobile', mobile);
    if (mobile) { stage.style.transform = 'none'; return; }
    const scale = Math.min(w / DESIGN_W, h / DESIGN_H);
    stage.style.transform = `scale(${scale})`;
  }
  window.addEventListener('resize', fitStage);
  window.addEventListener('orientationchange', fitStage);
  fitStage();

  /* ============================================================
     2) เสียง 8-bit (สังเคราะห์สดด้วย WebAudio)
     ============================================================ */
  let actx = null;
  function beep(freq = 220, dur = .04, type = 'square', vol = .05) {
    if (!soundOpt.checked) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      const osc = actx.createOscillator(), gain = actx.createGain();
      osc.type = type; osc.frequency.value = freq; gain.gain.value = vol;
      osc.connect(gain).connect(actx.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + dur);
      osc.stop(actx.currentTime + dur);
    } catch (e) { /* ปิดเสียงเงียบ ๆ ถ้าเบราว์เซอร์ไม่รองรับ */ }
  }

  /* ============================================================
     3) สถานะ + ไฟ LED
     ============================================================ */
  function setStatus(text, mode = '', percent = null) {
    statusText.textContent = text;
    statusText.classList.toggle('err', mode === 'error');
    ledPrint.className = 'led' + (mode === 'printing' ? ' on-orange' : '');
    ledErr.className   = 'led' + (mode === 'error'    ? ' on-red'    : '');
    miniScreen.textContent = mode === 'printing' ? 'PRINTING' : (mode === 'error' ? 'ERROR' : 'READY');
    if (percent !== null) progressFill.style.width = percent + '%';
  }

  /* ============================================================
     4) วันที่ / เวลา / เลขที่ใบเสร็จ
     ============================================================ */
  const pad = n => String(n).padStart(2, '0');
  function stampReceipt() {
    const d = new Date();
    rDate.textContent = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    rTime.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    rNo.textContent   = '#' + String(ticket).padStart(4, '0');
  }

  /* ============================================================
     5) สั่งพิมพ์
     ============================================================ */
  async function doPrint() {
    if (busy) return;
    const text = msg.value.trim();

    if (!text) {
      setStatus('ERROR: NO DATA — กรุณาพิมพ์ข้อความก่อน', 'error', 0);
      beep(110, .18, 'sawtooth', .06);
      msg.focus();
      setTimeout(() => setStatus('SYSTEM READY.', '', 0), 2400);
      return;
    }

    busy = true;
    printBtn.disabled = true; clearBtn.disabled = true;
    track.style.transition = 'max-height .08s linear';
    track.style.maxHeight = '0px';
    rBody.innerHTML = '';
    stampReceipt();

    setStatus('INITIALIZING PRINT HEAD...', 'printing', 0);
    printer.classList.add('busy');
    beep(320, .07, 'square', .05);
    await wait(550);

    printer.classList.add('shaking');
    const delay = fastOpt.checked ? 8 : Math.max(14, 48 - text.length * 0.12);
    const CARET = '<span class="caret">|</span>';

    for (let i = 0; i < text.length; i++) {
      rBody.innerHTML = escapeHTML(text.slice(0, i + 1)) + CARET;
      track.style.maxHeight = (receipt.offsetHeight + 18) + 'px';
      if (i % 2 === 0) beep(170 + Math.random() * 280, .02, 'square', .033);
      const pct = Math.round((i + 1) / text.length * 100);
      setStatus(`PRINTING... ${pct}%`, 'printing', pct);
      await wait(delay);
    }

    rBody.innerHTML = escapeHTML(text);
    track.style.maxHeight = (receipt.offsetHeight + 18) + 'px';

    await wait(350);
    printer.classList.remove('shaking', 'busy');
    beep(660, .09, 'square', .05); await wait(95); beep(880, .16, 'square', .05);

    setStatus('DONE — ฉีกใบเสร็จได้เลย ✂', '', 100);
    ticket++;
    busy = false;
    printBtn.disabled = false; clearBtn.disabled = false;
  }

  /* ============================================================
     6) ล้างข้อความ + ดึงกระดาษกลับ
     ============================================================ */
  function doClear() {
    if (busy) return;
    msg.value = '';
    count.textContent = '0';
    track.style.transition = 'max-height .5s ease-in';
    track.style.maxHeight = '0px';
    rBody.innerHTML = '';
    beep(300, .06, 'triangle', .045);
    setStatus('CLEARED. SYSTEM READY.', '', 0);
    msg.focus();
  }

  /* ---------- Utils ---------- */
  function escapeHTML(s) {
    return s.replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ============================================================
     7) Events
     ============================================================ */
  msg.addEventListener('input', () => { count.textContent = msg.value.length; });
  printBtn.addEventListener('click', doPrint);
  clearBtn.addEventListener('click', doClear);
  msg.addEventListener('keydown', e => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); doPrint(); }
  });

  /* นาฬิกาบนจอเล็กตอนเครื่องว่าง */
  setInterval(() => {
    if (busy) return;
    const d = new Date();
    miniScreen.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }, 1000);

  setStatus('SYSTEM READY.', '', 0);
})();