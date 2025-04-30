import { exec } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createInterface, Interface } from "node:readline";

const COLORS = {
 reset: "\x1b[0m",
 red: "\x1b[31m",
 green: "\x1b[32m",
 yellow: "\x1b[33m",
 lightGreen: "\x1b[38;5;82m",
 lightBlue: "\x1b[38;5;33m",
 lightPurple: "\x1b[38;5;213m",
 info: "\x1b[31mINFO\x1b[0m",
 success: "\x1b[32mSUCCESS\x1b[0m",
 error: "\x1b[31mERROR\x1b[0m",
};

const TEMP_FILE: string = path.join(process.cwd(), "clipboard_copy.txt");

const copyToClipboard = (text: string, callback: () => void): void => {
 fs.writeFile(TEMP_FILE, text, (err) => {
  if (err) {
   console.error(`[${COLORS.error}] Failed to write to temporary file.`);
   console.error(`${COLORS.red}${err.message}${COLORS.reset}`);
   callback();
   return;
  }

  exec(`clip < "${TEMP_FILE}"`, (err) => {
   if (!err) {
    console.log(`${COLORS.reset}[${COLORS.success}] Text copied to clipboard (use: Ctrl + V)`);
   } else {
    console.error(`[${COLORS.error}] Failed to copy to clipboard.`);
    console.error(`${COLORS.red}${err.message}${COLORS.reset}`);
   }

   fs.unlink(TEMP_FILE, (err) => {
    if (err) {
     console.error(`[${COLORS.error}] Failed to delete temporary file.`);
     console.error(`${COLORS.red}${err.message}${COLORS.reset}`);
    }
    callback();
   });
  });
 });
};

const wrapUrl = (url: string, readline: Interface): void => {
 if (!url) {
  console.log(`${COLORS.reset}[${COLORS.info}] No URL entered.`);
  readline.close();
  return;
 }

 const formatUrl = (): string => {
  const urlPath = url.startsWith("http://") || url.startsWith("https://") ? url.substring(url.indexOf("/", 8) + 1) : url;

  return `<ht\ntp\ns:/\\%${Buffer.from(urlPath, "utf8")
   ?.toString?.("hex")
   ?.match?.(/.{1,2}/g)
   ?.join?.("%")
   ?.replace("%2f", "/")}>`;
 };

 const formattedUrl = formatUrl();
 copyToClipboard(formattedUrl, () => readline.prompt());
};

const main = (): void => {
 const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
 });

 readline.setPrompt(`${COLORS.reset}[${COLORS.red}${COLORS.lightGreen}${COLORS.lightBlue}C${COLORS.reset}${COLORS.lightGreen}L${COLORS.lightBlue}I${COLORS.reset}] Enter a link to process (e.g., discord.gg/vanity): ${COLORS.lightPurple}`);

 readline.prompt();
 readline.on("line", (url) => wrapUrl(url.trim(), readline));
};

main();
