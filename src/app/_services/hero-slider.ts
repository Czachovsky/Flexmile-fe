import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {API_URL} from '@tokens/api-url.token';
import {HeroSlides} from '@models/hero-slider.types';

@Injectable({
  providedIn: 'root',
})
export class HeroSliderStore {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  private readonly slidesSubject = new BehaviorSubject<HeroSlides[] | null>(null);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private loadSubscription?: Subscription;

  public readonly slides$: Observable<any[] | null> = this.slidesSubject.asObservable();

  loadSlides(): void {
    if (this.slidesSubject.value !== null || this.loadingSubject.value) {
      return;
    }

    this.loadingSubject.next(true);

    if (this.loadSubscription) {
      this.loadSubscription.unsubscribe();
    }

    this.loadSubscription = this.http
      .get<any[]>(this.apiUrl + '/offers/slider')
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: (slides) => this.slidesSubject.next(slides ?? []),
        error: (error) => {
          console.error('Error loading hero slider:', error);
          this.slidesSubject.next([]);
        },
      });
  }
}

