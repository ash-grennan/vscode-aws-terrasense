import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { LexiconLocator } from "./types";

export class StatementActions implements LexiconLocator {
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
    for (let i = this._position.line - 1; i >= 0; i--) {
      const currentLine = this._document.lineAt(i).text;

      if (currentLine.match(/actions\s*=\s*\[/)) {
        return true;
      }

      if (currentLine.match(/\]/)) {
        break;
      }
    }

    return false;
  }

  execute(): any {
    const suggestionsContent = fs.readFileSync(
      path.join(this._context.extensionPath, "src/suggestions", "actions.json"),
      "utf8"
    );
    const suggestions: string[] = JSON.parse(suggestionsContent).suggestions;
    const previousResource = this.findPreviousResource();
    const sortedSuggestions = this.sortSuggestions(
      suggestions,
      previousResource
    );

    return sortedSuggestions.map((suggestion, index) => {
      const item = new vscode.CompletionItem(
        `"${suggestion}"`,
        vscode.CompletionItemKind.Value
      );
      item.sortText = index.toString().padStart(5, "0");
      return item;
    });
  }

  private sortSuggestions = (
    suggestions: string[],
    previous: string
  ): string[] => {
    return suggestions.sort((a, b) => {
      const aSameResource = a.startsWith(previous);
      const bSameResource = b.startsWith(previous);

      if (aSameResource && !bSameResource) {
        return -1;
      }
      if (!aSameResource && bSameResource) {
        return 1;
      }
      return a.localeCompare(b);
    });
  };

  private findPreviousResource = (): string => {
    let previousResource = "";

    for (let i = this._position.line - 1; i >= 0; i--) {
      const currentLine = this._document.lineAt(i).text;
      const match = currentLine.match(/"([^:]+):/); // last prev line
      if (match) {
        previousResource = match[1];
        break;
      }
    }

    return previousResource;
  };
}
