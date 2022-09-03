const Polynomial = 3988292384;

function calcCRC32(t, n) {
    let o;
    n = ~n;
    for (let e = 0; e < t.byteLength; e++) {
        for (n ^= t[e], o = 0; o < 8; o++) {
            n = 1 & n ? n >>> 1 ^ 3988292384 : n >>> 1
        }
    }
    return ~n >>> 0
}

const SysExHeadaer = [240, 0, 72, 4, 0, 0, 4];
const SysExMsgAssetData = 96;
const AssetCmdStart = 1;
const AssetCmdData = 2;
const AssetCmdEnd = 3;

function convert87(e, t) {
    dst = [];
    dst[0] = 0;
    for (let s = 0; s < t; s++) {
        dst[0] |= (128 & e[s]) >> s + 1;
        dst[s + 1] = 127 & e[s];
    }
    return dst
}

function createSysExMessage(e, t, s, n) {
    let r = SysExHeadaer;
    r = r.concat([e, t]);
    let a = 0;
    let c = n;
    for (; c > 0;) {
        r = r.concat(convert87(s.slice(7 * a), c > 7 ? 7 : c));
        c -= 7;
        a++;
    }

    r.push(247);
    return new Uint8Array(r)
}

function createStartMessage(e, t) {
    const s = new ArrayBuffer(8);
    const n = new DataView(s);
    n.setUint32(0, e, !0);
    n.setUint32(4, t, !0);
    return createSysExMessage(96, 1, new Uint8Array(n.buffer), n.byteLength);
}

function createDataMessage(e, t) {
    return createSysExMessage(96, 2, e, t)
}

function createEndMessage(e) {
    const t = new ArrayBuffer(4);
    const s = new DataView(t);
    s.setUint32(0, e, !0);
    return createSysExMessage(96, 3, new Uint8Array(s.buffer), s.byteLength)
};


const logTablePositive = [0, .029510598, .057142886, .083121729, .107633878, .130836133, .152861418, .173823398, .193820026, .212936316, .231246524, .248815888, .265702033, .281956115, .297623747, .312745779, .327358934, .34149635, .355188028, .368461219, .381340747, .393849293, .40600763, .417834837, .429348473, .440564736, .451498601, .46216394, .472573627, .482739632, .492673102, .50238444, .511883361, .52117896, .53027976, .539193757, .547928465, .556490956, .564887888, .573125544, .581209852, .589146419, .596940547, .604597259, .612121317, .619517239, .626789317, .633941629, .640978057, .647902297, .654717869, .661428132, .66803629, .674545405, .680958401, .687278077, .693507109, .69964806, .705703387, .711675445, .717566493, .723378699, .729114146, .734774835, .740362689, .74587956, .751327228, .756707407, .76202175, .767271848, .772459236, .777585394, .782651752, .787659687, .792610533, .797505576, .80234606, .807133187, .811868123, .816551991, .821185883, .825770852, .830307922, .834798083, .839242295, .843641489, .847996568, .852308407, .856577858, .860805744, .864992869, .869140009, .873247923, .877317344, .881348987, .885343548, .889301703, .893224108, .897111404, .900964214, .904783145, .908568787, .912321715, .91604249, .919731658, .923389752, .927017291, .930614781, .934182716, .937721577, .941231834, .944713946, .948168362, .951595517, .954995839, .958369745, .961717642, .965039928, .968336992, .971609213, .974856965, .978080609, .981280501, .984456988, .987610411, .990741101, .993849385, 1];
const logInvTablePositive = [0, .002016858, .004070325, .006161067, .008289759, .01045709, .012663762, .014910489, .017197998, .01952703, .021898337, .024312687, .026770862, .029273658, .031821883, .034416363, .037057937, .03974746, .042485803, .045273851, .048112508, .051002691, .053945335, .056941394, .059991836, .063097649, .066259838, .069479426, .072757456, .076094987, .0794931, .082952894, .08647549, .090062027, .093713666, .097431588, .101216997, .105071118, .108995198, .112990506, .117058336, .121200005, .125416851, .129710241, .134081563, .138532232, .143063689, .147677399, .152374856, .15715758, .162027119, .166985048, .172032972, .177172525, .182405369, .187733198, .193157737, .198680741, .204303996, .210029323, .215858575, .221793638, .227836432, .233988914, .240253073, .246630938, .253124572, .259736077, .266467592, .273321296, .280299406, .28740418, .294637919, .302002963, .309501694, .317136541, .324909973, .332824507, .340882702, .349087168, .357440559, .365945579, .374604979, .383421562, .392398182, .401537743, .410843202, .420317571, .429963917, .43978536, .44978508, .459966311, .47033235, .48088655, .491632326, .502573157, .513712584, .525054209, .536601705, .548358808, .560329322, .572517122, .584926152, .597560427, .610424035, .62352114, .63685598, .650432871, .664256205, .678330457, .692660181, .707250014, .722104677, .737228978, .752627811, .76830616, .784269098, .80052179, .817069497, .833917573, .85107147, .868536741, .886319036, .904424111, .922857823, .94162614, .960735133, 1];
const getTableIndex = function(e) {
    let a = Math.fround(e / 32768);
    a = Math.abs(a)
    return parseInt(127 * a + .5, 10)
};
const getInvTableIndex = function(e) {
    return Math.abs(e)
};
const encodeValue = function(e) {
    return tableValue = logTablePositive[getTableIndex(e)], parseInt(Math.fround(127 * tableValue * (e < 0 ? -1 : 1)), 10)
};
const decodeValue = function(e) {
    return tableValue = logInvTablePositive[getInvTableIndex(e)], parseInt(Math.fround(32767 * tableValue * (e < 0 ? -1 : 1)), 10)
};

