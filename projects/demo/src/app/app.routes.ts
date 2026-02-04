import { Routes } from '@angular/router';
import { ShowcaseComponent } from './pages/showcase/showcase.component';

export const routes: Routes = [
  { path: '', redirectTo: 'showcase', pathMatch: 'full' },
  { path: 'showcase', component: ShowcaseComponent },
];
