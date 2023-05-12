import type { TextDocument, Position } from "vscode";

jest.mock("vscode", () => ({
  TextDocument: class {
    lineAt() {
      return {
        text: "",
      };
    }
  },
  Position: class {
    constructor(public line: number) {}
  },
}));

describe("intellisense suggestions for actions", () => {
  const createDocumentMock = (lines: string[]): TextDocument => {
    const document = new (jest.requireMock("vscode").TextDocument)();
    document.lineAt = (line: number) => ({ text: lines[line] });
    return document;
  };
});
