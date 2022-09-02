export function BBSoundData(t, e) {
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
