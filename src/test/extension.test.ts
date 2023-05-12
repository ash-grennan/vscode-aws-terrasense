import type { TextDocument, Position } from 'vscode';
import { sortSuggestions } from '../extension';
import { isWithinActionsArray } from '../locators';

jest.mock('vscode', () => ({
  TextDocument: class {
    lineAt() {
      return {
        text: '',
      };
    }
  },
  Position: class {
    constructor(public line: number) {}
  },
}));

describe('intellisense suggestions for actions', () => {
  const createDocumentMock = (lines: string[]): TextDocument => {
    const document = new (jest.requireMock('vscode').TextDocument)();
    document.lineAt = (line: number) => ({ text: lines[line] });
    return document;
  };

  it('should return true if within actions array', () => {
    const lines = [
      'First line',
      'actions = [',
      '  action1,',
      '  action2',
    ];
    const document = createDocumentMock(lines);
    const position = new (jest.requireMock('vscode').Position)(3);

    const result = isWithinActionsArray(document, position);
    expect(result).toBe(true);
  });

  it('should return false if not within actions array', () => {
    const lines = [
      'First line',
      'actions = [',
      '  action1,',
      '  action2',
      ']',
      'Another line',
    ];
    const document = createDocumentMock(lines);
    const position = new (jest.requireMock('vscode').Position)(5);

    const result = isWithinActionsArray(document, position);
    expect(result).toBe(false);
  });

  it('should sort suggestions based on previous resource ', () => {
    const suggestions = [
      "dynamodb:DeleteTable",
      "s3:GetObject",
      "s3:PutObject",
    ];
    const previous = 's3:GetObject';
    const sortedSuggestions = sortSuggestions(suggestions, previous);

    expect(sortedSuggestions).toEqual([
      's3:GetObject',
      'dynamodb:DeleteTable',
      's3:PutObject'
    ]);
  });

 

  
});
