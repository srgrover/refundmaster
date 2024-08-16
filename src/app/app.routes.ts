import { Routes } from '@angular/router';
import { StoreListComponent } from './components/store-list/store-list.component';

export const routes: Routes = [
    {
      path: 'stores',
      loadComponent: () => import('./components/store-list/store-list.component').then(c => StoreListComponent)
    },
    { path: '', redirectTo: '/stores', pathMatch: 'full' },  // Redirecciona la ruta base a 'stores'
    { path: '**', redirectTo: '/stores' }  // Redirecciona cualquier ruta no encontrada a 'stores'
  ];
