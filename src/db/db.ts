import Dexie, { Table } from 'dexie';

export interface User {
  id?: number;
  username: string;
  email: string;
  age: number;
  //gender: string;
}


export class AppDB extends Dexie {
  users!: Table<User, number>;


  constructor(name: string) {
    super(name);
    this.version(4).stores({
      users: '++id, username,email, age'
    });

    //this.users.clear();
    //this.on('populate', () => this.populate());

    console.log("Version: " + this.verno);

  }



  // async populate() {
  //   await db.users.bulkAdd([
  //     {
  //       username: 'John'
  //     },
  //     {
  //       username: 'Deneme1'
  //     },
  //     {
  //       username: 'User7'
  //     }
  //   ]);

  // }

  async resetDatabase() {
  await db.transaction('rw', 'users', () => {
    this.users.clear();
    //this.populate();
  });
}


}


export const db = new AppDB('UserDB');