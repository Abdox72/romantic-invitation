import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Abdo & Hodhod - Our Forever'
  },
  {
    path: 'our-story',
    loadComponent: () => import('./pages/our-story/our-story.component').then((m) => m.OurStoryComponent),
    title: 'Our Story'
  },
  {
    path: 'countdowns',
    loadComponent: () => import('./pages/countdowns/countdowns.component').then((m) => m.CountdownsComponent),
    title: 'Countdowns'
  },
  {
    path: 'bucket-list',
    loadComponent: () => import('./pages/bucket-list/bucket-list.component').then((m) => m.BucketListComponent),
    title: 'Bucket List'
  },
  {
    path: 'love-notes',
    loadComponent: () => import('./pages/love-notes/love-notes.component').then((m) => m.LoveNotesComponent),
    title: 'Love Notes'
  },
  {
    path: 'wedding-corner',
    loadComponent: () =>
      import('./pages/wedding-corner/wedding-corner.component').then((m) => m.WeddingCornerComponent),
    title: 'Wedding Corner'
  },
  { path: '**', redirectTo: '' }
];
