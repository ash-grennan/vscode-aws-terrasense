import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
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
    if (lineText.substring(0, this._position.character).trim().endsWith("=")) {
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
    return "boo"
  }
}
