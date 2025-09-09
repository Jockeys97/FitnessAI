import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Plan } from '../../core/models';
import { exportCsv } from '../../shared/utils/export-csv';

@Component({
  selector: 'app-plans-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="plans-list">
      <!-- Hero Header -->
      <div class="hero-header">
        <div class="hero-content">
          <div class="hero-icon">📋</div>
          <div class="hero-text">
            <h1 class="hero-title">I Tuoi Piani AI</h1>
            <p class="hero-subtitle">Tutti i tuoi piani di allenamento personalizzati generati dall'intelligenza artificiale</p>
          </div>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-number">{{ plans.length }}</div>
            <div class="stat-label">Piani Creati</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">AI</div>
            <div class="stat-label">Powered</div>
          </div>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="action-bar">
        <div class="search-section">
          <div class="search-input-wrapper">
            <span class="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Cerca nei tuoi piani..."
              [(ngModel)]="searchTerm"
              (input)="filterPlans()"
              class="search-input"
            >
          </div>
        </div>
        <div class="action-buttons">
          <button 
            (click)="exportPlans()" 
            [disabled]="plans.length === 0"
            class="btn btn-outline"
          >
            <span class="btn-icon">📊</span>
            Export CSV
          </button>
          <a routerLink="/questionnaire" class="btn btn-primary">
            <span class="btn-icon">🚀</span>
            Nuovo Piano AI
          </a>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading-container">
        <div class="loading-card card">
          <div class="loading-icon">⏳</div>
          <h3>Caricamento piani...</h3>
          <p>Stiamo recuperando i tuoi piani fitness</p>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="alert alert-error error-container">
        <span class="alert-icon">❌</span>
        {{ error }}
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && plans.length === 0" class="empty-state">
        <div class="empty-card card">
          <div class="empty-icon">🏋️</div>
          <h3>Inizia la Tua Trasformazione</h3>
          <p>Non hai ancora creato nessun piano fitness. Lascia che l'AI crei il piano perfetto per te!</p>
          <div class="empty-features">
            <div class="feature-item">
              <span class="feature-icon">🤖</span>
              <span>Piani generati da Gemini AI</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">⚡</span>
              <span>Pronti in pochi secondi</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🎯</span>
              <span>100% personalizzati</span>
            </div>
          </div>
          <a routerLink="/questionnaire" class="btn btn-primary btn-large">
            <span class="btn-icon">✨</span>
            Crea il Tuo Primo Piano
          </a>
        </div>
      </div>

      <!-- Plans Grid -->
      <div *ngIf="!loading && filteredPlans.length > 0" class="plans-grid">
        <div *ngFor="let plan of filteredPlans" class="plan-card">
          <div class="plan-header">
            <div class="plan-icon">🏆</div>
            <div class="plan-meta">
              <div class="plan-id">{{ plan.id.substring(5, 13) }}</div>
              <div class="plan-date">{{ plan.createdAt | date:'dd/MM/yyyy' }}</div>
            </div>
          </div>
          
          <div class="plan-content">
            <h3 class="plan-title">{{ plan.summary }}</h3>
            <div class="plan-stats">
              <div class="stat-chip">
                <span class="stat-icon">📅</span>
                {{ plan.week?.length || 0 }} giorni
              </div>
              <div class="stat-chip stat-ai">
                <span class="stat-icon">🤖</span>
                Gemini AI
              </div>
              <div class="stat-chip stat-success">
                <span class="stat-icon">✅</span>
                Personalizzato
              </div>
            </div>
          </div>

          <div class="plan-actions">
            <a [routerLink]="['/plans', plan.id]" class="btn btn-outline plan-view-btn">
              <span class="btn-icon">👁️</span>
              Visualizza Piano
            </a>
            <button (click)="exportPlanPdf(plan)" class="btn btn-secondary">
              <span class="btn-icon">📑</span>
              Esporta PDF
            </button>
          </div>

          <div class="plan-footer">
            <div class="created-info">
              <span class="created-icon">⏰</span>
              Creato {{ plan.createdAt | date:'medium' }}
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div *ngIf="!loading && plans.length > 0 && filteredPlans.length === 0" class="no-results">
        <div class="no-results-card card">
          <div class="no-results-icon">🔍</div>
          <h3>Nessun risultato trovato</h3>
          <p>Non abbiamo trovato piani corrispondenti alla tua ricerca "{{ searchTerm }}"</p>
          <button (click)="clearSearch()" class="btn btn-outline">
            <span class="btn-icon">🔄</span>
            Cancella Ricerca
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .plans-list {
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Hero Header */
    .hero-header {
      background: var(--gradient-primary);
      margin: -2rem -2rem 3rem;
      padding: 3rem 2rem;
      padding-inline: clamp(16px, 4vw, 32px);
      border-radius: 0 0 24px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      overflow: hidden;
    }

    .hero-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="80" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="20" r="3" fill="white" opacity="0.1"/><circle cx="50" cy="50" r="2" fill="white" opacity="0.1"/></svg>');
      animation: float 20s ease-in-out infinite;
    }

    /* Contrast overlay to improve title readability */
    .hero-header::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: radial-gradient(900px 520px at 18% 40%, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.08) 60%, rgba(0,0,0,0) 78%);
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-5px) rotate(2deg); }
    }

    .hero-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      position: relative;
      z-index: 1;
    }

    .hero-icon {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      backdrop-filter: blur(10px);
      flex-shrink: 0;
    }

    .hero-title {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 800;
      color: white;
      background: none !important;
      -webkit-background-clip: initial !important;
      background-clip: initial !important;
      -webkit-text-fill-color: #ffffff !important;
      margin-bottom: 0.5rem;
      line-height: 1.1;
      text-shadow: 0 1px 2px rgba(0,0,0,0.35);
    }

    .hero-subtitle {
      font-size: 1.125rem;
      color: rgba(255, 255, 255, 0.94);
      margin: 0;
      max-width: 400px;
      text-shadow: 0 1px 2px rgba(0,0,0,0.35);
    }

    .hero-stats {
      display: flex;
      gap: 2rem;
      position: relative;
      z-index: 1;
    }

    .stat-item {
      text-align: center;
      color: white;
    }

    .stat-number {
      display: block;
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.875rem;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Action Bar */
    .action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      gap: 2rem;
      background: rgba(255, 255, 255, 0.95);
      padding: 1.5rem;
      border-radius: 16px;
      box-shadow: var(--shadow-medium);
      backdrop-filter: blur(10px);
    }

    .search-section {
      flex: 1;
      max-width: 400px;
    }

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 16px;
      font-size: 1.25rem;
      color: var(--medium-gray);
      z-index: 2;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px 12px 48px;
      border: 2px solid var(--border-color);
      border-radius: 12px;
      font-size: 1rem;
      background: white;
      transition: all 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--primary-green);
      box-shadow: 0 0 0 4px rgba(36, 165, 81, 0.1);
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .btn-icon {
      margin-right: 0.25rem;
    }

    .btn-ghost {
      background: transparent;
      color: var(--medium-gray);
      border: 1px solid var(--border-color);
    }

    .btn-ghost:hover:not(:disabled) {
      background: var(--light-gray);
      color: var(--dark-charcoal);
    }

    /* Loading State */
    .loading-container {
      display: flex;
      justify-content: center;
      margin: 3rem 0;
    }

    .loading-card {
      text-align: center;
      padding: 3rem;
      max-width: 400px;
    }

    .loading-icon {
      width: 80px;
      height: 80px;
      background: var(--gradient-primary);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin: 0 auto 1.5rem;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .loading-card h3 {
      color: var(--dark-charcoal);
      margin-bottom: 0.5rem;
    }

    .loading-card p {
      color: var(--medium-gray);
      margin: 0;
    }

    /* Error Container */
    .error-container {
      margin: 2rem 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .alert-icon {
      font-size: 1.25rem;
    }

    /* Empty State */
    .empty-state {
      display: flex;
      justify-content: center;
      margin: 3rem 0;
    }

    .empty-card {
      text-align: center;
      padding: 4rem 3rem;
      max-width: 500px;
    }

    .empty-icon {
      width: 100px;
      height: 100px;
      background: var(--gradient-primary);
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      margin: 0 auto 2rem;
      box-shadow: 0 12px 32px rgba(36, 165, 81, 0.3);
    }

    .empty-card h3 {
      font-size: 1.75rem;
      color: var(--dark-charcoal);
      margin-bottom: 1rem;
    }

    .empty-card p {
      color: var(--medium-gray);
      font-size: 1.125rem;
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .empty-features {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin: 2rem 0;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(36, 165, 81, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(36, 165, 81, 0.1);
    }

    .feature-icon {
      width: 40px;
      height: 40px;
      background: var(--gradient-primary);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    /* Plans Grid */
    .plans-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .plan-card {
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 2rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(10px);
    }

    .plan-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--gradient-primary);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .plan-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-large);
    }

    .plan-card:hover::before {
      opacity: 1;
    }

    .plan-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }

    .plan-icon {
      width: 56px;
      height: 56px;
      background: var(--gradient-primary);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      box-shadow: 0 8px 20px rgba(36, 165, 81, 0.3);
    }

    .plan-meta {
      text-align: right;
      font-size: 0.875rem;
    }

    .plan-id {
      font-family: monospace;
      color: var(--medium-gray);
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .plan-date {
      color: var(--medium-gray);
    }

    .plan-content {
      margin-bottom: 1.5rem;
    }

    .plan-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--dark-charcoal);
      margin-bottom: 1rem;
      line-height: 1.3;
    }

    .plan-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .stat-chip {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 6px 12px;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--dark-charcoal);
    }

    .stat-chip.stat-ai {
      background: rgba(36, 165, 81, 0.1);
      border-color: rgba(36, 165, 81, 0.2);
      color: var(--primary-green);
    }

    .stat-chip.stat-success {
      background: rgba(74, 144, 226, 0.1);
      border-color: rgba(74, 144, 226, 0.2);
      color: var(--accent-blue);
    }

    .stat-icon {
      font-size: 1rem;
    }

    .plan-actions {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    /* Make both action buttons share equal space and keep labels readable */
    .plan-actions .btn {
      flex: 1 1 0%;
      justify-content: center;
      align-items: center;
      min-height: 44px;
      padding-block: 10px;
      padding-inline: 12px;
      line-height: 1.2;
      min-width: 110px;
      font-size: 0.875rem;
      white-space: nowrap;
      overflow: visible;
    }

    /* Specific fix for outline view button to keep the original look but correct rendering */
    .plan-view-btn {
      background: #ffffff;
      border: 2px solid var(--primary-green);
      color: var(--primary-green);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1.2;
    }

    .plan-footer {
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);
    }

    .created-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--medium-gray);
      font-size: 0.875rem;
    }

    .created-icon {
      font-size: 1rem;
    }

    /* No Results */
    .no-results {
      display: flex;
      justify-content: center;
      margin: 3rem 0;
    }

    .no-results-card {
      text-align: center;
      padding: 3rem;
      max-width: 400px;
    }

    .no-results-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin: 0 auto 1.5rem;
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
    }

    .no-results-card h3 {
      color: var(--dark-charcoal);
      margin-bottom: 1rem;
    }

    .no-results-card p {
      color: var(--medium-gray);
      margin-bottom: 2rem;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .hero-header {
        flex-direction: column;
        gap: 2rem;
        text-align: center;
      }

      .hero-stats {
        justify-content: center;
      }

      .plans-grid {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .hero-header {
        margin: -1rem -1rem 2rem;
        padding: 2rem 1rem;
        padding-inline: clamp(12px, 6vw, 20px);
      }

      .action-bar {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .search-section {
        max-width: none;
      }

      .action-buttons {
        justify-content: center;
      }

      .hero-stats {
        gap: 1.5rem;
      }

      .stat-number {
        font-size: 2rem;
      }

      .plans-grid {
        grid-template-columns: 1fr;
      }

      .empty-features {
        gap: 0.75rem;
      }

      .feature-item {
        padding: 0.75rem;
      }
    }

    @media (max-width: 480px) {
      .hero-title {
        font-size: 1.75rem;
      }

      .hero-subtitle {
        font-size: 1rem;
      }

      .plan-card {
        padding: 1.5rem;
      }

      .plan-actions {
        flex-direction: column;
      }

      .action-buttons {
        flex-direction: column;
        gap: 0.75rem;
      }

      .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class PlansListComponent implements OnInit {
  // Plans list properties
  plans: Plan[] = [];
  filteredPlans: Plan[] = [];
  loading = false;
  error = '';
  searchTerm = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.loading = true;
    this.error = '';
    
    this.apiService.getPlans().subscribe({
      next: (plans) => {
        this.plans = plans;
        this.filteredPlans = plans;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Errore nel caricamento dei piani: ' + error.message;
        this.loading = false;
      }
    });
  }

  filterPlans() {
    if (!this.searchTerm.trim()) {
      this.filteredPlans = this.plans;
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredPlans = this.plans.filter(plan =>
        plan.summary.toLowerCase().includes(searchLower) ||
        plan.id.toLowerCase().includes(searchLower)
      );
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredPlans = this.plans;
  }

  // Deprecated: duplicate/delete not used anymore

  exportPlans() {
    if (this.plans.length === 0) return;
    
    const exportData = this.plans.map(plan => ({
      id: plan.id,
      summary: plan.summary,
      createdAt: plan.createdAt
    }));
    
    exportCsv(exportData, 'fitness-plans.csv');
  }

  exportPlanCsv(plan: Plan) {
    const exportData = [{
      id: plan.id,
      summary: plan.summary,
      createdAt: plan.createdAt,
      days: plan.week?.length || 0
    }];
    exportCsv(exportData, `plan-${plan.id}.csv`);
  }

  exportPlanPdf(plan: Plan) {
    // Lazy-load jsPDF to avoid adding it to initial bundle unless used
    import('jspdf').then(({ default: jsPDF }) => {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });

      const marginX = 48;
      let cursorY = 64;

      const addTitle = (text: string) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.text(text, marginX, cursorY);
        cursorY += 24;
      };

      const addSubtitle = (text: string) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(text, marginX, cursorY);
        cursorY += 18;
      };

      const addParagraph = (text: string) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        const maxWidth = 520;
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, marginX, cursorY);
        cursorY += lines.length * 14 + 8;
      };

      addTitle('Piano Fitness AI');
      addParagraph(`ID: ${plan.id}`);
      addParagraph(`Creato il: ${new Date(plan.createdAt).toLocaleString()}`);
      addParagraph(`Titolo: ${plan.summary}`);

      addSubtitle('Programma Settimanale');
      plan.week.forEach((day, index) => {
        addSubtitle(`${index + 1}. ${day.day}`);
        day.exercises.forEach((ex, i) => {
          addParagraph(`${i + 1}. ${ex}`);
        });

        // Page break if close to bottom
        if (cursorY > 740) {
          doc.addPage();
          cursorY = 64;
        }
      });

      doc.save(`plan-${plan.id}.pdf`);
    });
  }
}