import {
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {ButtonComponent} from '@components/utilities/button/button';
import Swiper from 'swiper';
import {Autoplay, Navigation, Pagination} from 'swiper/modules';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {HeroSliderStore} from '@services/hero-slider';
import {HeroSlides} from '@models/hero-slider.types';
import {DecimalPipe} from '@angular/common';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Router} from '@angular/router';


@Component({
  selector: '[flexmile-hero-slider]',
  imports: [
    ButtonComponent,
    DecimalPipe,
  ],
  templateUrl: './hero-slider.html',
  styleUrl: './hero-slider.scss',
  animations: [
    trigger('slideAnimation', [
      state('current', style({
        opacity: 1,
        transform: 'translateX(0) scale(1)',
        zIndex: 10
      })),
      state('previous', style({
        opacity: 0,
        transform: 'translateX(-100%) scale(0.8)',
        zIndex: 0
      })),
      state('next', style({
        opacity: 0,
        transform: 'translateX(100%) scale(0.8)',
        zIndex: 0
      })),
      state('hidden', style({
        opacity: 0,
        transform: 'translateX(0) scale(0.8)',
        zIndex: 0
      })),
      transition('* => current', [
        animate('600ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ]),
      transition('current => previous', [
        animate('600ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ]),
      transition('current => next', [
        animate('600ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ]),
      transition('* => hidden', [
        animate('600ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ])
    ])
  ]
})
export class HeroSlider implements OnInit {
  @ViewChild('swiperContainer') set swiperContainer(el: ElementRef | undefined) {
    this.swiperContainerRef = el;
    this.tryInitSlider();
  }

  @ViewChild('swiperPagination') set swiperPagination(el: ElementRef | undefined) {
    this.swiperPaginationRef = el;
    this.tryInitSlider();
  }

  swiper!: Swiper;
  public slides: HeroSlides[] = [];
  public currentIndex: number = 0;
  private readonly heroSliderStore = inject(HeroSliderStore);
  private readonly destroyRef = inject(DestroyRef);
  private router: Router = inject(Router);
  private swiperContainerRef?: ElementRef;
  private swiperPaginationRef?: ElementRef;
  private sliderInitialized = false;

  ngOnInit(): void {
    this.heroSliderStore.loadSlides();

    this.heroSliderStore.slides$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((slides: HeroSlides[] | null) => {
        this.slides = slides ?? [];
        this.tryInitSlider();
      });
  }

  private tryInitSlider(): void {
    if (this.sliderInitialized ||
      !this.slides.length ||
      !this.swiperContainerRef ||
      !this.swiperPaginationRef) {
      return;
    }
    this.initSlider();
  }


  private initSlider(): void {
    this.sliderInitialized = true;
    this.swiper = new Swiper(this.swiperContainerRef!.nativeElement, {
      modules: [Navigation, Pagination, Autoplay],
      slidesPerView: 1,
      spaceBetween: 30,
      loop: false,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: this.swiperPaginationRef!.nativeElement,
        clickable: true,
        dynamicBullets: true,
      },
      on: {
        slideChange: (e: Swiper) => {
          this.currentIndex = e.activeIndex
        }
      }
    });
  }

  public getAnimationState(index: number): string {

    if (index === this.currentIndex) {
      return 'current';
    } else if (index < this.currentIndex) {
      return 'previous';
    } else if (index > this.currentIndex) {
      return 'next';
    }
    return 'hidden';
  }

  public goToOffer(id: number): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/oferta/${id}`])
    );
    window.open(url, '_blank');

  }

}

