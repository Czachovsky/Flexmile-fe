import {
  Component,
  input,
  InputSignal,
  ElementRef,
  viewChild,
  signal,
  computed
} from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { TooltipConfig } from '@models/tooltip.types';

@Component({
  selector: 'flexmile-tooltip',
  imports: [NgClass, NgStyle],
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.scss',
})
export class Tooltip {
  config: InputSignal<TooltipConfig> = input<TooltipConfig>({
    text: '',
    position: 'top',
    multiline: false,
  });

  visible = signal(false);
  private tooltipContent = viewChild<ElementRef>('tooltipContent');
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
    this.visible.set(true);
    this.positionCalculated.set(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.adjustPosition();
        this.positionCalculated.set(true);
      });
    });
  }

  hide() {
    this.visible.set(false);
    this.positionCalculated.set(false);
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
