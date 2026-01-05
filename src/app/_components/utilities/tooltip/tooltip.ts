import {
  Component,
  input,
  InputSignal,
  ElementRef,
  viewChild,
  signal,
  computed,
  inject,
  Renderer2,
  OnDestroy,
  ViewContainerRef
} from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { TooltipConfig } from '@models/tooltip.types';

@Component({
  selector: 'flexmile-tooltip',
  imports: [NgClass, NgStyle],
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.scss',
})
export class Tooltip implements OnDestroy {
  private renderer = inject(Renderer2);
  private vcr = inject(ViewContainerRef);

  config: InputSignal<TooltipConfig> = input<TooltipConfig>({
    text: '',
    position: 'top',
    multiline: false,
  });

  visible = signal(false);
  private tooltipContent = viewChild<ElementRef>('tooltipContent');
  private appendedTooltipElement: HTMLElement | null = null;
  private triggerElement: HTMLElement | null = null;
  public positionCalculated = signal(false);

  // Computed signal dla kolorów strzałki
  arrowStyles = computed(() => {
    const bgColor = this.config().backgroundColor || '#b8d14a';
    const position = this.config().position || 'top';

    const styles: Record<string, string> = {};

    switch (position) {
      case 'top':
        styles['border-color'] = `${bgColor} transparent transparent transparent`;
        break;
      case 'bottom':
        styles['border-color'] = `transparent transparent ${bgColor} transparent`;
        break;
      case 'left':
        styles['border-color'] = `transparent transparent transparent ${bgColor}`;
        break;
      case 'right':
        styles['border-color'] = `transparent ${bgColor} transparent transparent`;
        break;
    }

    return styles;
  });
  show() {
    const config = this.config();
    const appendTo = config.appendTo;

    if (appendTo) {
      // Renderuj tooltip w zewnętrznym kontenerze
      this.showAppendedTooltip();
    } else {
      this.visible.set(true);
      this.positionCalculated.set(false);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.adjustPosition();
          this.positionCalculated.set(true);
        });
      });
    }
  }

  hide() {
    if (this.appendedTooltipElement) {
      // Usuń dynamicznie utworzony tooltip
      this.removeAppendedTooltip();
    } else {
      // Standardowe zachowanie
      this.visible.set(false);
      this.positionCalculated.set(false);
    }
  }

  ngOnDestroy() {
    // Upewnij się, że tooltip jest usunięty przy niszczeniu komponentu
    if (this.appendedTooltipElement) {
      this.removeAppendedTooltip();
    }
  }

  private getAppendToElement(): HTMLElement | null {
    const appendTo = this.config().appendTo;
    if (!appendTo) return null;

    if (typeof appendTo === 'string') {
      // Jeśli to selektor, znajdź element
      return document.querySelector(appendTo) as HTMLElement;
    } else {
      // Jeśli to już HTMLElement, zwróć go
      return appendTo;
    }
  }

  private showAppendedTooltip() {
    const appendToElement = this.getAppendToElement();
    if (!appendToElement) {
      console.warn('Tooltip appendTo element not found, falling back to default behavior');
      this.visible.set(true);
      return;
    }

    // Pobierz element triggera (wrapper)
    const wrapperElement = this.vcr.element.nativeElement as HTMLElement;
    this.triggerElement = wrapperElement.querySelector('.tooltip-wrapper') || wrapperElement;

    // Utwórz element tooltipa
    const tooltipEl = this.renderer.createElement('div');
    tooltipEl.className = 'tooltip-content position-' + this.config().position;

    if (this.config().multiline) {
      tooltipEl.classList.add('multi-line');
    }

    // Ustaw style
    const bgColor = this.config().backgroundColor || '#b8d14a';
    const textColor = this.config().textColor || '#5a3270';
    this.renderer.setStyle(tooltipEl, 'background', bgColor);
    this.renderer.setStyle(tooltipEl, 'color', textColor);
    this.renderer.setStyle(tooltipEl, 'position', 'fixed');
    this.renderer.setStyle(tooltipEl, 'z-index', '10000');
    this.renderer.setStyle(tooltipEl, 'display', 'block');
    // Nadpisz style pozycjonowania z CSS (bottom, top, left, right) - używamy tylko top i left
    this.renderer.setStyle(tooltipEl, 'bottom', 'auto');
    this.renderer.setStyle(tooltipEl, 'right', 'auto');
    this.renderer.setStyle(tooltipEl, 'padding', '8px 16px');
    this.renderer.setStyle(tooltipEl, 'border-radius', '16px');
    this.renderer.setStyle(tooltipEl, 'font-size', '14px');
    this.renderer.setStyle(tooltipEl, 'line-height', '1.714'); // Zgodnie z mixin fontSize(14)
    this.renderer.setStyle(tooltipEl, 'font-weight', '600');
    this.renderer.setStyle(tooltipEl, 'white-space', this.config().multiline ? 'normal' : 'nowrap');
    // this.renderer.setStyle(tooltipEl, 'max-width', '250px');
    if (this.config().multiline) {
      this.renderer.setStyle(tooltipEl, 'min-width', '215px');
      this.renderer.setStyle(tooltipEl, 'font-size', '12px');
      this.renderer.setStyle(tooltipEl, 'line-height', '18px');
      this.renderer.setStyle(tooltipEl, 'font-weight', '400');
    }
    this.renderer.setStyle(tooltipEl, 'opacity', '0');
    this.renderer.setStyle(tooltipEl, 'visibility', 'hidden');
    this.renderer.setStyle(tooltipEl, 'transition', 'opacity 0.2s ease, transform 0.2s ease, visibility 0.2s');

    // Ustaw początkowy transform w zależności od pozycji
    const position = this.config().position || 'top';
    let initialTransform = 'scale(0.95)';
    if (position === 'top' || position === 'bottom') {
      initialTransform = 'translateX(-50%) scale(0.95)';
    } else if (position === 'left' || position === 'right') {
      initialTransform = 'translateY(-50%) scale(0.95)';
    }
    this.renderer.setStyle(tooltipEl, 'transform', initialTransform);

    // Dodaj tekst
    const textNode = this.renderer.createText(this.config().text);
    this.renderer.appendChild(tooltipEl, textNode);

    // Utwórz strzałkę
    const arrowEl = this.renderer.createElement('div');
    arrowEl.className = 'tooltip-arrow';
    // Podstawowe style strzałki
    this.renderer.setStyle(arrowEl, 'position', 'absolute');
    this.renderer.setStyle(arrowEl, 'width', '0');
    this.renderer.setStyle(arrowEl, 'height', '0');
    this.renderer.setStyle(arrowEl, 'border-style', 'solid');

    // Style specyficzne dla pozycji strzałki
    const arrowPosition = this.config().position || 'top';
    const arrowBgColor = this.config().backgroundColor || '#b8d14a';

    switch (arrowPosition) {
      case 'top':
        this.renderer.setStyle(arrowEl, 'bottom', '-8px');
        this.renderer.setStyle(arrowEl, 'left', '50%');
        this.renderer.setStyle(arrowEl, 'transform', 'translateX(-50%)');
        this.renderer.setStyle(arrowEl, 'border-width', '8px 8px 0 8px');
        this.renderer.setStyle(arrowEl, 'border-color', `${arrowBgColor} transparent transparent transparent`);
        break;
      case 'bottom':
        this.renderer.setStyle(arrowEl, 'top', '-8px');
        this.renderer.setStyle(arrowEl, 'left', '50%');
        this.renderer.setStyle(arrowEl, 'transform', 'translateX(-50%)');
        this.renderer.setStyle(arrowEl, 'border-width', '0 8px 8px 8px');
        this.renderer.setStyle(arrowEl, 'border-color', `transparent transparent ${arrowBgColor} transparent`);
        break;
      case 'left':
        this.renderer.setStyle(arrowEl, 'right', '-8px');
        this.renderer.setStyle(arrowEl, 'top', '50%');
        this.renderer.setStyle(arrowEl, 'transform', 'translateY(-50%)');
        this.renderer.setStyle(arrowEl, 'border-width', '8px 0 8px 8px');
        this.renderer.setStyle(arrowEl, 'border-color', `transparent transparent transparent ${arrowBgColor}`);
        break;
      case 'right':
        this.renderer.setStyle(arrowEl, 'left', '-8px');
        this.renderer.setStyle(arrowEl, 'top', '50%');
        this.renderer.setStyle(arrowEl, 'transform', 'translateY(-50%)');
        this.renderer.setStyle(arrowEl, 'border-width', '8px 8px 8px 0');
        this.renderer.setStyle(arrowEl, 'border-color', `transparent ${arrowBgColor} transparent transparent`);
        break;
    }

    this.renderer.appendChild(tooltipEl, arrowEl);

    // Dodaj do appendTo elementu
    this.renderer.appendChild(appendToElement, tooltipEl);
    this.appendedTooltipElement = tooltipEl;

    // Ustaw początkową pozycję (nadpisze style CSS z klasy position-*)
    this.renderer.setStyle(tooltipEl, 'top', '0px');
    this.renderer.setStyle(tooltipEl, 'left', '0px');

    // Oblicz pozycję
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.adjustAppendedTooltipPosition();

        // Ustaw końcowy transform w zależności od pozycji
        const finalPosition = this.config().position || 'top';
        let finalTransform = 'scale(1)';
        if (finalPosition === 'top' || finalPosition === 'bottom') {
          finalTransform = 'translateX(-50%) scale(1)';
        } else if (finalPosition === 'left' || finalPosition === 'right') {
          finalTransform = 'translateY(-50%) scale(1)';
        }

        this.renderer.setStyle(tooltipEl, 'opacity', '1');
        this.renderer.setStyle(tooltipEl, 'visibility', 'visible');
        this.renderer.setStyle(tooltipEl, 'transform', finalTransform);
      });
    });
  }

  private removeAppendedTooltip() {
    if (this.appendedTooltipElement && this.appendedTooltipElement.parentNode) {
      this.renderer.removeChild(this.appendedTooltipElement.parentNode, this.appendedTooltipElement);
      this.appendedTooltipElement = null;
      this.triggerElement = null;
    }
  }

  private adjustAppendedTooltipPosition() {
    if (!this.appendedTooltipElement || !this.triggerElement) return;

    const triggerRect = this.triggerElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 10;
    const gap = 10;

    const config = this.config();
    const position = config.position || 'top';

    // Pobierz wymiary tooltipa po jego utworzeniu
    const tooltipRect = this.appendedTooltipElement.getBoundingClientRect();
    const tooltipWidth = tooltipRect.width;
    const tooltipHeight = tooltipRect.height;

    let top = 0;
    let left = 0;

    // Oblicz podstawową pozycję w zależności od kierunku
    // Dla top/bottom używamy translateX(-50%), więc left powinien być na środku triggera
    // Dla left/right używamy translateY(-50%), więc top powinien być na środku triggera
    switch (position) {
      case 'top':
        top = triggerRect.top - tooltipHeight - gap;
        left = triggerRect.left + (triggerRect.width / 2);
        break;
      case 'bottom':
        top = triggerRect.bottom + gap;
        left = triggerRect.left + (triggerRect.width / 2);
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height / 2);
        left = triggerRect.left - tooltipWidth - gap;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height / 2);
        left = triggerRect.right + gap;
        break;
    }

    // Dostosuj pozycję, jeśli tooltip wychodzi poza viewport
    // Dla top/bottom: sprawdź czy tooltip (z translateX(-50%)) mieści się w viewport
    if (position === 'top' || position === 'bottom') {
      const halfWidth = tooltipWidth / 2;
      if (left - halfWidth < padding) {
        left = padding + halfWidth;
      } else if (left + halfWidth > viewportWidth - padding) {
        left = viewportWidth - padding - halfWidth;
      }
    } else {
      // Dla left/right: sprawdź czy tooltip mieści się w viewport
      if (left < padding) {
        left = padding;
      } else if (left + tooltipWidth > viewportWidth - padding) {
        left = viewportWidth - tooltipWidth - padding;
      }
    }

    // Dla left/right: sprawdź czy tooltip (z translateY(-50%)) mieści się w viewport
    if (position === 'left' || position === 'right') {
      const halfHeight = tooltipHeight / 2;
      if (top - halfHeight < padding) {
        top = padding + halfHeight;
      } else if (top + halfHeight > viewportHeight - padding) {
        top = viewportHeight - padding - halfHeight;
      }
    } else {
      // Dla top/bottom: sprawdź czy tooltip mieści się w viewport
      if (top < padding) {
        top = padding;
      } else if (top + tooltipHeight > viewportHeight - padding) {
        top = viewportHeight - tooltipHeight - padding;
      }
    }

    this.renderer.setStyle(this.appendedTooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.appendedTooltipElement, 'left', `${left}px`);
  }

  private adjustPosition() {
    const tooltipEl = this.tooltipContent()?.nativeElement;
    if (!tooltipEl) return;

    const rect = tooltipEl.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 10;

    let adjustX = 0;
    let adjustY = 0;

    if (rect.left < padding) {
      adjustX = padding - rect.left;
    } else if (rect.right > viewportWidth - padding) {
      adjustX = (viewportWidth - padding) - rect.right;
    }

    if (rect.top < padding) {
      adjustY = padding - rect.top;
    } else if (rect.bottom > viewportHeight - padding) {
      adjustY = (viewportHeight - padding) - rect.bottom;
    }

    if (adjustX !== 0) {
      tooltipEl.style.transform += ` translateX(${adjustX}px)`;
    }
    if (adjustY !== 0) {
      tooltipEl.style.transform += ` translateY(${adjustY}px)`;
    }
  }
}
