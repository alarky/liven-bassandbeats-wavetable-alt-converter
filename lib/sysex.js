const SysExHeadaer = [240, 0, 72, 4, 0, 0, 4];
const SysExMsgAssetData = 96;
const AssetCmdStart = 1;
const AssetCmdData = 2;
const AssetCmdEnd = 3;

function convert87(e, t) {
    let dst = [];
    dst[0] = 0;
    // s: 0..7
    // dst0: sign flg
    for (let s = 0; s < t; s++) {
        dst[0] |= (128 & e[s]) >> s + 1;
        dst[s + 1] = 127 & e[s];
    }
    return dst
}

function deConvert87(e, t) {
    let dst = [];
    for (let s = 0; s < t; s++) {
        let n = e[s+1];
        if (e[0] >> [t-s-1] & 1) {
            n += 128;
        }
        dst.push(n);
    }
    return dst
}

function createSysExMessage(e, t, s, n) {
    // let r = SysExHeadaer;
    // r = r.concat([e, t]);
    let r = [];
    let a = 0;
    let c = n;
    //console.log("create SysExMessage");
    for (; c > 0;) {
        let sa = s.slice(7 * a);
        let sac = convert87(sa, c > 7 ? 7 : c);
        if (sac[0] != 0) {
            console.log("sac0", sa, sac);
        }
        r = r.concat(convert87(s.slice(7 * a), c > 7 ? 7 : c));
        //console.log(a, c, s.slice(7 * a), convert87(s.slice(7 * a), c > 7 ? 7 : c))
        c -= 7;
        a++;
    }
    //throw "";

    r.push(247);
    return new Uint8Array(r)
}

export function createStartMessage(e, t) {
    const s = new ArrayBuffer(8);
    const n = new DataView(s);
    n.setUint32(0, e, !0);
    n.setUint32(4, t, !0);
    return createSysExMessage(96, 1, new Uint8Array(n.buffer), n.byteLength);
}

export function createDataMessage(e, t) {
    return createSysExMessage(96, 2, e, t)
}

export function createEndMessage(e) {
    const t = new ArrayBuffer(4);
    const s = new DataView(t);
    s.setUint32(0, e, !0);
    return createSysExMessage(96, 3, new Uint8Array(s.buffer), s.byteLength)
}
