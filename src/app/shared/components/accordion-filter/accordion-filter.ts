import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-accordion-filter',
  standalone: false,
  templateUrl: './accordion-filter.html',
  styleUrl: './accordion-filter.scss',
})
export class AccordionFilter {
  @Input() categories: any = [];
  @Input() isRatingFilter: boolean = false;
}
