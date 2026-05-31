import { formatColoredString } from "./utils";

const terminal = document.getElementById("terminal")!;
const expandBtn = document.getElementById("terminal-expand")!;
const inputWrap = document.getElementById("terminal-input-wrap")!;
const input = document.getElementById("terminal-input")! as HTMLInputElement;
const terminalWindow = document.querySelector(".terminal-window")!;

function pushLine(text: string) {
  terminal.append(formatColoredString(text));
}

function fixTerm() {
  inputWrap.remove();
  terminal.append(inputWrap);
  input.value = "";
  input.focus();
  terminal.scrollTop = terminal.scrollHeight;
}

function handleInput(cmd: string, term: string, echo: boolean) {
  if (echo) pushLine("gguest@absolute-devicew:b~w$ " + cmd);
  const ex: string = cmd.split(" ")[0];
  if (ex == "clear") {
    terminal.replaceChildren(inputWrap);
  } else if (ex == "echo") {
    pushLine(cmd.substring(5));
  } else if (ex == "fastfetch" || ex == "neofetch") {
    const os: string = navigator.hasOwnProperty("oscpu") ? (navigator as any).oscpu : navigator.platform;
    const windows: boolean = os.toLowerCase().indexOf("win") != -1;
    [
      "tguestw@tabsolute-device",
      "-------------------------",
      `tOSw: ${os}`,
      `tKernelw: ${windows ? "Windows NT" : "Linux 7.0.10"}`,
      `tPackagesw: ${windows ? "∞ bloatware" : "9 (flatpak), 1634 (pacman). 2354654 updates available"}`,
      `tShellw: ${term}`,
      `tUAw: ${navigator.userAgent}`,
      `q██r██g██o██p██t██w██`,
      `Q██R██G██O██P██T██W██`,
    ].forEach(pushLine);
  } else if (ex == "rm") {
    if (cmd.endsWith("/*") || cmd.endsWith("/") || cmd.endsWith("--no-preserve-root")) {
      pushLine("rm: Deleting git@github.com:denisJaved/denisjaved.github.io.git");
      const iframe = document.createElement("iframe");
      iframe.src = "https://doesnotexistplsihope.github.io";
      iframe.style.width = "100vw";
      iframe.style.height = "100vh";
      iframe.style.border = "none";
      document.body.style.padding = "0px";
      document.body.style.margin = "0px";
      document.body.replaceChildren(iframe);

      setTimeout(() => window.location.reload(), 15000);
    } else {
      pushLine("rm: Only rm -rf / is supported");
    }
  } else if (ex == "sv.cheats") {
    pushLine("rNah bro");
  } else if (ex == "sv.ping") {
    let data = {
      index: 0,
      servers: [
        "BRAVO",
        "CHARLIE",
        "DELTA",
        "ECHO",
        "FOXTROT",
        "GOLF",
        "HOTEL",
        "INDIA",
        "JUILETT",
        "KILO",
        "LIMO",
        "MIKE",
        "NOVEMBER",
        "OSCAR",
        "PAPA",
        "QUEBEC",
        "ROMEO",
        "SIERRA",
        "TANGO",
        "VICTOR",
        "WHISKEY",
        "XRAY",
        "YANKEE",
      ],
    };
    pushLine(`Sending packages 'BRAVO'`);
    const inter_id = setInterval(() => {
      pushLine(`Server '${data.servers[data.index]}' recieved g4/4w packages`);
      data.index++;
      if (data.index < data.servers.length - 1) {
        pushLine(`Sending packages '${data.servers[data.index]}'`);
      } else {
        pushLine("Ping 'ALL_SERVERS' finished");
        clearInterval(inter_id);
      }
      fixTerm();
    }, 380);
  } else if (ex == "help" || ex == "man") {
    ["Available commands: fastfetch, neofetch, help", "sv.ping, sv.cheats, rm, echo, clear, man, reboot", "shutdown, sh, fish, bash, djterm"].forEach(pushLine);
  } else if (ex == "reboot") {
    window.location.reload();
  } else if (ex == "shutdown") {
    window.close();
  } else if (ex == "sh" || ex == "djterm" || ex == "bash" || ex == "fish") {
    if (cmd.trim() == ex && ex != "djterm") {
      pushLine(`r${ex}: Interactive mode not supported`);
      return;
    }
    handleInput(cmd.substring(ex.length + 1), ex, false);
  } else {
    pushLine("rdjterm: Unknown command: " + ex);
  }
}

const expandTerm = (e: any) => {
  const params = new URLSearchParams(window.location.search);
  if (terminalWindow.classList.contains("terminal-window-expanded")) {
    terminalWindow.classList.remove("terminal-window-expanded");
    expandBtn.classList.remove("bi-dash");
    expandBtn.classList.add("bi-plus");

    params.delete("term");
  } else {
    terminalWindow.classList.add("terminal-window-expanded");
    expandBtn.classList.add("bi-dash");
    expandBtn.classList.remove("bi-plus");

    params.set("term", "fullscreen");
  }
  window.history.replaceState({}, "", window.location.origin + window.location.pathname + "?" + params.toString());
  fixTerm();
};
expandBtn.onclick = expandTerm;

input.onkeydown = (e) => {
  if (e.code == "Enter") {
    handleInput(input.value, "djterm", true);
    fixTerm();
  }
};

terminal.onclick = (e) => input.focus();

(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.has("term")) {
    expandTerm(null);
  }
  pushLine("Welcome to djterm 1.4.3");
  pushLine('Type command or use "help" for list of commands');
  fixTerm();
})();
