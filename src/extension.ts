import * as vscode from "vscode";
import { StatementActions } from "./lexiconModules/statementActions";
import { StatementAllow } from "./lexiconModules/statementAllow";
import { LexiconLocator } from "./lexiconModules/types";

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
    "\n" // want this to trigger on newline
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
