import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-accordion-filter',
  standalone: false,
  templateUrl: './accordion-filter.html',
  styleUrl: './accordion-filter.scss',
})
export class AccordionFilter {
  @Input() categories: any[] = [];
  @Input() selectedItems: any[] = [];
  @Input() isRatingFilter = false;
  @Output() selectionChange = new EventEmitter<any[]>();
  baseCategories: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedItems'] && this.categories?.length) {
      this.syncSelections();
    }
    if (changes['categories']) {
      this.baseCategories = this.categories;
    }
  }

  private syncSelections() {
    this.categories.forEach((cat) => {
      cat.selected = this.selectedItems.some((si) => si.name === cat.name);
    });
  }
  onSearch(event: any) {
    this.categories = this.baseCategories;
    const value = event.target.value.trim();
    this.categories = this.categories.filter((cat) => {
      return cat.name.toLowerCase().includes(value.toLowerCase());
    });
  }

  toggleSelection(item: any) {
    item.selected = !item.selected;
    this.emitSelected();
  }

  emitSelected() {
    const selected = this.categories.filter((c) => c.selected).map((c) => ({ ...c }));
    this.selectionChange.emit(selected);
  }
}
