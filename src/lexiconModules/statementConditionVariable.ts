import { LexiconLocator } from "./types";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { conditionsInOrder, formatLine, stringUtil } from "./lib";

export class StatementConditionVariable implements LexiconLocator {
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
    const lineArr = formatLine(this._document.lineAt(this._position.line).text);
    if (conditionsInOrder(["variable", "="], lineArr)) {
      for (let i = this._position.line; i >= 0; i--) {
        let innerLineArr = formatLine(this._document.lineAt(i).text);
        if (conditionsInOrder(["condition", "{"], innerLineArr)) {
          return true;
        }
      }
    }
    return false;
  }
  execute(): any {
    const line = this._document.lineAt(this._position.line).text;
    const validChar = stringUtil.hasQuoteEnd(stringUtil.getLastChar(line));

    const suggestionsContent = fs.readFileSync(
      path.join(
        this._context.extensionPath,
        "src/suggestions",
        "variables.json"
      ),
      "utf8"
    );
    const suggestions: string[] = JSON.parse(suggestionsContent).suggestions;

    return suggestions.map((suggestion, index) => {
      if (validChar) {
        return new vscode.CompletionItem(
          suggestion,
          vscode.CompletionItemKind.Value
        );
      } else {
        return new vscode.CompletionItem(
          `"${suggestion}"`,
          vscode.CompletionItemKind.Value
        );
      }
    });
  }
}
