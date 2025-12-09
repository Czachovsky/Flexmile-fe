import {Component, DestroyRef, ElementRef, HostListener, inject, OnInit, signal} from '@angular/core';
import {OrderbyType, OrderType, SortByListModel} from '@models/offers.types';
import {NgClass} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Screen} from '@services/screen';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'flexmile-sort-by',
  imports: [
    NgClass
  ],
  templateUrl: './sort-by.html',
  styleUrl: './sort-by.scss',
  animations: [
    trigger('slideUpDown', [
      state('void', style({
        transform: 'translateY(100%)',
        opacity: 0
      })),
      state('*', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition(':enter', [
        animate('0.35s cubic-bezier(0.16, 1, 0.3, 1)')
      ]),
      transition(':leave', [
        animate('0.25s cubic-bezier(0.7, 0, 0.84, 0)')
      ])
    ]),
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      state('*', style({
        opacity: 1
      })),
      transition(':enter', [
        animate('0.25s ease-in')
      ]),
      transition(':leave', [
        animate('0.2s ease-out')
      ])
    ])
  ]
})
export class SortBy implements OnInit {
  isOpen = signal(false);
  public readonly screen: Screen = inject(Screen);
  public sortMobileState: boolean = false;
  sortByList: SortByListModel[] = [
    {label: 'Najnowsze', selected: false, order: OrderType.DESC, orderBy: OrderbyType.date},
    {label: 'Najstarsze', selected: false, order: OrderType.ASC, orderBy: OrderbyType.date},
    {label: 'Cena rosnąco', selected: false, order: OrderType.ASC, orderBy: OrderbyType.price},
    {label: 'Cena malejąco', selected: false, order: OrderType.DESC, orderBy: OrderbyType.price}
  ];
  private elementRef: ElementRef = inject(ElementRef);
  private router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.initializeFromQueryParams();
    this.listenToQueryParams();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  get sortByLabel(): string {
    const selected = this.sortByList.find(s => s.selected);
    return selected?.label || 'Najnowsze';
  }

  public toggleOpenSortBy(): void{
    this.isOpen.update(v => !v);
    this.sortMobileState = this.screen.isMobile();
  }

  public sortBy(sortObj: SortByListModel): void {
    this.sortByList.forEach(e => e.selected = sortObj.label === e.label);
    this.isOpen.set(false);

    const currentParams = this.route.snapshot.queryParams;
    const queryParams = {
      ...currentParams,
      order: sortObj.order,
      orderby: sortObj.orderBy
    };

    this.router.navigate([], {
      queryParams: queryParams
    });
  }

  private initializeFromQueryParams(): void {
    this.updateSelectionFromParams(this.route.snapshot.queryParams);
  }

  private listenToQueryParams(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        this.updateSelectionFromParams(params);
      });
  }

  private updateSelectionFromParams(params: any): void {
    const order = params['order'] as OrderType;
    const orderBy = params['orderby'] as OrderbyType;

    if (order && orderBy) {
      const matchingSort = this.sortByList.find(
        s => s.order === order && s.orderBy === orderBy
      );
      if (matchingSort) {
        this.sortByList.forEach(e => e.selected = e.label === matchingSort.label);
      } else {
        // Default to first option if no match
        this.sortByList.forEach(e => e.selected = false);
        this.sortByList[0].selected = true;
      }
    } else {
      // Default to first option if no params
      this.sortByList.forEach(e => e.selected = false);
      this.sortByList[0].selected = true;
    }
  }
}
