/*
 *  This is a module to join WAV files
 */

function concat(a, b) {
  // requires a and b to have the same audio format, #channels,
  // sample rate, byterate, block align, bit depth
  let ahead = a.slice(0, 12);
  let asub1 = a.slice(12, 36);
  let asub2 = a.slice(36, 44);
  let adata = a.slice(44);
  let bhead = b.slice(0, 12);
  let bsub1 = b.slice(12, 36);
  let bsub2 = b.slice(36, 44);
  let bdata = b.slice(44);

  // check for identical subchunk1
  if (!deepEqual(asub1, bsub1)) {
    console.error('Non-compatible files');
    return;
  }

  // construct pieces of the new file
  let chead = [ 82, 73, 70, 70, ...numToBytes(36 + adata.length + bdata.length, 4), 87, 65, 86, 69];
  let csub1 = bsub1;
  let csub2 = [100, 97, 116, 97, ...numToBytes(adata.length + bdata.length, 4)];
  let cdata = [...adata, ...bdata];

  return Buffer.from([...chead, ...csub1, ...csub2, ...cdata]);
}

function bytesToNum(bytesarray) {
  let num = 0;
  bytesarray.forEach((byte, i) => num += byte*Math.pow(256, i));
  return num;
}

function numToBytes(num, len) {
  let result = [];
  for (let i = len-1; i >= 0; i--) {
    let digit = Math.floor(num / Math.pow(256, i));
    result.push(digit);
    num -= digit*Math.pow(256, i);
  }
  return result[0] < 256 ? result.reverse() : NaN;
}

function deepEqual(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return a.length === b.length;
}

function rawData(wavBuffer) {
  return Buffer.from(wavBuffer.slice(44));
}

module.exports = {
  concat: concat,
  rawData: rawData
};
