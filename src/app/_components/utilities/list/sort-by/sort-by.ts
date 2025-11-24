import {Component, ElementRef, HostListener, inject, signal} from '@angular/core';
import {OrderbyType, OrderType, SortByListModel} from '@models/offers.types';
import {NgClass} from '@angular/common';

@Component({
  selector: 'flexmile-sort-by',
  imports: [
    NgClass
  ],
  templateUrl: './sort-by.html',
  styleUrl: './sort-by.scss',
})
export class SortBy {
  isOpen = signal(false);
  sortByList: SortByListModel[] = [
    {label: 'Najnowsze', selected: true, order: OrderType.date, orderBy: OrderbyType.ASC},
    {label: 'Najstarsze', selected: true, order: OrderType.date, orderBy: OrderbyType.DESC},
    {label: 'Cena rosnąco', selected: true, order: OrderType.date, orderBy: OrderbyType.ASC},
    {label: 'Cena malejąco', selected: true, order: OrderType.price, orderBy: OrderbyType.DESC}
  ];
  private elementRef: ElementRef = inject(ElementRef);
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  get sortByLabel(): string {
    return this.sortByList.find(s => s.selected)?.label!;
  }

  public toggleOpenSortBy(): void{
    this.isOpen.update(v => !v);
  }

  public sortBy(sortObj: SortByListModel): void {
    this.sortByList.map(e => e.selected = sortObj.label === e.label);
    this.isOpen.set(false);
  }

}
