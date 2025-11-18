import {Injectable} from '@angular/core';
import {BannerTypes} from '@models/banners.types';

@Injectable({
  providedIn: 'root'
})
export class BannersService {
  private banners: BannerTypes[] = [];

  setBanners(data: BannerTypes[]): void {
    this.banners = data;
  }

  getBanners(): BannerTypes[] {
    return this.banners;
  }
}
