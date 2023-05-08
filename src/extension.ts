import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
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
          const suggestions = [
            's3:GetObject',
            's3:PutObject',
            's3:ListBucket',
            'ec2:DescribeInstances',
            'ec2:StartInstances',
          ];

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
