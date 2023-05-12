import * as vscode from "vscode";
import { StatementActions } from "./lexiconModules/statementActions";
import { StatementAllow } from "./lexiconModules/statementAllow";
import { LexiconLocator } from "./lexiconModules/types";

export const sortSuggestions = (
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

export const findPreviousResource = (
  document: vscode.TextDocument,
  position: vscode.Position
): string => {
  let previousResource = "";

  for (let i = position.line - 1; i >= 0; i--) {
    const currentLine = document.lineAt(i).text;
    const match = currentLine.match(/"([^:]+):/); // last prev line
    if (match) {
      previousResource = match[1];
      break;
    }
  }

  return previousResource;
};

export function activate(context: vscode.ExtensionContext) {
  const extensionContext = context;
  let locators: Array<
    new (
      document: vscode.TextDocument,
      position: vscode.Position,
      context: vscode.ExtensionContext
    ) => LexiconLocator
  > = [StatementActions, StatementAllow];

  let disposable = vscode.languages.registerCompletionItemProvider(
    { pattern: "**/*.tf" },
    {
      provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
      ): vscode.ProviderResult<vscode.CompletionItem[]> {
        // get line text

        for (let action of locators) {
          const uow = new action(document, position, extensionContext);
          if (uow.find()) {
            return uow.execute();
          }
        }
      },
    },
    "\n" // want this to trigger on newline (providing we're in the array)
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
