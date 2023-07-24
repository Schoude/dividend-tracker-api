const regExp = /\(([^)]+)\)/;

export function extractSymbolName(stockFullName: string): string {
  return regExp.exec(stockFullName)![1]!.trim();
}
