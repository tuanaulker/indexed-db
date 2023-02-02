import { Component, OnInit } from '@angular/core';
import Dexie, { liveQuery, Observable } from 'dexie';
import { Guid } from 'guid-typescript';
import { AppDB, Branch, BranchDB } from 'src/db/db';
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
  selectedBranchfromMaster: string = '';

  nameBranch: string = "";
  tempDb: AppDB;
  informationDb: infoDB[] = [];
  guidW: AppDB;
  showRevenue: boolean = false;
  checkboxDis: boolean = false;

  masterDb: BranchDB = new BranchDB("master");
  masterBranches$: Observable<Branch[]>;



  ngOnInit() {
    this.allLocalData();  // var olan databaseleri yakalamak için bir method.
    this.masterBranches$ = liveQuery(() => this.masterDb.branches.toArray());
  }

  addBranchToMaster() {
    var tempBranch: Branch = {
      name: this.nameBranch,
      selected: false
    }
    this.masterDb.branches.add(tempBranch);
    this.nameBranch = '';
    this.masterBranches$ = liveQuery(() => this.masterDb.branches.toArray());
  }

  createDbforSelected(selectedName: string) {
    var tempinfoDb: infoDB = {
      realName: selectedName,
      dbName: ''
    };
    this.createGuidDb(tempinfoDb);
  }

  checkCheckBoxvalue(event: any) {
    //this.selectedDb = event.target.value; //seçilen database'in guid id ile olan adresi
    //this.selectedrealName = event.target.value.split("db", 1).toString(); // seçilen database'in şube adı
    const clear = this.masterDb.branches.filter(x => x.selected === true).first().then((response) => {
      this.masterDb.branches.update(response?.id, { selected: false });
    });

    const data = this.masterDb.branches.filter(x => x.id === Number(event.target.value)).first().then((response) => {
      this.selectedBranchfromMaster = response?.name;
      this.masterDb.branches.update(response?.id, { selected: true });
    });
    //this.checkboxDis = true;
  }

  clear() {
    this.masterDb.branches.toCollection().modify(friend => {
      friend.selected = false;
    });
  }


  createGuidDb(tempInfo: infoDB) {
    this.id = Guid.create();
    this.tempDb = new AppDB(`${tempInfo.realName}db-${this.id}`)
    tempInfo.dbName = this.tempDb.name;
    this.tempDb.personnel.add({ name: 'ayse', surname: 'celik' });
    this.informationDb.push(tempInfo);
  }

  allLocalData() {
    if (this.informationDb.length == 0) {
      Dexie.getDatabaseNames()
        .then(names => {
          names.forEach(name => {
            var tempinfoDb: infoDB = {
              realName: name.split("db", 1).toString(),
              /*yapıyı biliyoruz önce şube ismi daha sonra db geliyor, 
              bizde şube ismini almak için db'den öncesine bakıyoruz. 
              (Daha verimli bir çözüm bulunmalı) */
              dbName: name
            };
            this.informationDb.push(tempinfoDb);
          });
        });
    }
  }

  deleteSelected() {
    if(this.informationDb.find(x => x.realName === this.selectedBranchfromMaster) != undefined){
      Dexie.getDatabaseNames()
      .then(names => {
        names.forEach(name => {
          if (name == this.informationDb.find(x => x.realName === this.selectedBranchfromMaster).dbName) {
            const db = new Dexie(name);
            db.delete().catch(() => { });
            this.informationDb.forEach((element, index) => {
              if (element.dbName == this.selectedBranchfromMaster) {
                this.selectedBranchfromMaster = '';
                this.informationDb.splice(index, 1);
              }
            });
          }
        })
      });
    }
    
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

  clearBranchesInMaster() {
    this.masterDb.branches.clear();
  }

  revenueCenter() {
    this.clear();
    console.log(this.selectedBranchfromMaster);
    this.checkboxDis = false;
    this.selectedDb = '';
    this.showRevenue = true;
  }

  /*
  kullanıcıdan girilen name ile bir database oluşturur
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
   */


}
