import { Routes } from '@angular/router';
import { ReservasListaPagina } from './paginas/lista/reservas-lista.pagina';
import { ReservaEditarPagina } from './paginas/editar/reserva-editar.pagina';

export const RESERVAS_ROUTES: Routes = [
  { path: '', component: ReservasListaPagina },
  { path: 'novo', component: ReservaEditarPagina },
  { path: ':id/editar', component: ReservaEditarPagina }
];
