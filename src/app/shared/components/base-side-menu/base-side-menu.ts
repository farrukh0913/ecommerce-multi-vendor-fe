import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-base-side-menu',
  standalone: false,
  templateUrl: './base-side-menu.html',
  styleUrl: './base-side-menu.scss',
})
export class BaseSideMenu {
  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.isOpen) this.close.emit();
  }
  @Input() title = 'Menu';
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  onBackdropClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('side-menu-backdrop')) {
      this.close.emit();
    }
  }
}
