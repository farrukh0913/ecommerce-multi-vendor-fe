import { Component } from '@angular/core';
import { SharedService } from '../../../shared/services/sahared.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss'],
})
export class Cart {
  breadcrumb = [
    {
      name: 'Home',
      path: '/',
    },
    {
      name: 'Cart',
      path: null,
    },
  ];
  currentStep: number = 1;
  steps = [
    { label: 'Shopping Cart', index: 1 },
    { label: 'Checkout', index: 2 },
    { label: 'Order Complete', index: 3 },
  ];
  orderInfo: any = null;

  constructor(private sharedService: SharedService) {}

  /**
   * go to shopping step
   * @param step
   */
  goToStep(step: number) {
    if (step >= 1 && step <= this.currentStep && this.currentStep !== 3) {
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

  updateSteps(orderInfo: any, value: any) {
    this.orderInfo = orderInfo;
    this.currentStep = value;
    this.sharedService.triggerScrollTop();
  }
}
