import {Component, computed, input} from '@angular/core';
import {QueryParamsHandling, RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'flexmile-link',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './link.html',
  styleUrl: './link.scss',
})
export class Link {
  /** Tekst wyświetlany w linku */
  title = input.required<string>();

  /** Ścieżka URL do nawigacji */
  url = input.required<string | any[]>();

  /** Parametry query do dodania do URL */
  queryParams = input<{ [key: string]: any } | null>();

  /** Fragment URL (anchor, np. #section-1) */
  fragment = input<string>();

  /** Stan do przekazania podczas nawigacji */
  state = input<any>();

  /** Jak obsługiwać istniejące query params ('merge' | 'preserve' | '') */
  queryParamsHandling = input<QueryParamsHandling | null>();

  /** Czy zachować istniejący fragment */
  preserveFragment = input<boolean>(false);

  /** Czy pominąć aktualizację URL w przeglądarce */
  skipLocationChange = input<boolean>(false);

  /** Czy zastąpić aktualny wpis w historii */
  replaceUrl = input<boolean>(false);

  /** Target dla linka (_blank, _self, etc.) */
  target = input<string>();

  /** Relacja dla linka (np. 'noopener noreferrer' dla _blank) */
  rel = input<string>();

  /** Opcje dla routerLinkActive */
  routerLinkActiveOptions = input<{ exact: boolean }>({exact: false});

  /** Dodatkowe klasy CSS */
  customClass = input<string>();

  /** Aria label dla accessibility */
  ariaLabel = input<string>();

  /** Czy link jest disabled */
  disabled = input<boolean>(false);

  /** Ikona do wyświetlenia (HTML string lub emoji) */
  icon = input<string>();

  /** Pozycja ikony */
  iconPosition = input<'left' | 'right'>('left');

  /** Event emitowany przy kliknięciu */
  onClick = input<(event: MouseEvent) => void>();

  isDisabled = computed(() => this.disabled());

  isExternalLink = computed(() => {
    const currentUrl = this.url();

    if (Array.isArray(currentUrl)) {
      return false;
    }

    return this.hasProtocol(currentUrl);
  });

  private hasProtocol(url: string): boolean {
    return /^(?:[a-z][a-z0-9+\-.]*:|\/\/)/i.test(url);
  }

  handleClick(event: MouseEvent) {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const clickHandler = this.onClick();
    if (clickHandler) {
      clickHandler(event);
    }
  }
}
