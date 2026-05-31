import { fromHexString } from "./utils";

// 🯰🯱🯲🯳🯴🯵🯶🯷🯸🯹
const forceMobile = new URLSearchParams(window.location.search).has("tape-mobile");
if (forceMobile) {
  document.getElementById("funtape-force-mobile")!.style.display = "none";
  document.getElementById("funtape-unforce-mobile")!.style.display = "block";
}
const mobile = document.body.clientWidth < 1000 || forceMobile;
const tapes = document.querySelectorAll(".funtape");

function dragStart(event: DragEvent) {
  const target = event.target as HTMLDivElement;
  event.dataTransfer?.setData("text/plain", target.id + "," + target.parentElement!.id);
  setTimeout(() => {
    const box = document.createElement("div");
    box.classList.add("funtape-holder-empty", "box");
    const helper = document.createElement("div");
    helper.classList.add("box-helper");
    const e = document.createElement("div");
    e.classList.add("center-flex");
    e.innerHTML = "<p>INSERT TAPE<br /> HERE</p>";
    box.append(helper);
    box.append(e);
    target.parentElement?.append(box);
    target.classList.add("dragged-tape");
  }, 0);
}
function dragStop(event: DragEvent) {
  const target = event.target as HTMLDivElement;
  target.classList.remove("dragged-tape");
  target.parentElement?.querySelector(".funtape-holder-empty")?.remove();
}
function drop(event: DragEvent, holder: HTMLDivElement) {
  const empty = holder.querySelector(".funtape-holder-empty");
  if (empty == null) {
    return; // prevent multiple tapes be in same holder
  }
  const data = event.dataTransfer?.getData("text/plain")!.split(",") as string[];
  const tape = document.getElementById(data[0]) as HTMLDivElement;
  tape.remove();
  holder.append(tape);
  empty.remove();
  if (data[1] == "funplayer-holder") {
    deactivateTape(tape);
  }
  if (holder.id == "funplayer-holder") {
    activateTape(tape);
  }
}
function dragOver(event: DragEvent) {
  event.preventDefault();
}
function initHolder(holder: HTMLDivElement) {
  holder.addEventListener("drop", (e) => drop(e, holder));
  holder.addEventListener("dragover", dragOver);
}

let mobileSelectedTape: HTMLDivElement | null = null;
function mobileTap(event: PointerEvent, target: HTMLDivElement) {
  if (mobileSelectedTape == null) {
    mobileSelectedTape = target.querySelector(".funtape");
    if (mobileSelectedTape != null) target.classList.add("funtape-holder-selected-mobile");
  } else {
    const empty: HTMLDivElement | null = target.querySelector(".funtape-holder-empty");
    if (empty == null) return;
    empty.remove();
    if (mobileSelectedTape.parentElement?.id == "funplayer-holder") {
      deactivateTape(mobileSelectedTape);
    }
    mobileSelectedTape.parentElement?.append(empty);
    mobileSelectedTape.parentElement?.classList.remove("funtape-holder-selected-mobile");
    mobileSelectedTape.remove();
    target.append(mobileSelectedTape);
    if (target.id == "funplayer-holder") {
      activateTape(mobileSelectedTape);
    }
    mobileSelectedTape = null;
  }
}
function initHolderMobile(holder: HTMLDivElement) {
  holder.onclick = (e) => mobileTap(e, holder);
}

tapes.forEach(
  mobile
    ? (tape) => {
        // Mobile init
        const holder = tape.parentElement as HTMLDivElement;
        initHolderMobile(holder);
      }
    : (tape) => {
        // Desktop init
        const holder = tape.parentElement as HTMLDivElement;
        tape.setAttribute("draggable", "true");
        tape.addEventListener("dragstart", dragStart as any);
        tape.addEventListener("dragend", dragStop as any);
        initHolder(holder);
      },
);
if (mobile) {
  initHolderMobile(document.getElementById("funplayer-holder")! as HTMLDivElement);
  initHolderMobile(document.getElementById("funplayer-extra-holder")! as HTMLDivElement);
} else {
  initHolder(document.getElementById("funplayer-holder")! as HTMLDivElement);
  initHolder(document.getElementById("funplayer-extra-holder")! as HTMLDivElement);
}

