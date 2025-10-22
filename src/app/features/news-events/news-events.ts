import { Component } from '@angular/core';

@Component({
  selector: 'app-news-events',
  standalone: false,
  templateUrl: './news-events.html',
  styleUrl: './news-events.scss',
})
export class NewsEvents {
  newsEvents = [
    {
      title: 'Autumn Collection Launch',
      description:
        'Join us as we unveil our brand-new autumn collection with live demos and offers.',
      date: 'October 30, 2025',
      image:
        'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Community Design Meetup',
      description: 'A gathering of creative minds! Network, learn, and share your design stories.',
      date: 'November 12, 2025',
      image:
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Holiday Discount Week',
      description: 'Celebrate with exclusive deals, giveaways, and festive surprises!',
      date: 'December 1–7, 2025',
      image:
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    },
  ];
}
