import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentVisibilityService {
  private readonly _isContactFormVisible = signal<boolean>(true);
  public readonly isContactFormVisible = this._isContactFormVisible.asReadonly();
  public setContactFormVisibility(visible: boolean): void {
    this._isContactFormVisible.set(visible);
  }
}






