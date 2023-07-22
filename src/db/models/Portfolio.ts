import { DATA_TYPE, Model } from './Model.ts';
import { User } from './User.ts';

export class Portfolio extends Model {
  static table = 'portfolios';
  static fields = {
    name: DATA_TYPE.TEXT,
    user_id: DATA_TYPE.INTEGER,
  };

  static user() {
    return this.hasOne(User, 'user_id');
  }
}
