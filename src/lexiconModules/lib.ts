export const formatLine = (line: string): string[] => {
  return line
    .replace('""', "")
    .replace("''", "")
    .split(" ")
    .filter((c) => c.trim() !== "");
};

export const conditionsInOrder = (tokens: string[], doc: string[]): boolean => {
  if (tokens.length !== doc.length) return false;
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] !== doc[i]) return false;
  }
  return true;
};

export const quoteEnd = (line: string): string | null => {
  if (line.endsWith("'")) return "'".charAt(1);
  if (line.endsWith('"')) return '"'.charAt(1);

  return null;
};

export const stringUtil = {
  getLastChar: (str: string): string => {
    return str.charAt(str.length - 1);
  },
  hasQuoteEnd: (str: string): boolean => {
    if (str === '"' || str === "'") return true;
    return false;
  },
};
