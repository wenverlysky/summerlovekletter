# summerlovekletter
<!doctype html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ความในใจ — Retro Receipt Printer</title>

  <style>
    :root {
      --bg: #34454b;
      --navy: #1b2b4b;
      --pink: #c86b7b;
      --screen: #e7e7e9;
      --paper: #f7f2e8;
      --cream: #fffaf1;
      --ink: #1b2b4b;
      --button: #a95767;
      --button-shadow: #713343;
    }

    * {
      box-sizing: border-box;
    }

    body {
      min-width: 320px;
      min-height: 100vh;
      margin: 0;
      overflow-x: hidden;
      color: var(--ink);
      font-family: "Courier New", "Noto Sans Thai", monospace;
      background:
        radial-gradient(circle at 12% 10%, rgba(255,255,255,.045), transparent 26%),
        radial-gradient(circle at 88% 90%, rgba(0,0,0,.12), transparent 35%),
        var(--bg);
    }

    .scene {
      width: min(100%, 1200px);
      min-height: 100vh;
      margin: 0 auto;
      padding: 0 0 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .printer-wrap {
      width: 100%;
      position: relative;
      z-index: 2;
    }

    .printer {
      position: relative;
      width: 100%;
      min-height: 545px;
      padding: 54px 62px 54px;
      border: 34px solid var(--navy);
      border-radius: 52px;
      background: var(--pink);
    }

    .brand {
      margin: -31px 0 20px;
      color: var(--navy);
      text-align: center;
      font-size: clamp(1.4rem, 3vw, 2.1rem);
      font-weight: 900;
      letter-spacing: .03em;
    }

    .screen {
      min-height: 264px;
      padding: 24px;
      border: 1.5px solid #1d1d1d;
      border-radius: 29px;
      background: var(--screen);
    }

    textarea {
      width: 100%;
      min-height: 210px;
      resize: none;
      border: 0;
      outline: 0;
      color: #4d5664;
      background: transparent;
      font: 400 clamp(1.05rem, 2.2vw, 1.5rem) / 1.5 Arial, "Noto Sans Thai", sans-serif;
    }

    textarea::placeholder {
      color: #8d939b;
    }

    /*
      ช่องกระดาษและลายลูกไม้:
      ใช้ radial-gradient ซ้อนกันเพื่อสร้างขอบหยักคล้ายลูกไม้
    */
    .paper-slot {
      position: relative;
      width: calc(100% - 16px);
      height: 48px;
      margin: 19px auto 0;
      overflow: hidden;
      background: var(--cream);
    }

    .paper-slot::before,
    .paper-slot::after {
      content: "";
      position: absolute;
      right: 0;
      left: 0;
      height: 17px;
      pointer-events: none;
      background:
        radial-gradient(circle at 8px 2px, var(--pink) 0 3px, transparent 3.5px) 0 0 / 16px 12px repeat-x,
        radial-gradient(circle at 0 10px, var(--pink) 0 4px, transparent 4.5px) 0 0 / 16px 12px repeat-x,
        radial-gradient(circle at 8px 13px, var(--pink) 0 5px, transparent 5.5px) 0 0 / 16px 14px repeat-x;
    }

    .paper-slot::before {
      top: 0;
    }

    .paper-slot::after {
      bottom: 0;
      transform: rotate(180deg);
    }

    .control-panel {
      width: min(92%, 690px);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-top: 28px;
    }

    .status {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border-radius: 8px;
      color: var(--cream);
      background: rgba(21,35,55,.45);
      font-size: .74rem;
      font-weight: 700;
      letter-spacing: .05em;
    }

    .status-light {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #8e97a0;
      box-shadow: inset 0 -2px 0 rgba(0,0,0,.2);
    }

    .status-light.active {
      background: #ffd069;
      box-shadow: 0 0 10px #ffd069;
      animation: blink .55s infinite alternate;
    }

    .counter {
      color: rgba(255,250,241,.88);
      font-size: .75rem;
      font-weight: 700;
    }

    button {
      border: 0;
      cursor: pointer;
      color: var(--cream);
      font: 800 .8rem/1 "Courier New", monospace;
      letter-spacing: .05em;
      transition: transform .15s ease, filter .15s ease;
    }

    button:hover:not(:disabled) {
      filter: brightness(1.1);
      transform: translateY(-2px);
    }

    button:active:not(:disabled) {
      transform: translateY(1px);
    }

    button:disabled {
      cursor: wait;
      opacity: .65;
    }

    .clear-btn,
    .print-btn {
      padding: 14px 18px;
      border-radius: 7px;
    }

    .clear-btn {
      background: #667a83;
      box-shadow: 0 4px 0 #40545e;
    }

    .print-btn {
      background: var(--button);
      box-shadow: 0 4px 0 var(--button-shadow);
    }

    .receipt-area {
      width: min(80%, 460px);
      height: 0;
      margin-top: 30px;
      overflow: hidden;
      transition: height 1s cubic-bezier(.22,.8,.26,1);
    }

    .receipt-area.show {
      height: 355px;
    }

    .receipt {
      min-height: 340px;
      padding: 31px 27px 35px;
      position: relative;
      color: #3d4644;
      background:
        repeating-linear-gradient(
          0deg,
          rgba(95,76,50,.025) 0 1px,
          transparent 1px 4px
        ),
        var(--paper);
      box-shadow: 0 8px 16px rgba(5,15,22,.3);
      transform: translateY(-105%);
      transition: transform 1s cubic-bezier(.22,.8,.26,1);
    }

    .receipt-area.show .receipt {
      transform: translateY(0);
    }

    .receipt::before,
    .receipt::after {
      content: "";
      position: absolute;
      right: 0;
      left: 0;
      height: 10px;
      background:
        radial-gradient(
          circle at 8px -2px,
          transparent 8px,
          var(--bg) 8.8px 10px,
          transparent 10.6px
        ) 0 0 / 16px 10px repeat-x;
    }

    .receipt::before {
      top: -1px;
    }

    .receipt::after {
      bottom: -1px;
      transform: rotate(180deg);
    }

    .receipt-title {
      margin: 0 0 11px;
      text-align: center;
      font-size: 1rem;
      font-weight: 900;
      letter-spacing: .12em;
    }

    .receipt-date {
      padding-bottom: 13px;
      border-bottom: 1px dashed #727773;
      text-align: center;
      font-size: .69rem;
    }

    .receipt-message {
      min-height: 120px;
      margin: 18px 0;
      overflow-wrap: anywhere;
      white-space: pre-wrap;
      font: 700 1.1rem/1.55 Arial, "Noto Sans Thai", sans-serif;
    }

    .receipt-footer {
      padding-top: 13px;
      border-top: 1px dashed #727773;
      text-align: center;
      font-size: .7rem;
      font-weight: 700;
      letter-spacing: .04em;
    }

    @keyframes blink {
      to {
        opacity: .45;
        transform: scale(.82);
      }
    }

    @media (max-width: 700px) {
      .printer {
        min-height: auto;
        padding: 38px 32px 38px;
        border-width: 20px;
        border-radius: 36px;
      }

      .brand {
        margin: -22px 0 15px;
        font-size: 1.35rem;
      }

      .screen {
        min-height: 180px;
        padding: 16px;
        border-radius: 22px;
      }

      textarea {
        min-height: 145px;
      }

      .paper-slot {
        width: calc(100% - 10px);
        height: 34px;
        margin-top: 18px;
      }

      .paper-slot::before,
      .paper-slot::after {
        height: 13px;
        background:
          radial-gradient(circle at 6px 2px, var(--pink) 0 2.5px, transparent 3px) 0 0 / 12px 9px repeat-x,
          radial-gradient(circle at 0 8px, var(--pink) 0 3px, transparent 3.5px) 0 0 / 12px 9px repeat-x,
          radial-gradient(circle at 6px 10px, var(--pink) 0 4px, transparent 4.5px) 0 0 / 12px 11px repeat-x;
      }

      .receipt-area {
        width: min(88%, 460px);
      }

      .receipt-area.show {
        height: 345px;
      }
    }

    @media (max-width: 420px) {
      .control-panel {
        gap: 9px;
      }

      .status {
        padding: 9px 10px;
        font-size: .65rem;
      }

      .clear-btn,
      .print-btn {
        padding: 13px 11px;
        font-size: .67rem;
      }
    }
  </style>
</head>

<body>
  <main class="scene">
    <section class="printer-wrap" aria-label="เครื่องพิมพ์ข้อความสไตล์ Retro">
      <div class="printer">
        <h1 class="brand">ความในใจ</h1>

        <div class="screen">
          <textarea
            id="messageInput"
            maxlength="280"
            placeholder="พิมพ์ข้อความของคุณที่นี่..."
            aria-label="ข้อความที่ต้องการพิมพ์"
          ></textarea>
        </div>

        <div class="paper-slot" aria-hidden="true"></div>
      </div>

      <div class="control-panel">
        <div class="status" aria-live="polite">
          <span class="status-light" id="statusLight"></span>
          <span id="statusText">READY TO PRINT</span>
        </div>

        <span class="counter" id="counter">0 / 280</span>

        <button class="clear-btn" id="clearBtn" type="button">CLEAR</button>
        <button class="print-btn" id="printBtn" type="button">PRINT RECEIPT</button>
      </div>
    </section>

    <section class="receipt-area" id="receiptArea" aria-live="polite">
      <article class="receipt">
        <h2 class="receipt-title">ความในใจ</h2>
        <div class="receipt-date" id="receiptDate"></div>
        <div class="receipt-message" id="receiptMessage"></div>
        <div class="receipt-footer">THANK YOU FOR SHARING</div>
      </article>
    </section>
  </main>

  <script>
    const input = document.getElementById("messageInput");
    const printBtn = document.getElementById("printBtn");
    const clearBtn = document.getElementById("clearBtn");
    const receiptArea = document.getElementById("receiptArea");
    const receiptMessage = document.getElementById("receiptMessage");
    const receiptDate = document.getElementById("receiptDate");
    const statusText = document.getElementById("statusText");
    const statusLight = document.getElementById("statusLight");
    const counter = document.getElementById("counter");

    function updateCounter() {
      counter.textContent = `${input.value.length} / 280`;
    }

    function getDateTime() {
      return new Intl.DateTimeFormat("th-TH", {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(new Date());
    }

    function printReceipt() {
      const text = input.value.trim() || "ไม่มีข้อความ";

      receiptArea.classList.remove("show");
      statusText.textContent = "PRINTING...";
      statusLight.classList.add("active");
      printBtn.disabled = true;

      setTimeout(() => {
        receiptMessage.textContent = text;
        receiptDate.textContent = getDateTime();
        receiptArea.classList.add("show");
      }, 180);

      setTimeout(() => {
        statusText.textContent = "PRINT COMPLETE";
        statusLight.classList.remove("active");
        printBtn.disabled = false;
      }, 1250);
    }

    input.addEventListener("input", updateCounter);

    input.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        printReceipt();
      }
    });

    printBtn.addEventListener("click", printReceipt);

    clearBtn.addEventListener("click", () => {
      input.value = "";
      receiptArea.classList.remove("show");
      statusText.textContent = "READY TO PRINT";
      statusLight.classList.remove("active");
      updateCounter();
      input.focus();
    });

    updateCounter();
  </script>
</body>
</html>
