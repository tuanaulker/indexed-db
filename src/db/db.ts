import Dexie, { Table } from 'dexie';

export interface Branch{
  id?: number;
  name: string;
  selected: boolean;
}

export interface CompanyWorker {
  id?: number;
  name: string;
  surname: string;
  userType: number
}
export class BranchDB extends Dexie{
  branches: Table<Branch, number>
  constructor(name: string){
    super(name);
    this.version(1).stores({
      branches: '++id, name, selected'
    });
  }
}

export class AppDB extends Dexie {
  personnel!: Table<CompanyWorker, number>;
  oldversion: number = 1;
  newVersion: number = 1;

  constructor(name: string) {
    super(name);
    this.version(1).stores({
      personnel: '++id, name'
    });
     
    this.newVersion = this.verno;
    if(this.oldversion != this.newVersion ){
      this.personnel.clear();
      this.oldversion = this.newVersion;
    }

    // this.version(2).stores({
    //   personnel: '++id, name, surname'
    // }); 

    
    this.version(3).stores({
      personnel: '++id, name, surname, userType'
    }); 
  }
}
