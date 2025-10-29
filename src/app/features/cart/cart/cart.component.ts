import { Component } from '@angular/core';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class Cart {
  breadcrumb=[
      {
      name:'Home',
      path:'/'
    },
    {
      name:'Cart',
      path:null
    },
  ]
  currentStep: number = 1;
  steps = [
    { label: 'Shopping Cart', index: 1 },
    { label: 'Checkout', index: 2 },
    { label: 'Order Complete', index: 3 },
  ];

  /**
   * go to shopping step
   * @param step
   */
  goToStep(step: number) {
    if (step >= 1 && step <= this.steps.length) {
      this.currentStep = step;
    }
  }

  /**
   * get current tab class
   * @param stepIndex
   * @returns
   */
  getStepClass(stepIndex: number): string {
    if (stepIndex < this.currentStep) return 'completed';
    if (stepIndex === this.currentStep) return 'active';
    return '';
  }
}
