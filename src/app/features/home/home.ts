import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  showDetailModal: boolean = false;
  tabs = ['Tops', 'Dresses', 'Winter Wear'];
  selectedTab = this.tabs[0];
  products = [
    {
      name: 'T-Shirt',
      image: 'https://laravel.pixelstrap.net/multikart/storage/49/fashion_173.jpg',
    },
    { name: 'Shoes', image: 'https://laravel.pixelstrap.net/multikart/storage/49/fashion_173.jpg' },
    { name: 'Cap', image: 'https://laravel.pixelstrap.net/multikart/storage/49/fashion_173.jpg' },
  ];
  
  /**
   * update tab selection value
   * @param tab 
   */
  selectTab(tab: string) {
    this.selectedTab = tab;
    // you can trigger filtering logic or API call here
  }
}
