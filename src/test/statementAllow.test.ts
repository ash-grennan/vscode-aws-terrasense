import * as vscode from "vscode";
import { StatementAllow } from "../lexiconModules/statementAllow";

jest.mock("vscode", () => ({
  Position: class {
    line: number;
    character: number;
    constructor(line: number, character: number) {
      this.line = line;
      this.character = character;
    }
  },
  TextDocument: jest.fn().mockImplementation(() => ({
    lineAt: jest.fn(),
  })),
  ExtensionContext: jest.fn(),
  CompletionItem: jest.fn().mockImplementation((label, kind) => {
    return {
      label: label,
      kind: kind,
    };
  }),
  CompletionItemKind: { Value: "Value" },
}));

describe("Statement Allow", () => {
  let document: vscode.TextDocument;
  let position: vscode.Position;
  let context: vscode.ExtensionContext;

  beforeEach(() => {
    document = new (jest.requireMock("vscode").TextDocument)();
    position = new (jest.requireMock("vscode").Position)(0, 0);
    context = new (jest.requireMock("vscode").ExtensionContext)();
  });

  it("should return true when '=' is found and statement block is valid", () => {
    document.lineAt = jest
      .fn()
      .mockReturnValueOnce({ text: "effect =" })
      .mockReturnValueOnce({ text: "statement {" });
    const position = new vscode.Position(1, 0);
    const statementAllow = new StatementAllow(document, position, context);
    const result = statementAllow.find();

    expect(result).toBe(true);
  });

  it("should return false when '=' is found but statement block is not valid", () => {
    document.lineAt = jest
      .fn()
      .mockReturnValueOnce({ text: "effect =" })
      .mockReturnValueOnce({ text: "}" });
    const position = new vscode.Position(7, 0);
    const statementAllow = new StatementAllow(document, position, context);
    const result = statementAllow.find();

    expect(result).toBe(false);
  });

  it("should return false when '=' is not found", () => {
    document.lineAt = jest.fn().mockReturnValue({ text: "effect " });
    const position = new vscode.Position(7, 0);
    const statementAllow = new StatementAllow(document, position, context);
    const result = statementAllow.find();

    expect(result).toBe(false);
  });

  it("should return 'Allow' and 'Deny' completion items", () => {
    const statementAllow = new StatementAllow(document, position, context);
    const result = statementAllow.execute();

    expect(result).toHaveLength(2);
    expect(result[0].label).toEqual('"Allow"');
    expect(result[1].label).toEqual('"Deny"');
  });
});
