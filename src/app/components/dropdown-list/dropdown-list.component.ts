import { CollectionStorageService } from '@/services/collection-storage.service';
import { PlantStorageService } from '@/services/plant-storage.service';
import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  ElementRef,
  AfterViewInit,
  QueryList,
  ViewChildren,
  inject,
  ViewChild,
} from '@angular/core';
import { IonSpinner, IonContent, IonFab, IonFabButton, IonFabList, IonIcon } from '@ionic/angular/standalone';
import { PlantListComponent } from '../plant-list/plant-list.component';
import { Collection } from '@/types/Collection';
import { Plant } from '@/types/PlantType';

interface LetterGroup {
  letter: string;
  plants?: Plant[];
  collections?: Collection[];
  isLoading: boolean;
  loaded: boolean;
}

@Component({
  selector: 'app-dropdown-list',
  templateUrl: './dropdown-list.component.html',
  styleUrls: ['./dropdown-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonSpinner,
    PlantListComponent,
    IonFab,
    IonFabButton,
    IonFabList,
    IonIcon
],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownListComponent implements AfterViewInit {
  @ViewChild(IonContent) content!: IonContent;

  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  private plantStorageService = inject(PlantStorageService);
  private collectionStorageService = inject(CollectionStorageService);

  dataByLetter = signal<LetterGroup[]>(
    this.alphabet.map((l) => ({
      letter: l,
      isLoading: false,
      loaded: false,
    }))
  );
  activeLetter = signal<string | null>(null);

  isAnyLoading = computed(() => this.dataByLetter().some((l) => l.isLoading));
  isInitialLoading = computed(() => this.isAnyLoading() && this.dataByLetter().every((l) => !l.loaded));

  @ViewChildren('letterSection', { read: ElementRef })
  sections!: QueryList<ElementRef>;

  private observer!: IntersectionObserver;
  private activeObserver!: IntersectionObserver;

  ngAfterViewInit() {
    this.initObservers();

    this.sections.changes.subscribe(() => {
      this.reconnectObservers();
    });
  }

  private initObservers() {
    this.observer = new IntersectionObserver(
      (entries) => this.onIntersect(entries),
      { rootMargin: '100px', threshold: 0.2 }
    );

    this.observeSections();
    this.observeActiveLetter();
  }

  private reconnectObservers() {
    if (this.observer) this.observer.disconnect();
    if (this.activeObserver) this.activeObserver.disconnect();

    this.observeSections();
    this.observeActiveLetter();
  }

  resetData() {
    const reset = this.alphabet.map((l) => ({
      letter: l,
      isLoading: false,
      loaded: false,
      plants: [],
      collections: [],
    }));

    this.dataByLetter.set(reset);

    queueMicrotask(() => {
      this.reconnectObservers();
    });
  }


  private observeSections() {
    this.sections.forEach(section => {
      this.observer.observe(section.nativeElement);
    });
  }

  private onIntersect(entries: IntersectionObserverEntry[]) {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const letter = entry.target.getAttribute('data-letter');
        if (letter) this.loadDataForLetter(letter);
      }
    }
  }

  private async loadDataForLetter(letter: string) {
    const currentData = this.dataByLetter();
    const index = currentData.findIndex((x) => x.letter === letter);
    const entry = currentData[index];

    if (!entry || entry.loaded || entry.isLoading) return;

    // console.log('[loadDataForLetter]', letter);

    const updated = [...currentData];
    updated[index] = { ...entry, isLoading: true };
    this.dataByLetter.set(updated);

    try {
      const [plants, collections] = await Promise.all([
        this.plantStorageService.queryBy('initialId', letter),
        this.collectionStorageService.queryBy('initialId', letter),
      ]);

      // console.log(`[${letter}] loaded:`, { plants, collections });

      const done = [...this.dataByLetter()];
      done[index] = {
        ...done[index],
        isLoading: false,
        loaded: true,
        plants,
        collections,
      };
      this.dataByLetter.set(done);
    } catch (err) {
      console.error(`Error loading ${letter}:`, err);
      const done = [...this.dataByLetter()];
      done[index] = {
        ...done[index],
        isLoading: false,
        loaded: true,
        plants: [],
        collections: [],
      };
      this.dataByLetter.set(done);
    }
  }

  private observeActiveLetter() {
    if (!this.content) {
      console.warn('IonContent not yet available');
      return;
    }

    this.content.getScrollElement().then(root => {
      this.activeObserver = new IntersectionObserver(
        (entries) => this.updateActiveLetter(entries),
        {
          root,
          rootMargin: '0px 0px -90%',
          threshold: 0,
        }
      );

      this.sections.forEach(section => {
        this.activeObserver.observe(section.nativeElement);
      });
    });
  }

  private updateActiveLetter(entries: IntersectionObserverEntry[]) {
    const leaving = entries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

    if (leaving[0] && leaving[0].intersectionRatio > 0) {
      const letter = leaving[0].target.getAttribute('data-letter');
      if (letter && this.activeLetter() !== letter) {
        this.activeLetter.set(letter);
        // console.log('[Active Letter (leaving)]', letter);
      }
    }
  }

  scrollToLetter(letter: string) {
    const target = this.sections.find(
      (el) => el.nativeElement.getAttribute('data-letter') === letter
    );

    if (!target) return;

    this.content.scrollToPoint(0, target.nativeElement.offsetTop, 400);
  }

  onTouchMove(event: TouchEvent) {
    const touch = event.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const letter = element?.textContent?.trim();
    if (letter && this.alphabet.includes(letter)) {
      this.scrollToLetter(letter);
    }
  }

  trackByLetter(_: number, item: LetterGroup) {
    return item.letter;
  }
}
