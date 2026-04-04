import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { IonBadge, IonButton, IonIcon, IonImg, IonModal, IonText } from '@ionic/angular/standalone';
import { icons as lightIcons, LightRequirementLabel } from '../../shared/enums/LightRequirements';
import { PlantTypeLabel } from '../../shared/enums/PlantTypes';
import { icons as waterIcons, WaterRequirementLabel } from '../../shared/enums/WaterRequirements';
import { CommaDecimalPipe } from '../../shared/pipes/comma-decimal.pipe';
import { db } from '../../shared/services/app-database.service';
import { PlantFormService } from '../../shared/services/plant-form.service';
import type { Plant } from '../../shared/types/PlantType';
import { loadNativeImage } from '../../shared/utils/image.utils';

@Component({
  selector: 'app-plant-details',
  templateUrl: './plant-details.component.html',
  styleUrls: ['./plant-details.component.scss'],
  imports: [
    IonImg,
    IonText,
    CommaDecimalPipe,
    CommonModule,
    IonModal,
    IonBadge,
    IonButton,
    IonIcon,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PlantDetailsComponent implements OnInit {
  isArray = Array.isArray;
  @Input() plant!: Plant;

  get fertilizationTypeDisplay(): string {
    const type = this.plant.fertilization.type;
    if (!type)
      return '';
    return Array.isArray(type) ? type.join(', ') : type;
  }

  plantFormService = inject(PlantFormService);

  plantTypeLabel = PlantTypeLabel;
  lightRequirementLabel = LightRequirementLabel;
  lightIcons = lightIcons;

  waterRequirementLabel = WaterRequirementLabel;
  waterIcons = waterIcons;

  icons: string[] = [];

  imageSrc: string | undefined = undefined;
  isImageModalOpen = false;

  async ngOnInit() {
    this.buildIcons();
    if (this.plant.imageUrl) {
      if (Capacitor.getPlatform() === 'web') {
        const entry = await db.images.get(Number(this.plant.imageUrl));
        this.imageSrc = entry ? URL.createObjectURL(entry.data) : undefined;
      } else {
        const src = await loadNativeImage(this.plant.imageUrl);
        this.imageSrc = src;
      }
    }
  }

  buildIcons() {
    const iconMap: { [key: string]: string, } = {
      evergreen: 'leaf.png',
      dryTolerance: 'cactus.png',
      buckets: 'flower-pot.png',
      frostResistant: 'snowflake.png',
      edible: 'eatable.png',
      toxic: 'skull.png',
      fragrant: 'nose.png',
      windFriendly: 'wind.png',
      bugsFriendly: 'bug.png',
      birdFriendly: 'bird.png',
      regional: 'home.png',
    };

    this.icons = Object.entries(iconMap)
      .filter(([key]) => this.resolvePath(this.plant, key))
      .map(([_, icon]) => icon);
  }

  private resolvePath(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  openImageModal() {
    this.isImageModalOpen = true;
  }

  closeImageModal() {
    this.isImageModalOpen = false;
  }
}
