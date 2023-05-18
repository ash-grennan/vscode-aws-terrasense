import {
  formatLine,
  conditionsInOrder,
  stringUtil,
} from "../lexiconModules/lib";

describe("formatLine", () => {
  it("should split the string into an array", () => {
    const line = "Apple banana";
    expect(formatLine(line)).toEqual(["Apple", "banana"]);
  });

  it("should remove empty spaces", () => {
    const line = "Apple     banana";
    expect(formatLine(line)).toEqual(["Apple", "banana"]);
  });

  it("should remove double quote and single quote only strings", () => {
    const line = 'Apple "" banana';
    expect(formatLine(line)).toEqual(["Apple", "banana"]);
  });

  it("should remove double quote even if there's no space", () => {
    const line = 'Apple =""';
    const result = formatLine(line);
    expect(formatLine(line)).toEqual(["Apple", "="]);
  });
});

describe("conditionsInOrder", () => {
  it("should return false when length of tokens and doc is not equal", () => {
    const tokens = ["Apple", "banana"];
    const doc = ["Apple", "delicious", "banana"];
    expect(conditionsInOrder(tokens, doc)).toBe(false);
  });

  it("should return false when token order does not match doc order", () => {
    const tokens = ["banana", "apple"];
    const doc = ["apple", "banana"];
    expect(conditionsInOrder(tokens, doc)).toBe(false);
  });

  it("should return true when tokens and doc are identical", () => {
    const tokens = ["Apple", "banana"];
    const doc = ["Apple", "banana"];
    expect(conditionsInOrder(tokens, doc)).toBe(true);
  });
});

describe("stringUtil", () => {
  describe("getLastChar", () => {
    it("should return the last character of a string", () => {
      const str = "Hello";
      const result = stringUtil.getLastChar(str);
      expect(result).toBe("o");
    });

    it("should return an empty string if no characters are present", () => {
      const str = "";
      const result = stringUtil.getLastChar(str);
      expect(result).toBe("");
    });
  });

  describe("hasQuoteEnd", () => {
    it("should return true if string is a single or double quote", () => {
      expect(stringUtil.hasQuoteEnd('"')).toBe(true);
      expect(stringUtil.hasQuoteEnd("'")).toBe(true);
    });

    it("should return false if string is not a single or double quote", () => {
      expect(stringUtil.hasQuoteEnd("Hello")).toBe(false);
      expect(stringUtil.hasQuoteEnd("")).toBe(false);
      expect(stringUtil.hasQuoteEnd("1")).toBe(false);
    });
  });
});
