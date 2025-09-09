import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Plan } from '../../core/models';

@Component({
  selector: 'app-plan-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="plan-detail">
      <div class="header">
        <a routerLink="/plans" class="back-link">← Torna ai Piani</a>
        <h2>Dettaglio Piano</h2>
      </div>

      <div *ngIf="loading" class="loading">
        Caricamento piano...
      </div>

      <div *ngIf="error" class="error-alert">
        {{ error }}
      </div>

      <div *ngIf="plan && !loading" class="plan-content">
        <div class="card plan-header">
          <h3>{{ plan.summary }}</h3>
          <div class="plan-meta">
            <p><strong>ID Piano:</strong> {{ plan.id }}</p>
            <p><strong>Creato il:</strong> {{ plan.createdAt | date:'full' }}</p>
          </div>
        </div>

        <div class="plan-week">
          <h4>Programma Settimanale</h4>
          <div class="days-grid">
            <div *ngFor="let day of plan.week" class="card day-card">
              <h5>{{ day.day }}</h5>
              <div class="exercises-list">
                <div *ngFor="let exercise of day.exercises; let i = index" class="exercise-item">
                  <span class="exercise-number">{{ i + 1 }}.</span>
                  <span class="exercise-name">{{ exercise }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .plan-detail {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .header {
      margin-bottom: 2rem;
    }
    
    .back-link {
      display: inline-block;
      color: #007bff;
      text-decoration: none;
      margin-bottom: 1rem;
      font-weight: 500;
    }
    
    .back-link:hover {
      text-decoration: underline;
    }
    
    .plan-detail h2 {
      margin: 0;
      color: #333;
    }
    
    .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
    
    .error-alert {
      background: #f8d7da;
      color: #721c24;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    
    .plan-header {
      margin-bottom: 2rem;
    }
    
    .plan-header h3 {
      margin: 0 0 1rem 0;
      color: #007bff;
      font-size: 1.5rem;
    }
    
    .plan-meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }
    
    .plan-meta p {
      margin: 0;
      color: #666;
      font-size: 0.95rem;
    }
    
    .plan-week h4 {
      margin: 0 0 1.5rem 0;
      color: #333;
      font-size: 1.25rem;
    }
    
    .days-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    
    .day-card {
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      border-left: 4px solid #007bff;
    }
    
    .day-card h5 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1.1rem;
      font-weight: 600;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #e9ecef;
    }
    
    .exercises-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .exercise-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.5rem;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 4px;
      transition: all 0.3s ease;
    }
    
    .exercise-item:hover {
      background: rgba(0, 123, 255, 0.05);
      transform: translateX(2px);
    }
    
    .exercise-number {
      background: #007bff;
      color: white;
      font-size: 0.75rem;
      font-weight: bold;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      min-width: 24px;
      text-align: center;
      flex-shrink: 0;
    }
    
    .exercise-name {
      color: #333;
      font-weight: 500;
      line-height: 1.4;
    }
    
    @media (max-width: 768px) {
      .days-grid {
        grid-template-columns: 1fr;
      }
      
      .plan-meta {
        grid-template-columns: 1fr;
      }
      
      .exercise-item {
        padding: 0.75rem;
      }
    }
    
    @media (max-width: 480px) {
      .days-grid {
        gap: 1rem;
      }
      
      .day-card {
        padding: 1rem;
      }
    }
  `]
})
export class PlanDetailComponent implements OnInit {
  plan: Plan | null = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const planId = this.route.snapshot.paramMap.get('id');
    if (planId) {
      this.loadPlan(planId);
    } else {
      this.error = 'ID piano non valido';
    }
  }

  loadPlan(id: string) {
    this.loading = true;
    this.error = '';
    
    this.apiService.getPlan(id).subscribe({
      next: (plan) => {
        this.plan = plan;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Errore nel caricamento del piano: ' + error.message;
        this.loading = false;
        
        setTimeout(() => {
          this.router.navigate(['/plans']);
        }, 3000);
      }
    });
  }
}