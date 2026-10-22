// `npm run dev` runs this file: it starts Next.js and opens Chrome automatically on the real localhost URL.
// If Chrome can't be found it opens your default browser instead. Set NO_OPEN=1 to disable.
import { spawn } from "node:child_process";

const child = spawn("npx", ["next", "dev", ...process.argv.slice(2)], { stdio: ["inherit", "pipe", "inherit"], shell: true });

const quiet = { stdio: "ignore", detached: true };
function openBrowser(url) {
  if (process.env.NO_OPEN) return;
  if (process.platform === "win32") {
    // `start chrome` uses Chrome's registered name; if it fails, fall back to the default browser.
    const p = spawn("cmd", ["/c", "start", '""', "chrome", url], quiet);
    p.on("exit", (code) => { if (code) spawn("cmd", ["/c", "start", '""', url], quiet).unref(); });
    p.unref();
  } else if (process.platform === "darwin") {
    spawn("open", ["-a", "Google Chrome", url], quiet).unref();
  } else {
    spawn("xdg-open", [url], quiet).unref();
  }
}

let opened = false;
child.stdout.on("data", (buf) => {
  const text = buf.toString();
  process.stdout.write(text);
  if (opened) return;
  // strip color codes before matching
  const clean = text.replace(/\u001b\[[0-9;]*m/g, "");
  const m = clean.match(/Local:\s+(https?:\/\/localhost:\d+)/);
  if (!m) return;
  opened = true;
  setTimeout(() => openBrowser(m[1]), 600);
});
child.on("exit", (code) => process.exit(code ?? 0));
process.on("SIGINT", () => child.kill("SIGINT"));
