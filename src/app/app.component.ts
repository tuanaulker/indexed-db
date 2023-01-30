import { Component, OnInit } from '@angular/core';
import Dexie, { liveQuery, Observable } from 'dexie';
import { Guid } from 'guid-typescript';
import { AppDB, CompanyWorker, dbComp2 } from 'src/db/db';
export const dbComp1 = new AppDB('Company1');


export interface infoDB {
  realName: string;
  dbName: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {
  title = 'indexed-db';

  id: Guid;
  selectedDb: string = '';
  selectedrealName: string = '';
  nameBranch: string = "";
  tempDb: AppDB;
  informationDb: infoDB[] = [];
  //company1$ = liveQuery(() => dbComp1.workers.toArray());
  guidW: AppDB;
  showRevenue: boolean = false;
  checkboxDis: boolean = false;
  checked: boolean = false;


  async ngOnInit(): Promise<void> {
    this.allLocalData();
  }

  onSubmitNames() {
    if(this.nameBranch == ""){
      alert("Please add name.");
    }
    else{
      var tempinfoDb: infoDB = {
        realName: this.nameBranch,
        dbName: ''
      };
      this.createGuidDb(tempinfoDb);
      this.nameBranch = '';
    }
    
  }

  createGuidDb(tempInfo: infoDB) {
    this.id = Guid.create();
    this.tempDb = new AppDB(`${tempInfo.realName}db-${this.id}`)
    tempInfo.dbName = this.tempDb.name;
    this.tempDb.workers.add({ name: 'ayse', surname: 'celik'});
    this.informationDb.push(tempInfo);
  }

  allLocalData() {
    if (this.informationDb.length == 0) {
      Dexie.getDatabaseNames()
        .then(names => {
          names.forEach(name => {
            var tempinfoDb: infoDB = {
              realName: name.split("db", 1).toString(),
              dbName: name
            };
            this.informationDb.push(tempinfoDb);
          });
        });
    }
  }

  deleteSelected() {
    Dexie.getDatabaseNames()
      .then(names => {
        names.forEach(name => {
          if (name == this.selectedDb) {
            const db = new Dexie(name);
            db.delete().catch(() => { });
            this.informationDb.forEach((element, index) => {
              if (element.dbName == this.selectedDb) {
                this.informationDb.splice(index, 1);
              }
            this.selectedDb = '';
            });
          }
        })
      });
  }

  createNewSelected() {
    let newInfoDb: infoDB = {
      realName: '',
      dbName: ''
    };
    Dexie.getDatabaseNames()
      .then(names => {
        names.forEach(name => {
          if (name == this.selectedDb) {
            const db = new Dexie(name);
            db.delete().catch(() => { });
            console.log(this.selectedDb + " deleted successfully.");
            this.informationDb.forEach((element, index) => {
              if (element.dbName == this.selectedDb) {
                newInfoDb.realName = element.realName;
                this.createGuidDb(newInfoDb);
                console.log(newInfoDb.realName + " created successfully.");
                this.informationDb.splice(index, 1);
              }
            });
          }
        })
      })
  }

  deleteAll() {
    Dexie.getDatabaseNames()
      .then(names => {
        names.forEach(name => {
          const db = new Dexie(name);
          db.delete().catch(() => { });
          this.informationDb.pop();
        })
      });
  }


  checkCheckBoxvalue(event: any) {
    this.selectedDb = event.target.value;
    this.selectedrealName = event.target.value.split("db", 1).toString();
    this.checkboxDis = true;
    event.target.checked = false;
  }

  revenueCenter() {
    this.checkboxDis = false;
    this.selectedDb = '';
    this.showRevenue = true;
  }


}
