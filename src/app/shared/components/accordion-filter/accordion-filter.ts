import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector:'app-accordion-filter',
    standalone:false,
    templateUrl:'./accordion-filter.html',
    styleUrl:'./accordion-filter.scss'
})

export class AccordionFilter{
     @Input() categories: any = [];
     @Input() isRatingFilter:boolean=false;

       @Output() selectionChange: EventEmitter<any[]> = new EventEmitter<any[]>();


       

  toggleSelection(item: any) {
    item.selected = !item.selected;
    this.emitSelected();
  }

  emitSelected() {
    const selected = this.categories
      .filter((item: { selected: any; }) => item.selected)
      .map((item: any) => ({ ...item })); // send a copy
    this.selectionChange.emit(selected);
  }
    }