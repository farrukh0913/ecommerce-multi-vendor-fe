import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  standalone: false,
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.scss',
})
export class ContactUs {
   breadcrumb=[
      {
      name:'Home',
      path:'/'
    },
    {
      name:'Contact',
      path:null
    },
  ]
  contacts = [
    {
      icon: 'fa-solid fa-location-dot',
      value: '1234 Street Name, City, State, 12345',
      title: 'Address',
    },
    {
      icon: 'fa-solid fa-phone',
      value: '(123) 456-7890',
      title: 'Phone',
    },
    {
      icon: 'fa-solid fa-envelope',
      value: 'example@gmail.com',
      title: 'For Query: Email us at',
    },
    {
      icon: 'fa-solid fa-calendar-days',
      value: 'MON – FRI / 09:00AM – 9:00PM',
      title: 'Working Days/Hours',
    },
  ];
}