const tapeScripts: any = {
  clr_filter: {
    apply: (tape: HTMLDivElement, tp: any) => {
      const overlay = createTapeOverlay(tape, tp);
      overlay.innerHTML += `
      <h4>Color Filter</h4>
      Hue: <input class="clr_filter-hue" type="range" min="0" max="360" value="45"><br>
      Saturation: <input class="clr_filter-sat" type="range" min="0" max="10" value="1.5"><br>
      Brightness: <input class="clr_filter-brightness" type="range" min="0" max="600" value="100">
      `;
      function update() {
        const hue = (overlay.querySelector(".clr_filter-hue")! as HTMLInputElement).value;
        const sat = (overlay.querySelector(".clr_filter-sat")! as HTMLInputElement).value;
        const brightness = ((overlay.querySelector(".clr_filter-brightness")! as HTMLInputElement).value as any) / 100;
        document.body.style.filter = `hue-rotate(${hue}deg) brightness(${brightness}) saturate(${sat})`;
      }
      [".clr_filter-hue", ".clr_filter-sat", ".clr_filter-brightness"].forEach((id) => ((overlay.querySelector(id)! as HTMLInputElement).oninput = update));
      document.body.style.filter = "hue-rotate(45deg) brightness(1) saturate(1.5)";
    },
    destroy: (tape: HTMLDivElement, tp: any) => {
      destroyTapeOverlay(tape, tp);
      document.body.style.filter = "";
    },
  },
  grayscale: {
    apply: (tape: HTMLDivElement, tp: any) => {
      document.body.classList.add("ft1-effect");
    },
    destroy: (tape: HTMLDivElement, tp: any) => {
      document.body.classList.remove("ft1-effect");
    },
  },
  secret_tape: {
    apply: (tape: HTMLDivElement, tp: any) => {
      setTimeout(tp.auth, 0, tape, tp);
    },
    auth: async (tape: HTMLDivElement, tp: any) => {
      const aesjs = await import("aes-js");
      try {
        const hex = prompt("Decryption key is required to load tape's data");
        if (hex == null) return tp.on_fail(tape, tp);
        const key = fromHexString(hex);
        let aesEcb = new aesjs.ModeOfOperation.ecb(key);
        let decryptedBytes = aesEcb.decrypt(fromHexString("d931e9761c792f9d78c269f42b9077b61178bdc10389c64d6479435f1e1f00af"));
        let decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
        if (decryptedText.startsWith("http")) {
          open(decryptedText + "?key=" + hex.toUpperCase());
        } else {
          throw new Error("Bad key");
        }
      } catch {
        tp.on_fail(tape, tp);
      }
    },
    on_fail: (tape: HTMLDivElement, tp: any) => {
      const overlay = createTapeOverlay(tape, tp);
      overlay.innerHTML += '<h3 style="color: red;">Decryption key is not valid.</h3>';
    },
    destroy: (tape: HTMLDivElement, tp: any) => {
      destroyTapeOverlay(tape, tp);
    },
  },
  /*
  _template: {
    apply: (tape: HTMLDivElement, tp: any) => {},
    destroy: (tape: HTMLDivElement, tp: any) => {},
  },
  */
};

function activateTape(tape: HTMLDivElement) {
  console.log("Activated tape", tape.id);
  const tp = tapeScripts[tape.id];
  tp?.apply(tape, tp);

  const light = document.getElementById("funplayer-tape-light")! as HTMLDivElement;
  const play = document.getElementById("funplayer-play")! as HTMLSpanElement;
  const nt = document.getElementById("funplayer-nt")! as HTMLSpanElement;
  light.classList.remove("funplayer-light-red");
  light.classList.add("funplayer-light-green");
  play.classList.remove("inactive");
  nt.classList.add("inactive");
}
function deactivateTape(tape: HTMLDivElement) {
  console.log("Deactivated tape", tape.id);
  const tp = tapeScripts[tape.id];
  tp?.destroy(tape, tp);

  const light = document.getElementById("funplayer-tape-light")! as HTMLDivElement;
  const play = document.getElementById("funplayer-play")! as HTMLSpanElement;
  const nt = document.getElementById("funplayer-nt")! as HTMLSpanElement;
  light.classList.remove("funplayer-light-green");
  light.classList.add("funplayer-light-red");
  play.classList.add("inactive");
  nt.classList.remove("inactive");
}
function createTapeOverlay(tape: HTMLDivElement, tp: any): HTMLDivElement {
  const container = document.createElement("div");
  const overlay = document.createElement("div");
  const helper = document.createElement("div");
  container.classList.add("tape-overlay-container");
  overlay.classList.add("box", "tape-overlay", "tape-overlay-" + tape.id);
  helper.classList.add("box-helper");
  document.body.append(container);
  container.append(overlay);
  overlay.append(helper);
  tp.overlay = overlay;
  return overlay;
}
function destroyTapeOverlay(tape: HTMLDivElement, tp: any) {
  tp.overlay?.parentElement?.remove();
  delete tp.overlay;
}
