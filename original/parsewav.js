import { WavData } from "../lib/wavdata.js"
import { logCompressBuffer, logDecompressBuffer } from "../lib/log.js";
import { BBSoundData } from "../lib/bbsound.js";
import { createStartMessage, createDataMessage, createEndMessage } from "../lib/sysex.js";
import fs from 'fs'

const audioCompressedBuffer = new Int8Array(65536);

// load file
(function() {
    let data = fs.readFileSync("data/Analog_BD_Sin.wav")

    // serum 1cycle samples
    const e = 2048;

    let o = new DataView(data.buffer);
    let d = new WavData;
    d.setBytes(o);
    if ("RIFF" != d.riffHeader || "WAVE" != d.waveHeader || d.bitRate < 8)
        throw "Please select a wav file";

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

        //console.log(e, a, n, r);

        // downsample 2048 to 512
        // convert 32bit float to 16bit int
        for (let a = 0; a < 512; a++) {
            const o = 4 * a;
            const d = Math.fround(l[n][o] * r) + Math.fround(l[n + 1][o] * (1 - r));
            //console.log(" ", a, o, d, 512 * e + a)
            t[512 * e + a] = parseInt(Math.fround(32767 * d), 10)
        }
    }

    // compress 16bit int to 8bit int
    logCompressBuffer(audioCompressedBuffer, t, 65536);
})();

// convert to syx
(function(){
    let e = [];
    let t = new Uint8Array;
    let a = "WAVNAME";

    const n = 7 * parseInt(30.75, 10);
    // n = 210

    const r = new BBSoundData(a, audioCompressedBuffer).toBytes();
    console.log(r);

    //t = createStartMessage(7, r.byteLength);
    //e = e.concat(Array.from(t));
    const o = r.byteLength;
    let d = 0;
    for (; d < o;) {
        var sizeToSend = o - d > n ? n : o - d;
        let a = r.slice(d, d + sizeToSend);
        t = createDataMessage(a, a.byteLength);
        e = e.concat(Array.from(t));
        d += sizeToSend;
    }
})();
