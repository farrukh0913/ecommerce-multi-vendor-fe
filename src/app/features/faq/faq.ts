import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  standalone: false,
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq {
   breadcrumb=[
      {
      name:'Home',
      path:'/'
    },
    {
      name:'FAQs',
      path:null
    },
  ]
  faqs = [
    {
      question: 'How can I place an order?',
      answer:
        'Simply navigate to our Design Tool or Shop Now page, customize your product, and proceed to checkout securely.',
      open: false,
    },
    {
      question: 'Do you offer worldwide shipping?',
      answer:
        'Yes! We deliver across multiple countries with trusted courier services to ensure timely delivery.',
      open: false,
    },
    {
      question: 'Can I customize my order?',
      answer:
        'Absolutely! Our design tool allows you to personalize colors, text, and more before placing your order.',
      open: false,
    },
    {
      question: 'What is your return policy?',
      answer:
        'We accept returns within 14 days of delivery for unused and undamaged products. Read our policy for full details.',
      open: false,
    },
  ];

  /**
   * toggle faq item
   * @param index
   */
  toggleFAQ(index: number): void {
    this.faqs[index].open = !this.faqs[index].open;
  }
}
