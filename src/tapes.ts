// 🯰🯱🯲🯳🯴🯵🯶🯷🯸🯹
const mobile = document.body.clientWidth < 1000;
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

tapes.forEach(
  mobile
    ? (tape) => {
        // Mobile init
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
if (!mobile) {
  initHolder(document.getElementById("funplayer-holder")! as HTMLDivElement);
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
}
function deactivateTape(tape: HTMLDivElement) {
  console.log("Deactivated tape", tape.id);
  const tp = tapeScripts[tape.id];
  tp?.destroy(tape, tp);
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
