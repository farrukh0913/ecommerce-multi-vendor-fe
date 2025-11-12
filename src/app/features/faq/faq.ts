import { Component } from '@angular/core';
import { FaqService } from '../../shared/services/faq.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-faq',
  standalone: false,
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq {
  breadcrumb = [
    {
      name: 'Home',
      path: '/',
    },
    {
      name: 'FAQs',
      path: null,
    },
  ];
  faqs: any = [];

  constructor(private faqService: FaqService, private spinner: NgxUiLoaderService) {}

  ngOnInit(): void {
    // fecth faqs from api
    this.fetchFaqs();
  }

  /**
   * fecth faqs
   */
  fetchFaqs() {
    this.spinner.start();
    this.faqService.getFaqs().subscribe({
      next: (data) => {
        this.spinner.stop();
        this.faqs = data;
        console.log('this.faqs: ', this.faqs);
      },
      error: (err) => {},
      complete: () => {
        this.spinner.stop();
      },
    });
  }

  /**
   * toggle faq item
   * @param index
   */
  toggleFAQ(index: number): void {
    this.faqs[index].open = !this.faqs[index].open;
  }

  /**
   * update helpful count
   * @param faq
   * @param type
   */
  updateHelpfulCount(faq: any, type: 'helpful' | 'not_helpful') {
    console.log('faq: ', faq);

    const payload = JSON.parse(JSON.stringify(faq));

    if (type === 'helpful') {
      payload.helpful_count++;
    } else {
      payload.not_helpful_count++;
    }

    // Remove fields that should not be updated
    delete payload.id;
    delete payload.slug;

    this.spinner.start();

    this.faqService.updateFaq(faq.id, payload).subscribe({
      next: () => {
        this.spinner.stop();
        this.fetchFaqs();
      },
      error: () => {
        this.spinner.stop();
      },
    });
  }
}
