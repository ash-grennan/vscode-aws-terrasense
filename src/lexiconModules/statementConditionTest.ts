import { LexiconLocator } from "./types";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

export class StatementConditionTest implements LexiconLocator {
  private _document: vscode.TextDocument;
  private _position: vscode.Position;
  private _context: vscode.ExtensionContext;

  constructor(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: vscode.ExtensionContext
  ) {
    this._document = document;
    this._position = position;
    this._context = context;
  }

  find(): boolean {
    const lineText = this._document.lineAt(this._position.line).text;
    if (
      lineText.includes("test") &&
      lineText.substring(0, this._position.character).trim().endsWith("=")
    ) {
      for (let i = this._position.line; i >= 0; i--) {
        let line = this._document.lineAt(i).text;
        if (line.includes("{") && line.includes("condition")) {
          return true;
        }
      }
    }
    return false;
  }
  execute(): any {
    const suggestionsContent = fs.readFileSync(
      path.join(this._context.extensionPath, "src/suggestions", "tests.json"),
      "utf8"
    );
    const suggestions: string[] = JSON.parse(suggestionsContent).suggestions;

    return suggestions.map((suggestion, index) => {
      return new vscode.CompletionItem(
        `"${suggestion}"`,
        vscode.CompletionItemKind.Value
      );
    });
  }
}
