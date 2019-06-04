
const regex = /(?:([a-z0-9][A-Z]))/g;

export function varNameToCSSName(varName: string): string {
  const matches: string[] = [];
  let currMatch = regex.exec(varName);
  while (currMatch) {
    matches.push(currMatch[1]);
    currMatch = regex.exec(varName);
  }
  if (matches) {
    return matches.reduce((prev: string, m: string) => prev.replace(m, `${m[0]}-${m[1].toLowerCase()}`), varName);
  }
  return varName;
}
