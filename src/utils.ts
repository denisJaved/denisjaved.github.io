export const fromHexString = (hexString: string) => Uint8Array.from(hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
export const repackArray = (iter: Iterable<any>) => {
  const arr = [];
  for (const i of iter) arr.push(i);
  return arr;
};
export const formatColoredString = (text: string) => {
  const line = document.createElement("div");
  let last: HTMLSpanElement = document.createElement("span");
  last.classList.add("cw");
  line.append(last);
  const first = last;
  let next_color: boolean = false;
  for (let i = 0; i < text.length; i++) {
    let c = text[i];
    if (c == "") {
      next_color = true;
      continue;
    }
    if (next_color) {
      if (c == "*") {
        last.innerHTML += "<br>";
        const ll = last;
        last = document.createElement("span");
        last.classList.add(ll.classList[0]);
        line.append(last);

        next_color = false;
        continue;
      }
      const lc = c.toLowerCase();
      let color = lc == c ? "c" + c : `c${lc}d`;

      last = document.createElement("span");
      last.classList.add(color);
      line.append(last);

      next_color = false;
      continue;
    }
    last.innerText += c;
  }
  if (first.innerText == "") {
    first.remove();
  }
  return line;
};
