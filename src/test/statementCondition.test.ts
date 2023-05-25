import { StatementConditionTest } from "../lexiconModules/statementConditionTest";
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

jest.mock("vscode", () => ({
  Position: class {
    line: number;
    character: number;
    constructor(line: any, character: any) {
      this.line = line;
      this.character = character;
    }
  },
  TextDocument: jest.fn(),
  ExtensionContext: jest.fn(),
  CompletionItem: jest.fn().mockImplementation((label) => {
    return {
      label: label,
    };
  }),
  CompletionItemKind: { Value: "Value" },
}));

jest.mock("fs", () => ({
  readFileSync: jest.fn(),
}));

jest.mock("path", () => ({
  join: jest.fn(),
}));

describe("StatementConditionTest", () => {
  let document: vscode.TextDocument;
  let position: vscode.Position;
  let context: vscode.ExtensionContext;

  beforeEach(() => {
    document = new (jest.requireMock("vscode").TextDocument)();
    position = new (jest.requireMock("vscode").Position)();
    context = new (jest.requireMock("vscode").ExtensionContext)();
  });

  describe("find", () => {
    it("returns true when conditions are met", () => {
      const position = new vscode.Position(1, 0);
      document.lineAt = jest.fn().mockReturnValue({ text: "test =" });
      document.lineAt = jest.fn().mockImplementation((lineNumber) => {
        if (lineNumber === position.line) {
          return { text: "test =" };
        } else {
          return { text: "condition {" };
        }
      });

      const locator = new StatementConditionTest(document, position, context);
      expect(locator.find()).toBe(true);
    });

    it("returns false when conditions are not met", () => {
      const position = new vscode.Position(1, 0);
      document.lineAt = jest.fn().mockReturnValue({ text: "test =" });
      document.lineAt = jest.fn().mockImplementation((lineNumber) => {
        if (lineNumber === position.line) {
          return { text: "test =" };
        } else {
          return { text: "different wrapper {" };
        }
      });
      const locator = new StatementConditionTest(document, position, context);
      expect(locator.find()).toBe(false);
    });
  });

  describe("execute", () => {
    it("returns correct suggestions", () => {
      document.lineAt = jest.fn().mockReturnValue({ text: "test =" });
      const locator = new StatementConditionTest(document, position, context);

      (fs.readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify({ suggestions: ["mockSuggestion1", "mockSuggestion2"] })
      );
      (path.join as jest.Mock).mockReturnValue("mocked_path");
      const result = locator.execute();

      expect(result).toHaveLength(2);
      expect(result[0].label).toBe('"mockSuggestion1"');
      expect(result[1].label).toBe('"mockSuggestion2"');
    });
  });
});
