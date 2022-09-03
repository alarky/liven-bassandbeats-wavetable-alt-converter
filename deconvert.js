import fs from 'fs';
import { deConvert87 } from "./lib/sysex.js";
import { logDecompressBuffer } from "./lib/log.js";
import { BBSoundData } from "./lib/bbsound.js";
import { WavData } from "./lib/wavdata.js";

const input = process.argv[2];
const output = process.argv[3];
if (!input || !output) {
    console.error("usage: node deconvert.js {input} {output}");
    process.exit(1);
}

let syxdata = fs.readFileSync(input);

// load raw messages
let messages = [];
let msg = [];
for (let b of syxdata) {
    msg.push(b);
    if (b === 0xF7) {
        messages.push(msg);
        msg = [];
    }
}

// filter data
const dataHeader = JSON.stringify([240, 0, 72, 4, 0, 0, 4, 96, 2]);
let data = [];
for (let msg of messages) {
    if (JSON.stringify(msg.slice(0, 9)) === dataHeader) {
        data = data.concat(msg.slice(9, -1));
    }
}

// de convert 87
let deconverteds = [];
for (let i = 0; i < data.length / 8; i++) {
    const frame = data.slice(i*8, i*8+8);
    deconverteds = deconverteds.concat(deConvert87(frame, frame.length - 1))
}

// bb sound data
const bbs = new BBSoundData("", []);
bbs.setBytes(deconverteds)

// de compress wt
const wt = new Int16Array(bbs.data.length);
logDecompressBuffer(wt, bbs.data, bbs.data.length)

// upsample 512 to 2048
// convert 16bit int to 32bit float
const wt2 = new Float32Array(wt.length * 4);
for (let i = 0; i < wt.length; i++) {
    const value = Math.fround(wt[i] / 32767);
    wt2[i*4]   = value;
    wt2[i*4+1] = value;
    wt2[i*4+2] = value;
    wt2[i*4+3] = value;
}

// wav export
const wav = new WavData();
const wavData = wav.exportWAV(wt2, 44100);
fs.writeFileSync(output, wavData);

console.log(`converted: ${output}`);
