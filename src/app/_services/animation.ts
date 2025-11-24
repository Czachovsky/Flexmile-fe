import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, shareReplay} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private http: HttpClient = inject(HttpClient);
  private animationDataCache: Map<string, any> = new Map();
  private loadingObservables: Map<string, Observable<any>> = new Map();

  getAnimationData(path: string): Observable<any> {
    if (this.animationDataCache.has(path)) {
      return of(this.animationDataCache.get(path));
    }

    if (this.loadingObservables.has(path)) {
      return this.loadingObservables.get(path)!;
    }

    const loadingObservable = this.http.get(path).pipe(
      shareReplay(1)
    );

    this.loadingObservables.set(path, loadingObservable);

    loadingObservable.subscribe({
      next: (data) => {
        this.animationDataCache.set(path, data);
        this.loadingObservables.delete(path);
      },
      error: () => {
        this.loadingObservables.delete(path);
      }
    });

    return loadingObservable;
  }
}

