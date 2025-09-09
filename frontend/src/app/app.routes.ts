import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent)
  },
  {
    path: 'questionnaire',
    loadComponent: () => import('./features/questionnaire/questionnaire.component').then(c => c.QuestionnaireComponent)
  },
  {
    path: 'plans',
    loadComponent: () => import('./features/plans/plans-list.component').then(c => c.PlansListComponent)
  },
  {
    path: 'plans/:id',
    loadComponent: () => import('./features/plans/plan-detail.component').then(c => c.PlanDetailComponent)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];