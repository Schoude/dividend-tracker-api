import { DATA_TYPE, Model } from './Model.ts';
import { Portfolio } from './Portfolio.ts';

export class User extends Model {
  static table = 'users';
  static fields = {
    email: DATA_TYPE.TEXT,
    firstname: DATA_TYPE.TEXT,
    lastname: DATA_TYPE.TEXT,
    password: DATA_TYPE.TEXT,
  };

  static portfolios() {
    return this.hasMany(Portfolio, 'user_id');
  }
}
