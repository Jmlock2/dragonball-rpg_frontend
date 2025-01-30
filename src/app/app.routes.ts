import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'rpg',
    pathMatch: 'full',
  },
  {
    path: 'rpg',
    loadComponent: () => import('./rpg/rpg.page').then(m => m.RpgPage)
  },
  {
    path: 'select-character',
    loadComponent: () => import('./select-character/select-character.page').then( m => m.SelectCharacterPage)
  },
];
