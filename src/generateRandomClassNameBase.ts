
const alpha = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

const alphaLen = alpha.length;
let alphaSeed = (new Date()).getTime();

export default function generateRandomClassNameBase() {
  const now = (alphaSeed++).toString();
  // split into pairs
  let out = '';
  const len = now.length;
  for (let i = 0; i < len; i++) {
    const first = +now[i];
    if (i < len - 2) {
      const second = +now[i + 1];
      const pairNum = Number.parseInt(`${first}${second}`, 10);
      if (pairNum <= alphaLen) out += alpha[pairNum];
      else out += `${alpha[first]}${alpha[second]}`;
      i++;
    } else out += alpha[first];
  }
  return out;
}
