import { Routes, CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isAuthenticated$; // ✅ Solo accede si está autenticado
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'rpg',
    loadComponent: () => import('./rpg/rpg.page').then(m => m.RpgPage),
    // canActivate: [authGuard]
  },
  {
    path: 'select-character',
    loadComponent: () => import('./select-character/select-character.page').then(m => m.SelectCharacterPage),
    // canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'battle',
    loadComponent: () => import('./battle/battle.page').then( m => m.BattlePage)
  },
  {
    path: 'ranking',
    loadComponent: () => import('./ranking/ranking.page').then( m => m.RankingPage)
  },
];
