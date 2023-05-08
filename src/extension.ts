import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  const suggestionsPath = path.join(context.extensionPath, 'suggestions.json');
  const suggestionsContent = fs.readFileSync(suggestionsPath, 'utf8');
  const suggestionsData = JSON.parse(suggestionsContent);
  const suggestions: string[] = suggestionsData.suggestions;

  let disposable = vscode.languages.registerCompletionItemProvider(
    { pattern: '**/*.tf' },
    {
      provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
      ): vscode.ProviderResult<vscode.CompletionItem[]> {
        const lineNumber = position.line;
        let withinActionsArray = false;

        for (let i = lineNumber; i >= 0; i--) {
          const currentLine = document.lineAt(i).text;

          if (currentLine.match(/actions\s*=\s*\[/)) {
            withinActionsArray = true;
            break;
          }

          if (currentLine.match(/\]/)) {
            break;
          }
        }

        if (withinActionsArray) {
          return suggestions.map(
            (suggestion) =>
              new vscode.CompletionItem(`"${suggestion}"`, vscode.CompletionItemKind.Value)
          );
        }

        return undefined;
      },
    },
    '\n' // Trigger the completion when a newline is added
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
