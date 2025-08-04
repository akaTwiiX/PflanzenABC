import { Component, inject } from '@angular/core';
import { DropdownListComponent } from 'src/app/components/dropdown-list/dropdown-list.component';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
  imports: [DropdownListComponent, IonButton, IonIcon],
})
export class MainContentComponent {
  router = inject(Router);

  navigate() {
    this.router.navigate(['/add-plant']);
  }
}
