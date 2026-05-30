import { createPopper, offset } from "@popperjs/core";

function createText(text: string) {
  const t = document.createElement("span");
  t.innerText = text;
  return t;
}

document.querySelectorAll("a.scroll-link").forEach((elem: any) => {
  elem.addEventListener("mouseenter", (_: any) => {
    if (elem.hasOwnProperty("data_popper") && elem.data_popper != null) {
      return;
    }

    const tooltip = document.createElement("div");
    tooltip.appendChild(createText("Click to scroll"));
    tooltip.classList.add("tooltip");
    tooltip.setAttribute("data-show", ""); // make popperjs element visible

    const popper = createPopper(elem, tooltip, {
      modifiers: [{ name: "offset", options: { offset: [0, 2] } }],
    });
    document.body.append(tooltip);
    elem.data_popper = [tooltip, popper];
    popper.forceUpdate();
  });

  elem.addEventListener("mouseleave", (_: any) => {
    if (!elem.hasOwnProperty("data_popper") || elem.data_popper == null) {
      return;
    }

    elem.data_popper[0].remove(); // remove DOM node
    elem.data_popper[1].destroy(); // destroy popperjs object
    elem.data_popper = null;
  });
});
