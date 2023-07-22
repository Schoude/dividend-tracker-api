import type { QueryParameter, Row } from 'sqlite';
import { db } from '../index.ts';

export const DATA_TYPE = {
  NULL: 'NULL',
  INTEGER: 'INTEGER',
  REAL: 'REAL',
  TEXT: 'TEXT',
  BLOB: 'BLOB',
  TIMESTAMP: 'TIMESTAMP',
} as const;

type Fields = { [key: string]: keyof typeof DATA_TYPE };
type Values = { [K in keyof Fields]: QueryParameter };
type ModelSchema = typeof Model;

export abstract class Model {
  static table: string;
  static fields: Fields = {};
  static currentResult = {};

  private static fieldsComplete() {
    return [
      'id',
      ...Object.keys(this.fields),
      'created_at',
      'updated_at',
    ];
  }

  private static getRowObject(row: Row): Model {
    const keys = this.fieldsComplete();
    return row.reduce<Model>((returnRow, field, i) => {
      // @ts-expect-error dunno how to type
      returnRow[keys[i]] = field;

      return returnRow;
    }, {});
  }

  static getValuesMapping(values: Values) {
    return Object.entries(values).map(([key]) => {
      return this.fields[key] === DATA_TYPE.TIMESTAMP
        ? 'datetime(?, \'unixepoch\', \'localtime\')'
        : '?';
    }).join(', ');
  }

  static create(values: Values) {
    const query = `INSERT INTO ${this.table} (${
      Object.keys(values).join(', ')
    }) VALUES (${this.getValuesMapping(values)});`;

    db.query(query, [...Object.values(values)]);
  }

  static all(): Model[] {
    return db.query(`SELECT * FROM ${this.table};`)
      .map((row) => this.getRowObject(row)) as Model[];
  }

  static where(
    columnName: typeof this.fields,
    operation: string,
    matchValue: string | number,
    sortBy?: {
      column: keyof Fields;
      direction: 'ASC' | 'DESC';
    },
  ): typeof this {
    const sortingQuery = sortBy
      ? this.fields[sortBy.column] === DATA_TYPE.TIMESTAMP
        ? `ORDER BY datetime(${this.table}.${sortBy.column}) ${sortBy.direction}`
        : `ORDER BY ${this.table}.${sortBy.column} ${sortBy.direction}`
      : '';

    this.currentResult = db.query(`
      SELECT *
      FROM ${this.table}
      WHERE ${this.table}.${columnName} ${operation} ${matchValue}
      ${sortingQuery}
      ;
    `)
      .map((row) => this.getRowObject(row));

    return this;
  }

  static get(this: ModelSchema) {
    return this.currentResult;
  }

  static first(this: ModelSchema) {
    return Array.isArray(this.currentResult)
      ? this.currentResult[0]
      : this.currentResult;
  }

  static findById(id: number): typeof this {
    this.currentResult = this.getRowObject(
      db.query(`
      SELECT *
      FROM ${this.table}
      WHERE ${this.table}.id = ${id};
    `).at(0)!,
    );

    return this;
  }

  static updateById(id: number, updateValues: Values) {
    const setQuery = `SET ${
      Object.entries(updateValues).map(([key, value]) => {
        value = typeof value === 'string' ? `'${value}'` : value;

        return `${key} = ${value}`;
      })
        .join(', ')
    }`;

    db.query(`
      UPDATE ${this.table}
      ${setQuery}, updated_at = datetime('now', 'localtime')
      WHERE id = ${id};
    `);
  }

  static hasOne<T extends ModelSchema>(
    this: T,
    model: ModelSchema,
    foreignKey: string,
  ) {
    // @ts-expect-error dunno ts
    const foreignKeyValue = this.currentResult[foreignKey];

    this.currentResult = model.getRowObject(
      db.query(`
      SELECT ${model.table}.*
      FROM ${model.table}
      JOIN ${this.table} ON ${model.table}.id = ${this.table}.${foreignKey}
      WHERE ${model.table}.id = ${foreignKeyValue}
      LIMIT 1;
    `).at(0)!,
    );

    return this.get();
  }

  static hasMany<T extends ModelSchema>(
    this: T,
    model: ModelSchema,
    foreignKey: string,
    sortBy?: {
      column: keyof typeof model.fields;
      direction: 'ASC' | 'DESC';
    },
  ) {
    // @ts-expect-error dunno ts
    const id = this.currentResult['id'];

    const sortingQuery = sortBy
      ? model.fields[sortBy.column] === DATA_TYPE.TIMESTAMP
        ? `ORDER BY datetime(${model.table}.${sortBy.column}) ${sortBy.direction}`
        : `ORDER BY ${model.table}.${sortBy.column} ${sortBy.direction}`
      : '';

    this.currentResult = db.query(`
      SELECT ${model.table}.*
      FROM ${model.table}
      JOIN ${this.table} ON ${model.table}.${foreignKey} = ${this.table}.id
      WHERE ${this.table}.id = ${id}
      ${sortingQuery};
    `).map((row) => model.getRowObject(row));

    return this.get();
  }
}
