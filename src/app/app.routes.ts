import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'reservas',
    loadChildren: () => import('./funcionalidades/reservas/reservas.rotas').then(m => m.RESERVAS_ROUTES)
  },
  { path: '', pathMatch: 'full', redirectTo: 'reservas' },
  { path: '**', redirectTo: 'reservas' }
];
