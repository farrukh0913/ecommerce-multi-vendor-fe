import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './features/home/home';
const routes: Routes = [
  { path: '', component: Home ,data: { breadcrumb: 'Home' }},
  { path: 'news', component: Home ,data: { breadcrumb: 'News' }},
  { path: 'faq', component: Home ,data: { breadcrumb: 'FAQ' }},
  { path: 'contact', component: Home ,data: { breadcrumb: 'Contact Us' }},
  { path: '**', redirectTo: '' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
