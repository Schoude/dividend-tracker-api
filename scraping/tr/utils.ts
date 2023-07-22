import {
  assertEquals,
  assertObjectMatch,
  assertThrows,
} from 'std/testing/asserts.ts';

interface Options {
  parse?: boolean;
}

/**
 * Extracts a JSON object or string from a given string.
 *
 * @template T - The type of the extracted JSON object or string.
 * @param {string} str - The input string.
 * @param {Options} [options={ parse: true }] - Optional configuration options.
 * @param {boolean} [options.parse=true] - Indicates whether to parse the extracted JSON string to an object.
 * @throws {Error} - If the given string is not valid JSON or an error occurs during parsing.
 * @returns {T} - The extracted JSON object or string.
 */
export function extractJSONFromString<T>(
  str: string,
  { parse }: Options = { parse: true },
): T {
  const startIndex = str.indexOf('{');
  const endIndex = str.lastIndexOf('}');

  if (startIndex === -1 || endIndex === -1) {
    throw new Error('Given string is not valid JSON.');
  }

  const jsonString = str.substring(startIndex, endIndex + 1);

  try {
    const data = parse ? JSON.parse(jsonString) as T : jsonString as T;
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Extracts the number after 'sub' and before the first '{' in the given string.
 *
 * @param {string} str - The input string containing the number after 'sub'.
 * @returns {number | null} The extracted number if found, or null if no match is found.
 */
export function extractSubId(str: string): number | null {
  const regex = /\d+/;
  const match = str.match(regex);

  if (match && match.length > 0) {
    return parseInt(match[0], 10); // Convert the matched number to an integer and return
  }

  return null; // Return null if no match is found
}

/**
 * Converts a Date object to a formatted string representing the ISO date format for file saving.
 *
 * @param {Date} date - The Date object to be converted.
 * @returns {string} The formatted string representing the ISO date format for file saving.
 * @throws {Error} Throws an error if the provided date object is not valid.
 */
export function getFileSaveISODate(date: Date): string {
  if ('toISOString' in date === false) {
    throw new Error('No valid Date object given.');
  }

  return date
    .toISOString()
    .replace('T', ' ')
    .split('.')[0]
    .replaceAll(':', '-')
    .replaceAll(' ', '-');
}

Deno.test('extractJSONFromString', () => {
  assertThrows(() => extractJSONFromString('This is not JSON'));

  const assertObject = {
    name: 'Mike',
    age: 12,
  };

  assertObjectMatch(
    assertObject,
    extractJSONFromString<typeof assertObject>(
      'remove me 11212{"name": "Mike", "age": 12}',
    ),
  );

  assertEquals(
    '{"name": "Mike", "age": 12}',
    extractJSONFromString<string>(
      'remove me 11212{"name": "Mike", "age": 12}',
      { parse: false },
    ),
  );
});

Deno.test('extractSubId', () => {
  assertEquals(
    2,
    extractSubId(
      '2 A {"type": "instrument", "id": "abc", "jurisdiction": "DE", "token": "my-token"}',
    ),
  );
  assertEquals(
    123,
    extractSubId(
      '123 A {"type": "instrument", "id": "abc", "jurisdiction": "DE", "token": "my-token"}',
    ),
  );
  assertEquals(
    null,
    extractSubId(
      'not-an-id A {"type": "instrument", "id": "abc", "jurisdiction": "DE", "token": "my-token"}',
    ),
  );
});

Deno.test('getFileSaveISODate', () => {
  // @ts-expect-error forces throw
  assertThrows(() => getFileSaveISODate('aadasd'));

  assertEquals(
    // time zone difference..!
    '2023-07-20-00-00-00',
    getFileSaveISODate(new Date('2023-07-20 02:00:00')),
  );
});
