import { Component } from '@angular/core';
import { CmsService } from '../../shared/services/cms.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-news-events',
  standalone: false,
  templateUrl: './news-events.html',
  styleUrl: './news-events.scss',
})
export class NewsEvents {
  breadcrumb = [
    {
      name: 'Home',
      path: '/',
    },
    {
      name: 'News And Events',
      path: null,
    },
  ];
  newsArticles: any = [];
  events: any = [];
  r2BaseUrl: string = environment.r2BaseUrl + '/';

  constructor(private cmsService: CmsService, private spinner: NgxUiLoaderService) {}

  ngOnInit(): void {
    // fecth news and events from api
    this.fetchNewsAndEvents();
  }

  fetchNewsAndEvents() {
    this.spinner.start();
    forkJoin({
      events: this.cmsService.getEvents(),
      news: this.cmsService.getNewsArticles(),
    }).subscribe({
      next: (results) => {
        this.spinner.stop();
        this.events = results.events;
        this.newsArticles = results.news;
      },
      error: (err) => {
        this.spinner.stop();
      },
    });
  }
}
