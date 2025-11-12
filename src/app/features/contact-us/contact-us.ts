import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CmsService } from '../../shared/services/cms.service';
import { SharedService } from '../../shared/services/sahared.service';

@Component({
  selector: 'app-contact-us',
  standalone: false,
  templateUrl: './contact-us.html',
  styleUrls: ['./contact-us.scss'],
})
export class ContactUs implements OnInit {
  breadcrumb = [
    { name: 'Home', path: '/' },
    { name: 'Contact', path: null },
  ];

  contacts = [
    {
      icon: 'fa-solid fa-location-dot',
      value: '1234 Street Name, City, State, 12345',
      title: 'Address',
    },
    { icon: 'fa-solid fa-phone', value: '(123) 456-7890', title: 'Phone' },
    { icon: 'fa-solid fa-envelope', value: 'example@gmail.com', title: 'For Query: Email us at' },
    {
      icon: 'fa-solid fa-calendar-days',
      value: 'MON – FRI / 09:00AM – 9:00PM',
      title: 'Working Days/Hours',
    },
  ];

  contactForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxUiLoaderService,
    private cmsService: CmsService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  /**
   * submit user contect info
   * @returns
   */
  submitContactForm() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    const payload = this.contactForm.value;
    this.spinner.start();
    this.cmsService.createContactMessage(payload).subscribe({
      next: (res) => {
        this.spinner.stop();
        this.sharedService.showToast('Your message has been sent successfully!');
        this.contactForm.reset();
      },
      error: (err) => {
        this.spinner.stop();
        console.error('Error sending contact message:', err);
        this.sharedService.showToast('Failed to send your message. Please try again.', 'error');
      },
    });
  }
  
}
