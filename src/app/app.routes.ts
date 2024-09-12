import { Routes } from '@angular/router';
import { StoreListComponent } from './components/store-list/store-list.component';
import { StoreFormComponent } from './components/store-form/store-form.component';
import { ReturnListComponent } from './components/return-list/return-list.component';
import { ReturnFormComponent } from './components/return-form/return-form.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';

export const routes: Routes = [
    {
      path: 'stores',
      loadComponent: () => import('./components/store-list/store-list.component').then(c => StoreListComponent)
    },
    {
      path: 'stores/new',
      loadComponent: () => import('./components/store-form/store-form.component').then(c => StoreFormComponent)
    },
    {
      path: 'stores/:id/edit',
      loadComponent: () => import('./components/store-form/store-form.component').then(c => StoreFormComponent)
    },
    {
      path: 'returns',
      loadComponent: () => import('./components/return-list/return-list.component').then(c => ReturnListComponent)
    },
    {
      path: 'returns/new',
      loadComponent: () => import('./components/return-form/return-form.component').then(c => ReturnFormComponent)
    },
    {
      path: 'returns/:id/edit',
      loadComponent: () => import('./components/return-form/return-form.component').then(c => ReturnFormComponent)
    },
    {
      path: 'products',
      loadComponent: () => import('./components/product-list/product-list.component').then(c => ProductListComponent)
    },
    {
      path: 'products/new',
      loadComponent: () => import('./components/product-form/product-form.component').then(c => ProductFormComponent)
    },
    {
      path: 'products/:id/edit',
      loadComponent: () => import('./components/product-form/product-form.component').then(c => ProductFormComponent)
    },
    { path: '', redirectTo: '/returns', pathMatch: 'full' },
    { path: '**', redirectTo: '/returns' }
  ];
