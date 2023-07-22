import { User } from '../models/User.ts';

export function seedUsers() {
  console.log('# Seed users');

  User.create({
    email: 'marcbaque1311@gmail.com',
    firstname: 'Marc',
    lastname: 'Baque',
    // meddl - 10 rounds brcypt hashed
    password: '$2a$10$/WWGfMDxthqJgbyLrurUyOGANRt85GuLoqQr4DXSNY7rZeldzIr1i',
  });

  console.log('### Users seeded.\n');
}
