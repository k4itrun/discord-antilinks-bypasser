import { createInterface } from 'readline';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

let
    temp = path.join(process.cwd(), 'copy.txt'),
    copy = (txt, clb) => {
        fs.writeFile(temp, txt, (ex) => {
            (ex && (console.error('[\x1b[31mERROR\x1b[0m] Could not write to file copy text.'), console.error(`\x1b[31m${ex.message}\x1b[0m`), clb(), true));
            exec(`clip < "${temp}"`, ex => {
                (ex ? (console.error('[\x1b[31mERROR\x1b[0m] Failed to copy to clipboard.'), console.error(`\x1b[31m${ex.message}\x1b[0m`)) : console.log('\x1b[0m[\x1b[32mOK\x1b[0m] Link copied to your clipboard (use: ctrl + v)'));
                fs.unlink(temp, uex => {
                    (uex && (console.error('[\x1b[31mERROR\x1b[0m] Could not delete file.'), console.error(`\x1b[31m${uex.message}\x1b[0m`)));
                    clb();
                });
            });
        });
    },
    processs = (url, rl) => {
        (!url && (console.log('\x1b[0m[\x1b[31mOK\x1b[0m] No URL entered.'), rl.close(), true)) || (function () {
            var p;
            if (url.startsWith('http://') || url.startsWith('https://')) p = url.substring(url.indexOf('/', 8) + 1);
            else p = url;
            var toHex = (str) => Buffer.from(str, 'utf8').toString('hex'),
                weenHex = (str) => (str.match(/.{1,2}/g) || []).join('%');
            copy(`<ht\ntp\ns:/\\%${weenHex(toHex(p)).replace('%2f', '/')}>`, () => rl.prompt());
        })();
    },
    main = () => {
        let rl = createInterface({ input: process.stdin, output: process.stdout });
        rl.setPrompt('\x1b[0m[\x1b[31mC\x1b[38;5;82mL\x1b[38;5;33mI\x1b[0m] Please enter the link to send (e.g., discord.gg/vanity): \x1b[38;5;213m');
        rl.prompt();
        rl.on('line', (u) => processs(u, rl));
    };

main();
