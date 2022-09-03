export function WavData() {
    this.riffHeader = "RIFF";
    this.waveHeader = "WAVE";
    this.fmt = "fmt ";
    this.fmtChunkSize = 16;
    this.fmtID = 3;
    this.channelNum = 1;
    this.blockSize = 4;
    this.bitRate = 32;
    this.exOffset = 0;
    this.data = "data";
}

WavData.prototype.setBytes = function(t) {
    const e = new DataView(t.buffer),
        i = (t, e, i) => {
            let s = "";
            for (let h = 0; h < i; h++) s += String.fromCharCode(t.getUint8(e + h));
            return s
        },
        s = (t, e, i, s) => {
            let h = [];
            const n = (t, e) => {
                let i = t.getUint8(e);
                return 128 == i ? i = 0 : 129 >= i ? i -= 128 : i = -(128 - i), Math.fround(i / 128)
            };
            for (let a = 0; a < i; a++)(1 == s || a % 2 == 0) && h.push(n(t, e + a));
            return h
        },
        h = (t, e, i, s) => {
            let h = [];
            const n = (t, e) => {
                let i = t.getInt16(e, !0);
                return Math.fround(i / 32768)
            };
            for (let a = 0; a < i / 2; a++)(1 == s || a % 2 == 0) && h.push(n(t, e + 2 * a));
            return h
        },
        n = (t, e, i, s) => {
            let h = [];
            const n = (t, e) => {
                let i = new Uint8Array(t.buffer.slice(e, e + 3)),
                    s = i[0] | i[1] << 8 | i[2] << 16;
                return s = 8388608 <= s ? -(16777216 - s) : s, Math.fround(s / 8388608)
            };
            for (let a = 0; a < i / 3; a++)(1 == s || a % 2 == 0) && h.push(n(t, e + 3 * a));
            return h
        },
        a = (t, e, i, s) => {
            let h = [];
            const n = (t, e) => {
                let i = t.getInt32(e, !0);
                return Math.fround(i / 2147483648)
            };
            for (let a = 0; a < i / 4; a++)(1 == s || a % 2 == 0) && h.push(n(t, e + 4 * a));
            return h
        },
        r = (t, e, i, s) => {
            let h = [];
            for (let n = 0; n < i / 4; n++)(1 == s || n % 2 == 0) && h.push(t.getFloat32(e + 4 * n, !0));
            return h
        };
    this.riffHeader = i(e, 0, 4), this.fileSize = e.getUint32(4, !0);
    let l = this.fileSize + 8;
    this.waveHeader = i(e, 8, 4);
    let f = 12;
    for (; f < l;) {
        let t = i(e, f, 4),
            l = e.getUint32(4 + f, !0);
        f += 8, "fmt " == t ? (this.fmt = t, this.fmtChunkSize = l, this.fmtID = e.getUint16(f, !0), this.channelNum = e.getUint16(2 + f, !0), this.sampleRate = e.getUint32(4 + f, !0), this.dataSpeed = e.getUint32(8 + f, !0), this.blockSize = e.getUint16(12 + f, !0), this.bitRate = e.getUint16(14 + f, !0), f += 16, this.exOffset = 0, this.fmtChunkSize > 16 && (this.exOffset = this.fmtChunkSize - 16, f += this.exOffset)) : "data" == t ? (this.data = t, this.dataChunkSize = l, 8 == this.bitRate ? this.samples = s(e, f, this.dataChunkSize, this.channelNum) : 16 == this.bitRate ? this.samples = h(e, f, this.dataChunkSize, this.channelNum) : 24 == this.bitRate ? this.samples = n(e, f, this.dataChunkSize, this.channelNum) : 32 == this.bitRate ? 3 == this.fmtID ? this.samples = r(e, f, this.dataChunkSize, this.channelNum) : this.samples = a(e, f, this.dataChunkSize, this.channelNum) : this.samples = [], f += this.dataChunkSize) : f = f + l + (1 & l)
    }
};

WavData.prototype.toTable = function() {
    const t = ["RIFF", "FileSize", "WAVE", "fmt", "fmtChunkSize", "fmtID", "ChannelNumber", "SampleRate", "DataSpeed", "BlockSize", "BitRate", "ExtendedSize", "data", "DataChunkSize", "Samples"];
    const e = [this.riffHeader, this.fileSize, this.waveHeader, this.fmt, this.fmtChunkSize, this.fmtID, this.channelNum, this.sampleRate, this.dataSpeed, this.blockSize, this.bitRate, this.exOffset, this.data, this.dataChunkSize, this.samples.slice(0, 3)];
    const s = document.createElement("table");
    const h = document.createElement("tbody");
    for (i = 0; i < t.length; i++) {
        const s = document.createElement("tr");
        for (j = 0; j < 2; j++) {
            const h = document.createElement("td");
            h.innerHTML = 0 == j ? t[i] : e[i], s.appendChild(h)
        }
        h.appendChild(s)
    }
    return s.appendChild(h), s.border = 1, s
};

WavData.prototype.exportWAV = function(t, e) {
    let i = new ArrayBuffer(44 + 4 * t.length);
    let s = new DataView(i);
    let h = function(t, e, i) {
        for (let s = 0; s < i.length; s++) t.setUint8(e + s, i.charCodeAt(s))
    };
    h(s, 0, this.riffHeader);
    s.setUint32(4, 32 + 4 * t.length, !0);
    h(s, 8, this.waveHeader);
    h(s, 12, this.fmt);
    s.setUint32(16, this.fmtChunkSize, !0);
    s.setUint16(20, this.fmtID, !0);
    s.setUint16(22, this.channelNum, !0);
    s.setUint32(24, e, !0);
    s.setUint32(28, this.blockSize * e, !0);
    s.setUint16(32, this.blockSize, !0);
    s.setUint16(34, this.bitRate, !0);
    h(s, 36, this.data);
    s.setUint32(40, 4 * t.length, !0);
    (function (t, e, i) {
        for (let s = 0; s < i.length; s++, e += 4) {
            console.log(i[s]);
            t.setFloat32(e, i[s], !0);
        }
    })(s, 44, t);
    return s;
    //return new Blob([s], {
    //    type: "audio/wav"
    //});
};