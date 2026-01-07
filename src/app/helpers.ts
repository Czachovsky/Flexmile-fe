export function enumToList<T extends Record<string, string>>(enumObj: T) {
  return Object.entries(enumObj).map(([key, value]) => ({
    value: key,
    label: value,
  }));
}

interface ScrollToSectionOptions {
  /**
   * Pixels to offset from the top (sticky header height etc.).
   */
  offset?: number;
  /**
   * Scroll animation behaviour.
   */
  behavior?: ScrollBehavior;
  /**
   * Number of times the helper should retry aligning the element.
   * Useful when the layout shifts after async content loads.
   */
  maxRetries?: number;
  /**
   * Delay between retries (ms).
   */
  retryDelay?: number;
  /**
   * Allowed distance (px) between the element top and the intended offset.
   */
  threshold?: number;
}

export function scrollToSectionById(sectionId: string, options?: ScrollToSectionOptions): boolean {
  if (!sectionId) {
    return false;
  }

  const element = document.getElementById(sectionId);

  if (!element) {
    return false;
  }

  const offset = options?.offset ?? 0;
  const behavior = options?.behavior ?? 'smooth';
  const maxRetries = Math.max(options?.maxRetries ?? 3, 0);
  const retryDelay = options?.retryDelay ?? 150;
  const threshold = options?.threshold ?? 16;

  let attempt = 0;

  const performScroll = () => {
    const rect = element.getBoundingClientRect();
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
    const targetScrollY = currentScrollY + rect.top - offset;
    
    // Use scrollTo with absolute position for better reliability, especially on mobile
    window.scrollTo({
      top: targetScrollY,
      behavior,
    });
  };

  const scheduleRetry = () => {
    if (attempt >= maxRetries) {
      return;
    }
    attempt += 1;
    setTimeout(() => {
      const rect = element.getBoundingClientRect();
      const distanceFromTarget = rect.top - offset;

      if (Math.abs(distanceFromTarget) > threshold) {
        performScroll();
        scheduleRetry();
      }
    }, retryDelay);
  };

  performScroll();
  scheduleRetry();

  return true;
}
