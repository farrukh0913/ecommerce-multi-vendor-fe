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
  @Input() isSingleSelect = false;
  @Output() selectionChange = new EventEmitter<any[]>();
  baseCategories: any[] = [];
  /**
   * changes detect
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedItems'] && this.categories?.length) {
      this.syncSelections();
    }
    if (changes['categories']) {
      this.baseCategories = this.categories;
    }
  }

  /**
   * sync the changes with parent
   */
  private syncSelections() {
    this.categories.forEach((cat) => {
      cat.selected = this.selectedItems.some((si) => si.name === cat.name);
    });
  }

  /**
   * search the items from list
   * @param event
   */
  onSearch(event: any) {
    this.categories = this.baseCategories;
    const value = event.target.value.trim();
    this.categories = this.categories.filter((cat) => {
      return cat.name.toLowerCase().includes(value.toLowerCase());
    });
  }

  /**
   * change selected items
   * @param item
   */
  toggleSelection(item: any) {
    if (this.isSingleSelect) {
      this.categories.forEach((cat) => cat.selected = false);
      item.selected = !item.selected;
    } else {
      item.selected = !item.selected;
    }

    this.emitSelected();
  }

  /**
   * emit changes to parent
   */
  emitSelected() {
    const selected = this.categories.filter((c) => c.selected).map((c) => ({ ...c }));
    console.log('selected: ', selected);
    this.selectionChange.emit(selected);
  }
}
