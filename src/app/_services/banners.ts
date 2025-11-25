import {Injectable} from '@angular/core';
import {BannerTypes} from '@models/banners.types';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BannersService {
  private bannersSubject = new BehaviorSubject<BannerTypes[]>([]);
  public readonly banners$ = this.bannersSubject.asObservable();

  setBanners(data: BannerTypes[]): void {
    this.bannersSubject.next(data ?? []);
  }

  getBanners(): BannerTypes[] {
    return this.bannersSubject.value;
  }
}
