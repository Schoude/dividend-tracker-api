const regExp = /\(([^)]+)\)/;

export function extractSymbolName(stockFullName: string): string {
  console.log({ stockFullName });

  try {
    return regExp.exec(stockFullName)![1]!.trim();
  } catch {
    return '';
  }
}
