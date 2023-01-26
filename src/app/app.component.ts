import { Component } from '@angular/core';
import { liveQuery } from 'dexie';
import { AppDB, db} from 'src/db/db';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'indexed-db';
  selectedValue = '';
  username = '';
  email = '';
  age = 0 ;
  gender = '';
  
  models: string[] = ['Company1', 'Company2', 'Company3'];
  users$ = liveQuery(() => db.users.toArray());

 


  async onSubmit() {
    await db.users.add({ username: this.username,   email: this.email, age: this.age,  /*gender: this.gender*/});
    this.username = '';
    this.email = '';
    this.age = 0;
    debugger
    console.log(this.selectedValue);
  }


  async resetDatabase() {
    await db.resetDatabase();
  }

}
