import { WavData } from "./lib/wavdata.js"
import { logCompressBuffer, logDecompressBuffer } from "./lib/log.js";
import fs from 'fs'

let data = fs.readFileSync("data/Analog_BD_Sin.wav")

// serum 1cycle samples
const e = 2048;

let o = new DataView(data.buffer);
let d = new WavData;
d.setBytes(o);
if ("RIFF" != d.riffHeader || "WAVE" != d.waveHeader || d.bitRate < 8)
    throw "Please select a wav file";
    //return void alert("Please select a wav file");

// cycles
const s = Math.min(parseInt(d.samples.length / e, 10), 256);

// sliced wt
const l = new ArrayBuffer(256);

for (let t = 0; t < 256; t++) {
    l[t] = t < s ? d.samples.slice(t * e, t * e + e) : new Float32Array(e);
}

// output wt
// 512 sample/cycle
// 128 cycles
const t = new Int16Array(65536);

// downsample
const i = Math.fround((s - 1) / 127);
const r = 128;

for (let e = 0; e < r; e++) {
    // origin cycle point
    const a = Math.fround(i * e);
    // origin cycle number
    const n = 127 == e ? s - 2 : parseInt(a, 10);
    // origin local point
    const r = 127 == e ? 0 : 1 - (a - n);

    console.log(e, a, n, r);

    // downsample 2048 to 512
    // convert 32bit float to 16bit signed int
    for (let a = 0; a < 512; a++) {
        const o = 4 * a;
        const d = Math.fround(l[n][o] * r) + Math.fround(l[n + 1][o] * (1 - r));
        //console.log(" ", a, o, d, 512 * e + a)
        t[512 * e + a] = parseInt(Math.fround(32767 * d), 10)
    }
    //console.log(t);
    //throw "";
}

let json = JSON.stringify(t);
fs.writeFileSync("t.json", json);

// compress 16bit signed int to 8bit signed int
const audioCompressedBuffer = new Int8Array(65536);
logCompressBuffer(audioCompressedBuffer, t, 65536);
json = JSON.stringify(audioCompressedBuffer);
fs.writeFileSync("t2.json", json);

const deCompressedBuffer = new Int16Array(65536);
logDecompressBuffer(deCompressedBuffer, audioCompressedBuffer, 65536);
json = JSON.stringify(deCompressedBuffer);
fs.writeFileSync("t3.json", json);