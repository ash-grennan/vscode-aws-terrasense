import * as vscode from 'vscode';



export const isAtEffectLine = (document: vscode.TextDocument, position: vscode.Position): boolean => {
    const lineText = document.lineAt(position.line).text;
    if (lineText.substring(0, position.character).trim().endsWith('=')) {
        for (let i = position.line; i >= 0; i--) {
            const lineText = document.lineAt(i).text.trim();
            if (lineText.startsWith('statement {')) {
                return true;
            } else if (lineText.startsWith('}')) {
                break; // we're out of the current block
            }
        }
    }

    return false
}

export const isWithinActionsArray = (document: vscode.TextDocument, position: vscode.Position): boolean => {
    for (let i = position.line - 1; i >= 0; i--) {
      const currentLine = document.lineAt(i).text;
  
      if (currentLine.match(/actions\s*=\s*\[/)) {
        return true;
      }
  
      if (currentLine.match(/\]/)) {
        break;
      }
    }
  
    return false;
  }
