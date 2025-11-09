import { Component, inject, ViewChild } from '@angular/core';
import { DropdownListComponent } from 'src/app/components/dropdown-list/dropdown-list.component';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AddButtonComponent } from "src/app/components/add-button/add-button.component";

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
  imports: [DropdownListComponent, AddButtonComponent],
})
export class MainContentComponent {
  @ViewChild('dropdown') dropdown!: DropdownListComponent;


  enterPage(){
    // this.dropdown.ionViewWillEnter();
  }
}
