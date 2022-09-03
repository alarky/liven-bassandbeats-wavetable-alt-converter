import fs from 'fs';
import { deConvert87 } from "./lib/sysex.js";
import { logDecompressBuffer } from "./lib/log.js";
import { BBSoundData } from "./lib/bbsound.js";
import { WavData } from "./lib/wavdata.js";

let syxdata = fs.readFileSync("data/BDSI.syx");
//let syxdata = fs.readFileSync("data/01_Saw_Sine_Square_Triangle.syx");

let messages = [];
let msg = [];
for (let b of syxdata) {
    msg.push(b);
    if (b === 0xF7) {
        //console.log(msg.length, msg);
        messages.push(msg);
        msg = [];
    }
}

// filter data
const dataHeader = JSON.stringify([240, 0, 72, 4, 0, 0, 4, 96, 2]);
let data = [];
for (let msg of messages) {
    if (JSON.stringify(msg.slice(0, 9)) === dataHeader) {
        //console.log(msg.slice(9, -1).length);
        data = data.concat(msg.slice(9, -1));
    }
}
//console.log(data, data.length);

// de convert 87
let deconverteds = [];
for (let i = 0; i < data.length / 8; i++) {
    const frame = data.slice(i*8, i*8+8);
    deconverteds = deconverteds.concat(deConvert87(frame, frame.length - 1))
}
//console.log(deconverteds, deconverteds.length);

// bb sound data
const bbs = new BBSoundData("", []);
bbs.setBytes(deconverteds)
//console.log(bbs.data, bbs.data.length);

// split tables
const tables = [];
for (let i = 0; i < bbs.data.length/512; i++) {
    const table = bbs.data.slice(512*i, 512*(i+1));
    tables.push(table);
}
console.log(tables, tables.length);
//throw "";

// cull cycle 512 to 256
const wt0 = new Int16Array(bbs.data.length/2);
for (let i = 0; i < bbs.data.length/512; i++) {
    if (!(i % 2)) {

    }
}

// de compress wt
const wt = new Int16Array(bbs.data.length);
logDecompressBuffer(wt, bbs.data, bbs.data.length)
console.log(wt, wt.length);

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
console.log(wt2, wt2.length);
//let json = JSON.stringify(wt2);
//fs.writeFileSync("r2.json", json);

// wav export
const wav = new WavData();
wav.fmtID = 1;
wav.blockSize = 4;
const wavData = wav.exportWAV(wt2, 44100);
console.log(wavData);
fs.writeFileSync("out.wav", wavData);
//wavBlob.arrayBuffer().then(buffer => {
//    console.log(buffer);
//    fs.writeFileSync("out.wav", buffer);
//})

