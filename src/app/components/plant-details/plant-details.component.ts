import { icons as lightIcons, LightRequirementLabel } from '@/enums/LightRequirements';
import { PlantTypeLabel } from '@/enums/PlantTypes';
import { icons as waterIcons, WaterRequirementLabel } from '@/enums/WaterRequirements';
import { CommaDecimalPipe } from '@/pipes/comma-decimal.pipe';
import { db } from '@/services/app-database.service';
import { PlantFormService } from '@/services/plant-form.service';
import { Plant } from '@/types/PlantType';
import { loadNativeImage } from '@/utils/image.utils';
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { IonImg, IonItem, IonLabel, IonList, IonModal, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-plant-details',
  templateUrl: './plant-details.component.html',
  styleUrls: ['./plant-details.component.scss'],
  imports: [IonImg, IonLabel, IonText, IonItem, IonList, CommaDecimalPipe, CommonModule, IonModal],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PlantDetailsComponent implements OnInit {
  @Input() plant!: Plant;

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
    const iconMap: { [key: string]: string } = {
      leaf: 'leaf.png',
      dryTolerance: 'cactus.png',
      buckets: 'flower-pot.png',
      frostResistant: 'snowflake.png',
      edible: 'eatable.png',
      toxic: 'skull.png',
      fragrant: 'nose.png',
      windFriendly: 'wind.png',
      bugsFriendly: 'bug.png',
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
