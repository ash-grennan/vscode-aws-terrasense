import * as vscode from "vscode";
import { LexiconLocator } from "./types";

export class StatementAllow implements LexiconLocator {
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
      lineText.includes("effect") &&
      lineText.substring(0, this._position.character).trim().endsWith("=")
    ) {
      for (let i = this._position.line; i >= 0; i--) {
        const lineText = this._document.lineAt(i).text.trim();
        if (lineText.startsWith("statement {")) {
          return true;
        } else if (lineText.startsWith("}")) {
          break; // we're out of the current block
        }
      }
    }

    return false;
  }

  execute(): any {
    return [
      new vscode.CompletionItem(`"Allow"`, vscode.CompletionItemKind.Value),
      new vscode.CompletionItem(`"Deny"`, vscode.CompletionItemKind.Value),
    ];
  }
}
