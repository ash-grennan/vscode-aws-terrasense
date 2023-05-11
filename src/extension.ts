import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export const sortSuggestions = (suggestions: string[], previous: string): string[] => {
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
}

export const findPreviousResource = (document: vscode.TextDocument, position: vscode.Position): string => {
  let previousResource = '';

  for (let i = position.line - 1; i >= 0; i--) {
    const currentLine = document.lineAt(i).text;
    const match = currentLine.match(/"([^:]+):/); // last prev line
    if (match) {
      previousResource = match[1];
      break;
    }
  }

  return previousResource;
}

export const isWithinActionsArray = (document: vscode.TextDocument, position: vscode.Position): boolean => {
  let withinActionsArray = false;

  for (let i = position.line - 1; i >= 0; i--) {
    const currentLine = document.lineAt(i).text;

    if (currentLine.match(/actions\s*=\s*\[/)) {
      withinActionsArray = true;
      break;
    }

    if (currentLine.match(/\]/)) {
      break;
    }
  }

  return withinActionsArray;
}

export function activate(context: vscode.ExtensionContext) {
  const suggestionsContent = fs.readFileSync(path.join(context.extensionPath, 'src/suggestions', 'actions.json'), 'utf8');
  const suggestions: string[] = JSON.parse(suggestionsContent).suggestions;

  let disposable = vscode.languages.registerCompletionItemProvider(
    { pattern: '**/*.tf' },
    {
      provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
      ): vscode.ProviderResult<vscode.CompletionItem[]> {
        if (!isWithinActionsArray(document, position)) {
          return undefined;
        }

        const previousResource = findPreviousResource(document, position);
        const sortedSuggestions = sortSuggestions(suggestions, previousResource);

        return sortedSuggestions.map((suggestion, index) => {
          const item = new vscode.CompletionItem(`"${suggestion}"`, vscode.CompletionItemKind.Value);
          item.sortText = index.toString().padStart(5, '0');
          return item;
        });
      },
    },
    '\n' // want this to trigger on newline (providing we're in the array)
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
