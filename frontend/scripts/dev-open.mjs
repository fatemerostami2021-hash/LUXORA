// Starts `next dev` and opens Chrome on the real localhost URL (reads the port Next picked).
import { spawn } from "node:child_process";

const child = spawn("npx", ["next", "dev", ...process.argv.slice(2)], {
  stdio: ["inherit", "pipe", "inherit"],
  shell: true,
});

let opened = false;
child.stdout.on("data", (buf) => {
  const text = buf.toString();
  process.stdout.write(text);
  if (opened) return;
  const m = text.match(/Local:\s+(https?:\/\/localhost:\d+)/);
  if (!m) return;
  opened = true;
  const url = m[1];
  const opts = { stdio: "ignore", detached: true };
  if (process.platform === "win32") spawn("cmd", ["/c", "start", "chrome", url], opts).unref();
  else if (process.platform === "darwin") spawn("open", ["-a", "Google Chrome", url], opts).unref();
  else spawn("xdg-open", [url], opts).unref();
});
child.on("exit", (code) => process.exit(code ?? 0));
