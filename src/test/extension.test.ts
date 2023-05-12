import type { TextDocument, Position } from "vscode";
import { sortSuggestions } from "../extension";
import { StatementActions } from "../lexiconModules/statementActions";

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

  it("should sort suggestions based on previous resource ", () => {
    const suggestions = [
      "dynamodb:DeleteTable",
      "s3:GetObject",
      "s3:PutObject",
    ];
    const previous = "s3:GetObject";
    const sortedSuggestions = sortSuggestions(suggestions, previous);

    expect(sortedSuggestions).toEqual([
      "s3:GetObject",
      "dynamodb:DeleteTable",
      "s3:PutObject",
    ]);
  });
});
