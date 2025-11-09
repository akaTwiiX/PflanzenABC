import { Component, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent,IonButtons } from '@ionic/angular/standalone';
import { MainContentComponent } from './main-content/main-content.component';
import { AuthService } from '@/services/auth.service';
import { DropdownListComponent } from "src/app/components/dropdown-list/dropdown-list.component";
import { AddButtonComponent } from "src/app/components/add-button/add-button.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, DropdownListComponent, AddButtonComponent],
})
export class HomePage {
  @ViewChild('dropdownList') dropdownList!: DropdownListComponent;
  constructor(
    public authService: AuthService
  ) { }

  

  ionViewWillEnter() {
    this.dropdownList.resetData();
  }

  

  
}
