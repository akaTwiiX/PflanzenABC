import { Component, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons } from '@ionic/angular/standalone';
import { AuthService } from '@/services/auth.service';
import { DropdownListComponent } from "src/app/components/dropdown-list/dropdown-list.component";
import { AddButtonComponent } from "src/app/components/add-button/add-button.component";
import { FilterButtonComponent } from "src/app/components/filter-button/filter-button.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, DropdownListComponent, AddButtonComponent, FilterButtonComponent],
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
