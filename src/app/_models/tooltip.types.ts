export interface TooltipConfig {
  text: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  backgroundColor?: string;
  textColor?: string;
  multiline?: boolean;
  appendTo?: string | HTMLElement; // Selector (np. 'body') lub HTMLElement, do którego ma być dołączony tooltip
}
