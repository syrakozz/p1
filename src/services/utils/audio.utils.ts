export function sleep(ms: number | undefined) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function addWavHeader(pcmData: number[]): number[] {
  const pcmHeader: number[] = [];
  const fileSizeMinusRiffAndLengthFields = pcmData.length + 44 - 8;
  //Bytes 0-3: 'RIFF'
  pcmHeader[0] = 0x52;
  pcmHeader[1] = 0x49;
  pcmHeader[2] = 0x46;
  pcmHeader[3] = 0x46;
  //Bytes 4-7: File size = total data length + 36
  pcmHeader[4] = fileSizeMinusRiffAndLengthFields & 0xff;
  pcmHeader[5] = (fileSizeMinusRiffAndLengthFields >> 8) & 0xff;
  pcmHeader[6] = (fileSizeMinusRiffAndLengthFields >> 16) & 0xff;
  pcmHeader[7] = (fileSizeMinusRiffAndLengthFields >> 24) & 0xff;
  //Bytes 8-11: 'RIFF'
  pcmHeader[8] = 0x57;
  pcmHeader[9] = 0x41;
  pcmHeader[10] = 0x56;
  pcmHeader[11] = 0x45;
  //Bytes 12-15: 'fmt '
  pcmHeader[12] = 0x66;
  pcmHeader[13] = 0x6d;
  pcmHeader[14] = 0x74;
  pcmHeader[15] = 0x20;
  //Bytes 16-19: size of "fmt" chunk = 16
  pcmHeader[16] = 0x10;
  pcmHeader[17] = 0x00;
  pcmHeader[18] = 0x00;
  pcmHeader[19] = 0x00;
  //Bytes 20-21: Format type - 1=PCM
  pcmHeader[20] = 0x01;
  pcmHeader[21] = 0x00;
  //Bytes 22-23: # channels - 1 = mono
  pcmHeader[22] = 0x01;
  pcmHeader[23] = 0x00;
  //Bytes 24-27: Sampling rate in little-endian: 16000 = 00003e80
  pcmHeader[24] = 0x80;
  pcmHeader[25] = 0x3e;
  pcmHeader[26] = 0x00;
  pcmHeader[27] = 0x00;
  //Bytes 28-31: byte rate in little endian = (Sample rate * bits per sample * channels) / 8 = 16000 * 16 * 1 / 8 = 32000 = 00007d00
  pcmHeader[28] = 0x00;
  pcmHeader[29] = 0x7d;
  pcmHeader[30] = 0x00;
  pcmHeader[31] = 0x00;
  // Bytes 32-33: block align = 4
  pcmHeader[32] = 0x02;
  pcmHeader[33] = 0x00;
  // Bytes 34-35: bits per sample = 16
  pcmHeader[34] = 0x10;
  pcmHeader[35] = 0x00;
  // Bytes 36-39: "data"
  pcmHeader[36] = 0x64;
  pcmHeader[37] = 0x61;
  pcmHeader[38] = 0x74;
  pcmHeader[39] = 0x61;
  // Bytes 40-43: data section size
  pcmHeader[40] = pcmData.length & 0xff;
  pcmHeader[41] = (pcmData.length >> 8) & 0xff;
  pcmHeader[42] = (pcmData.length >> 16) & 0xff;
  pcmHeader[43] = (pcmData.length >> 24) & 0xff;
  return pcmHeader.concat(pcmData);
}

export function convertBytesToShort(input: number[]) {
  const len = Math.floor(input.length / 2);
  const samples = new Float32Array(len);

  // Convert from little-endian ordering.
  for (let i = 0; i < len; i++) {
    const byteA = input[2 * i];
    const byteB = input[2 * i + 1];
    const x = ((byteB & 0xff) << 8) | (byteA & 0xff);
    samples[i] = ((x & 0xffff) ^ 0x8000) - 0x8000;
  }

  return samples;
}

export function convertShortToBytes(input: Float32Array): number[] {
  const bytes: number[] = new Array(input.length * 2);
  bytes.length = input.length * 2;

  /* Convert to little-endian ordering. */
  for (let i = 0; i < input.length; i++) {
    bytes[i * 2] = input[i] & 0xff;
    bytes[i * 2 + 1] = (input[i] >> 8) & 0xff;
  }

  return bytes;
}
