import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonTabs, IonTabButton, IonTabBar, IonLabel, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-main-tabs',
  templateUrl: './main-tabs.page.html',
  styleUrls: ['./main-tabs.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonTabs, IonIcon, IonTabButton, IonTabBar, IonLabel],
})
export class MainTabsPage {}
