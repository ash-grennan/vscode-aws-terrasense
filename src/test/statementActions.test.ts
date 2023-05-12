import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { StatementActions } from "../lexiconModules/statementActions";

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

describe("StatementActions", () => {
  let document: vscode.TextDocument;
  let position: vscode.Position;
  let context: vscode.ExtensionContext;

  beforeEach(() => {
    document = new (jest.requireMock("vscode").TextDocument)();
    position = new (jest.requireMock("vscode").Position)();
    context = new (jest.requireMock("vscode").ExtensionContext)();
  });

  describe("statement action", () => {
    it("should return true when actions array is found", () => {
      document.lineAt = jest.fn().mockReturnValue({ text: "actions = [" });
      const position = new vscode.Position(1, 0);
      const statementActions = new StatementActions(
        document,
        position,
        context
      );
      const result = statementActions.find();

      expect(result).toBe(true);
    });

    it("should return false when actions array is not found", () => {
      document.lineAt = jest.fn().mockReturnValue({ text: "foo = [" });
      const position = new vscode.Position(1, 0);
      const statementActions = new StatementActions(
        document,
        position,
        context
      );
      const result = statementActions.find();

      expect(result).toBe(false);
    });

    it("should return sorted completion items", () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify({ suggestions: ["a", "b"] })
      );
      (path.join as jest.Mock).mockReturnValue("mocked_path");

      document.lineAt = jest.fn().mockReturnValue({ text: "foo = [" });

      const statementActions = new StatementActions(
        document,
        position,
        context
      );
      const result = statementActions.execute();

      expect(result).toHaveLength(2);
      expect(result[0].label).toEqual('"a"');
      expect(result[1].label).toEqual('"b"');
    });
  });
});