var logCompressBuffer = function(e, a, t) {
    for (let n = 0; n < t; n++) {
        l = a[n];
        tableValue = logTablePositive[getTableIndex(l)];
        e[n] = parseInt(Math.fround(127 * tableValue * (l < 0 ? -1 : 1)), 10);
    }
    var l;
};
var logDecompressBuffer = function(e, a, t) {
    for (let n = 0; n < t; n++) e[n] = (l = a[n], tableValue = logInvTablePositive[getInvTableIndex(l)], parseInt(Math.fround(32767 * tableValue * (l < 0 ? -1 : 1)), 10));
    var l;
};


function BBSoundData(t, e) {
    this.name = t;
    this.data = e;
}
BBSoundData.prototype.setBytes = function(t) {
    this.name = "";
    for (let e = 0; e < 8; e++) {
        0 != t[e] && (this.name += String.fromCharCode(t[e]));
    }
    this.data = new Int8Array(t.slice(8))
}
BBSoundData.prototype.toBytes = function() {
    let t = new Uint8Array(8 + this.data.length);
    let e = new DataView(t.buffer);
    let n = 0;
    for (let t = 0; t < this.name.length; t++) {
        e.setInt8(t, this.name.charCodeAt(t));
        n++;
    }
    for (let t = this.name.length; t < 8; t++) {
        e.setInt8(t, 0);
        n++;
    }
    for (let t = 0; t < this.data.length; t++) {
        e.setInt8(n, this.data[t]);
        n++;
    }
    return t
};


function WavData() {
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
    s.setUint32(28, 4 * e, !0);
    s.setUint16(32, this.blockSize, !0);
    s.setUint16(34, this.bitRate, !0);
    h(s, 36, this.data);
    s.setUint32(40, 4 * t.length, !0);
    (function (t, e, i) {
        for (let s = 0; s < i.length; s++, e += 4) t.setFloat32(e, i[s], !0)
    })(s, 44, t);
    return new Blob([s], {
        type: "audio/wav"
    });
};




const wavName = document.getElementById("name");
const downBtn = document.getElementById("downBtn");
const dropFrame = document.getElementById("droppable");
const audioCompressedBuffer = new Int8Array(65536);

if (downBtn.disabled = !0, window.File && window.FileReader && window.FileList && window.Blob) {
    function handleDragOver(e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    }

    function handleFileSelect(e) {
        e.stopPropagation();
        e.preventDefault();
        const t = new Int16Array(65536);
        document.getElementById("output").innerHTML = "", downBtn.disabled = !0;
        const a = e.dataTransfer.files[0];
        if (!/^audio\/.*wav/.test(a.type)) return void alert("Please select a wav file");
        const n = new FileReader;
        n.onload = function() {
            const e = 2048;
            const r = 128;
            let o = new DataView(n.result);
            let d = new WavData;
            if (d.setBytes(o), "RIFF" != d.riffHeader || "WAVE" != d.waveHeader || d.bitRate < 8) return void alert("Please select a wav file");

            const s = Math.min(parseInt(d.samples.length / e, 10), 256);
            const l = new ArrayBuffer(256);

            for (let t = 0; t < 256; t++) {
                l[t] = t < s ? d.samples.slice(t * e, t * e + e) : new Float32Array(e);
            }

            const i = Math.fround((s - 1) / 127);

            for (let e = 0; e < r; e++) {
                const a = Math.fround(i * e);
                const n = 127 == e ? s - 2 : parseInt(a, 10);
                const r = 127 == e ? 0 : 1 - (a - n);
                for (let a = 0; a < 512; a++) {
                    const o = 4 * a;
                    const d = Math.fround(l[n][o] * r) + Math.fround(l[n + 1][o] * (1 - r));
                    t[512 * e + a] = parseInt(Math.fround(32767 * d), 10)
                }
            }
            logCompressBuffer(audioCompressedBuffer, t, 65536);
            document.getElementById("output").innerHTML = a.name;
            downBtn.disabled = !1;
        };
        n.readAsArrayBuffer(a);
    }

    dropFrame.addEventListener("dragover", handleDragOver, !1);
    dropFrame.addEventListener("drop", handleFileSelect, !1)
} else alert("Please use a browser that supports File API");

downBtn.onclick = function() {
    let e = [],
        t = new Uint8Array,
        a = "";
    const n = 7 * parseInt(30.75, 10);
    // n = 210
    if (0 == wavName.value.length || wavName.value.length > 7) return void alert("Please enter the Wave name in 1 to 7 characters");
    if (!/^[a-zA-Z0-9 ]{1}\.?[a-zA-Z0-9 ]{1}\.?[a-zA-Z0-9 ]{1}\.?[a-zA-Z0-9 ]{1}$/.test(wavName.value)) return void alert("Please enter the Wave name in the format X.X.X.X");
    a = wavName.value.toUpperCase();
    const r = new BBSoundData(a, audioCompressedBuffer).toBytes();
    t = createStartMessage(7, r.byteLength);
    e = e.concat(Array.from(t));
    const o = r.byteLength;
    let d = 0;
    for (; d < o;) {
        sizeToSend = o - d > n ? n : o - d;
        let a = r.slice(d, d + sizeToSend);
        t = createDataMessage(a, a.byteLength);
        e = e.concat(Array.from(t));
        d += sizeToSend;
    }
    let s = calcCRC32(r, 0);
    t = createEndMessage(s);
    e = e.concat(Array.from(t));
    const l = document.createElement("a");
    let i = new Blob([new Uint8Array(e)], {
            type: "application/octet-stream"
        }),
        c = window.URL || window.webkitURL;
    l.href = c.createObjectURL(i);
    l.download = `${a}.syx`;
    l.click();
};