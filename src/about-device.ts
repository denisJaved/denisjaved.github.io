import { formatColoredString, repackArray } from "./utils";

const buttons = repackArray(document.getElementById("about-btns")?.children!) as Array<HTMLButtonElement>;
const paginator = document.getElementById("about-paginator")! as HTMLSpanElement;
const contents = document.getElementById("about-contents")! as HTMLDivElement;
for (let i = 0; i < buttons.length; i++) {
  buttons[i].onclick = () => onclick(i);
}

const screens: any = {
  home: {
    text: [
      "Greetings. I am DenisJaved a DevOps engineer and a backend developer.*I also have some frontend experience, but nothing suprising.*I created this website to show some fun stuff and tell about myself.*You can press buttons on the left to navigate this device*and find out more about me if you are intrested.",
    ],
    buttons: ["this_website", "manual"],
  },
  manual: {
    text: [
      "bDENISJAVA MESSAGE DISPLAY (aka DJMD) MANUAL*gDJMD allows reading number of prerecorded messages*in simple 6 button inteface.*In the end of each page (after long dash) each button's action is displayed.*Those actions mean the following:*w*PREVg - go back to previous page of current message.*w*NEXTg - go to next page of current message.*w*SCR-g - scroll action list backwards.*w*SCR+g - scroll action list forwards.*Any other actions mean navigating to different message.*If action is rREDg, it is not available.",
      "bDENISJAVA MESSAGE DISPLAY (aka DJMD) MANUAL*gTop-right corner of the DJMD device displays paginator.*Paginator tells you how much pages are left to this message.*First number is current page. Second number (separated by /) is total amount of pages.*Right arrow means that you are not on last page of this message.*Left arrow means the opposite.*No arrow will be displayed if message contains only one page.",
    ],
    buttons: ["home"],
  },
  backend: {
    text: [], // TODO: write
    buttons: ["home"],
  },
  this_website: {
    text: [
      "Purpose of this website is to be kinda like buiness card, but fun and interactive.*I'm no frontend dev, but I certainly have created dozens of websites.*One of them being this. I though about this website as a challenge.*I wanted to create it without coping other's code or using AI to do so.",
      "bINSPERATION*gI coded all of this website myself with use of some libraries. Them being:*- PopperJS (navbar tooltips)*- aes-js (secret djfun tape encryption)*- boostrap-icons (pack of SVG's)*For DJFUN tapes I took insperation from Gemma Croad's Vintage VHS pack (codepen.io/pen/myrYqZE).*Airbus's Flight Management Display Unit inspired the DJMD (thing you reading this message from).",
    ],
    buttons: ["home"],
  },
  /*
  _template: {
    text: [""],
    buttons: []
  }
  */
};
let currentState = {
  id: "start",
  page: 0,
  actionScroll: 0,
  actions: [null, null, null, null, null, null] as Array<string | null>,
};
function onclick(btn: number) {
  const action = currentState.actions[btn];
  if (action == null || action.startsWith("$")) {
    buttons[btn].classList.add("err");
    setTimeout(() => buttons[btn].classList.remove("err"), 500);
    return;
  }
  if (action.startsWith("*")) {
    if (action == "*PREV") currentState.page -= 1;
    else if (action == "*NEXT") currentState.page += 1;
    else if (action == "*SCR-") currentState.actionScroll -= 1;
    else if (action == "*SCR+") currentState.actionScroll += 1;
    update();
  } else {
    setScreen(action);
  }
}
function update() {
  const scr = screens[currentState.id] as any;
  const pages = scr.text.length;
  paginator.innerText = `${currentState.page + 1} / ${pages} ` + (pages == 1 ? "✓" : currentState.page + 1 < pages ? "🢂" : "🢀");
  let btnOffset = 0;
  if (pages > 1) {
    currentState.actions[0] = currentState.page == 0 ? "$*PREV" : "*PREV";
    currentState.actions[1] = currentState.page + 1 >= pages ? "$*NEXT" : "*NEXT";
    btnOffset += 2;
  }
  if (scr.hasOwnProperty("actionScroll")) {
    currentState.actions[btnOffset] = currentState.actionScroll == 0 ? "$*SCR-" : "*SCR-";
    currentState.actions[btnOffset + 1] = currentState.actionScroll == scr.buttons.length - 1 ? "$*SCR+" : "*SCR+";
    btnOffset += 2;
  }
  for (let i = 0; i < Math.min(6 - btnOffset, scr.buttons.length - currentState.actionScroll); i++) {
    const btn = scr.buttons[i + currentState.actionScroll];
    currentState.actions[i + btnOffset] = btn;
  }
  const lastText = currentState.actions.findLastIndex((e) => e != null) + 1;
  let actionHelp = "";
  for (let i = 0; i < 6; i++) {
    const btn = currentState.actions[i];
    if (btn == null || btn.startsWith("$")) {
      buttons[i].classList.add("inactive");
    } else {
      buttons[i].classList.remove("inactive");
    }
    if (i < lastText) {
      if (btn?.startsWith("$")) {
        actionHelp += `n${i + 1} r${btn.substring(1)}*`;
      } else {
        actionHelp += `n${i + 1} b${btn ?? "nN/A"}*`;
      }
    }
  }
  contents.replaceChildren(formatColoredString(`bPRERECORDED MESSAGE*g${scr.text[currentState.page]}*w-------------------------*${actionHelp}`));
}
function setScreen(name: string) {
  currentState = {
    id: name,
    page: 0,
    actionScroll: 0,
    actions: [null, null, null, null, null, null],
  };
  update();
}
setScreen("manual");
