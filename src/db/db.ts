import Dexie, { Table } from 'dexie';

export interface CompanyWorker {
  id?: number;
  name: string;
  surname: string;
  //age: number;
}

export class AppDB extends Dexie {
  workers!: Table<CompanyWorker, number>;
  oldversion: number = 1;
  newVersion: number = 1;

  constructor(name: string) {
    super(name);
    this.version(1).stores({
      workers: '++id, name'
    });
     
    this.newVersion = this.verno;
    if(this.oldversion != this.newVersion ){
      this.workers.clear();
      this.oldversion = this.newVersion;
    }

    this.version(2).stores({
      workers: '++id, name, surname'
    });

    
  }
}


//export const dbComp1 = new AppDB('Company1');
export const dbComp2 = new AppDB('Company2');
//export const dbComp4 = new AppDB(`db-${}`);