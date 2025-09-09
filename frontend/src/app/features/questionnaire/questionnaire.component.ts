import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Plan, Level, Goal } from '../../core/models';

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="questionnaire">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <div class="hero-icon">🤖</div>
          <h1 class="hero-title">Crea il Tuo Piano AI</h1>
          <p class="hero-subtitle">
            Rispondi a poche domande e lascia che l'intelligenza artificiale 
            crei un piano di allenamento perfetto per te
          </p>
        </div>
      </div>

      <!-- Questionnaire Form -->
      <div class="form-container">
        <form [formGroup]="questionnaireForm" (ngSubmit)="onSubmit()" class="questionnaire-form">
          <div class="form-header">
            <h2>Le tue informazioni</h2>
            <p>Aiutaci a conoscerti meglio per creare il piano perfetto</p>
          </div>

          <div class="form-grid">
            <!-- Age Section -->
            <div class="form-section">
              <div class="section-icon">👤</div>
              <div class="form-group">
                <label for="age">
                  <span class="label-text">Età</span>
                  <span class="label-required">*</span>
                </label>
                <input
                  id="age"
                  type="number"
                  formControlName="age"
                  [class.error]="isFieldInvalid('age')"
                  min="16"
                  max="100"
                  placeholder="Es. 25"
                >
                <div *ngIf="isFieldInvalid('age')" class="alert alert-error">
                  ⚠️ Età richiesta (minimo 16 anni)
                </div>
              </div>
            </div>

            <!-- Level Section -->
            <div class="form-section">
              <div class="section-icon">💪</div>
              <div class="form-group">
                <label for="level">
                  <span class="label-text">Livello di Fitness</span>
                  <span class="label-required">*</span>
                </label>
                <div class="select-wrapper">
                  <select id="level" formControlName="level" [class.error]="isFieldInvalid('level')">
                    <option value="">Seleziona il tuo livello</option>
                    <option value="beginner">🌱 Principiante - Poca o nessuna esperienza</option>
                    <option value="intermediate">🏃 Intermedio - Qualche mese di esperienza</option>
                    <option value="advanced">🏆 Avanzato - Anni di allenamento costante</option>
                  </select>
                </div>
                <div *ngIf="isFieldInvalid('level')" class="alert alert-error">
                  ⚠️ Seleziona il tuo livello di fitness
                </div>
              </div>
            </div>

            <!-- Goal Section -->
            <div class="form-section">
              <div class="section-icon">🎯</div>
              <div class="form-group">
                <label for="goal">
                  <span class="label-text">Obiettivo Principale</span>
                  <span class="label-required">*</span>
                </label>
                <div class="select-wrapper">
                  <select id="goal" formControlName="goal" [class.error]="isFieldInvalid('goal')">
                    <option value="">Qual è il tuo obiettivo?</option>
                    <option value="fat_loss">🔥 Perdita di Peso e Definizione</option>
                    <option value="muscle_gain">💪 Aumento Massa Muscolare</option>
                    <option value="performance">⚡ Miglioramento Performance</option>
                  </select>
                </div>
                <div *ngIf="isFieldInvalid('goal')" class="alert alert-error">
                  ⚠️ Seleziona il tuo obiettivo principale
                </div>
              </div>
            </div>

            <!-- Days per week -->
            <div class="form-section">
              <div class="section-icon">📅</div>
              <div class="form-group">
                <label for="daysPerWeek">
                  <span class="label-text">Giorni a Settimana</span>
                  <span class="label-required">*</span>
                </label>
                <input
                  id="daysPerWeek"
                  type="number"
                  formControlName="daysPerWeek"
                  [class.error]="isFieldInvalid('daysPerWeek')"
                  min="1"
                  max="7"
                  placeholder="Es. 3"
                >
                <div class="field-hint">Quanti giorni puoi allenarti a settimana?</div>
                <div *ngIf="isFieldInvalid('daysPerWeek')" class="alert alert-error">
                  ⚠️ Inserisci un numero tra 1 e 7
                </div>
              </div>
            </div>
          </div>

          <!-- Physical info section -->
          <div class="form-section full-width">
            <div class="section-header">
              <div class="section-icon">📏</div>
              <div class="section-title">
                <h3>Informazioni Fisiche (opzionale)</h3>
                <p>Aiutano l'AI a personalizzare meglio il tuo piano</p>
              </div>
            </div>
            
            <div class="physical-grid">
              <div class="form-group">
                <label for="height">Altezza (cm)</label>
                <input
                  id="height"
                  type="number"
                  formControlName="height"
                  min="120"
                  max="220"
                  placeholder="Es. 175"
                >
              </div>
              <div class="form-group">
                <label for="weight">Peso (kg)</label>
                <input
                  id="weight"
                  type="number"
                  formControlName="weight"
                  min="30"
                  max="200"
                  placeholder="Es. 70"
                >
              </div>
            </div>
          </div>

          <!-- Constraints -->
          <div class="form-section full-width">
            <div class="section-header">
              <div class="section-icon">⚠️</div>
              <div class="section-title">
                <h3>Vincoli o Limitazioni</h3>
                <p>Eventuali problemi fisici o limitazioni di tempo</p>
              </div>
            </div>
            <div class="form-group">
              <textarea
                id="constraints"
                formControlName="constraints"
                rows="3"
                placeholder="Es. problemi al ginocchio, tempo limitato, nessuna attrezzatura..."
              ></textarea>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="form-actions">
            <button
              type="submit"
              [disabled]="questionnaireForm.invalid || loading"
              class="btn btn-primary btn-large generate-btn"
            >
              <span class="btn-icon">{{ loading ? '⏳' : '🚀' }}</span>
              {{ loading ? 'Generando il tuo piano AI...' : 'Genera Piano con AI' }}
            </button>
            <p class="generate-note">
              Il tuo piano sarà generato da Gemini AI in pochi secondi
            </p>
          </div>
        </form>
      </div>

      <!-- Generated Plan Preview -->
      <div *ngIf="generatedPlan" class="plan-preview-container">
        <div class="plan-preview card card-primary">
          <div class="plan-header">
            <div class="plan-icon">✨</div>
            <div class="plan-title">
              <h3>Il Tuo Piano AI è Pronto!</h3>
              <p>Generato da Gemini AI • {{ generatedPlan.createdAt | date:'medium' }}</p>
            </div>
          </div>
          
          <div class="plan-summary">
            <div class="summary-card">
              <div class="summary-icon">📋</div>
              <div class="summary-content">
                <h4>{{ generatedPlan.summary }}</h4>
                <div class="summary-stats">
                  <span class="stat-badge">{{ generatedPlan.week.length }} giorni</span>
                  <span class="stat-badge badge-success">AI Personalizzato</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="plan-week">
            <div *ngFor="let day of generatedPlan.week" class="day-card">
              <div class="day-header">
                <div class="day-icon">🏋️</div>
                <h5>{{ day.day }}</h5>
              </div>
              <div class="exercises-list">
                <div *ngFor="let exercise of day.exercises" class="exercise-item">
                  {{ exercise }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="plan-actions">
            <button (click)="savePlan()" class="btn btn-accent btn-large" [disabled]="saving">
              <span class="btn-icon">{{ saving ? '💾' : '📁' }}</span>
              {{ saving ? 'Salvando...' : 'Salva Piano' }}
            </button>
            <button (click)="generateNew()" class="btn btn-outline" [disabled]="loading">
              🔄 Genera Nuovo Piano
            </button>
          </div>
        </div>
      </div>

      <!-- Error Alert -->
      <div *ngIf="error" class="alert alert-error error-container">
        <span class="alert-icon">❌</span>
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .questionnaire {
      max-width: 1000px;
      margin: 0 auto;
    }

    /* Hero Section */
    .hero-section {
      background: var(--gradient-primary);
      margin: -2rem -2rem 3rem;
      padding: 3rem 2rem;
      border-radius: 0 0 24px 24px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .hero-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="25" cy="25" r="3" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="2" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="2" fill="white" opacity="0.1"/></svg>');
      animation: float 15s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-5px); }
    }

    .hero-content {
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
      margin: 0 auto 1.5rem;
      backdrop-filter: blur(10px);
    }

    .hero-title {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 800;
      color: white;
      margin-bottom: 1rem;
      line-height: 1.1;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.9);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* Form Container */
    .form-container {
      margin-bottom: 3rem;
    }

    .questionnaire-form {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 2.5rem;
      box-shadow: var(--shadow-large);
      border: 1px solid var(--border-color);
    }

    .form-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .form-header h2 {
      font-size: 2rem;
      color: var(--dark-charcoal);
      margin-bottom: 0.5rem;
    }

    .form-header p {
      color: var(--medium-gray);
      font-size: 1.1rem;
    }

    /* Form Grid */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .form-section {
      position: relative;
    }

    .form-section.full-width {
      grid-column: 1 / -1;
    }

    .section-icon {
      width: 48px;
      height: 48px;
      background: var(--gradient-primary);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      margin-bottom: 1rem;
      box-shadow: 0 4px 12px rgba(36, 165, 81, 0.3);
    }

    .section-header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .section-title h3 {
      font-size: 1.25rem;
      color: var(--dark-charcoal);
      margin-bottom: 0.25rem;
    }

    .section-title p {
      color: var(--medium-gray);
      font-size: 0.95rem;
      margin: 0;
    }

    /* Form Elements */
    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      margin-bottom: 0.75rem;
      font-weight: 600;
      color: var(--dark-charcoal);
      font-size: 0.95rem;
    }

    .label-text {
      color: var(--dark-charcoal);
    }

    .label-required {
      color: var(--accent-orange);
      font-weight: 800;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid var(--border-color);
      border-radius: 12px;
      font-size: 1rem;
      font-family: inherit;
      background: rgba(255, 255, 255, 0.8);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--primary-green);
      background: white;
      box-shadow: 0 0 0 4px rgba(36, 165, 81, 0.1);
      transform: translateY(-1px);
    }

    .form-group input.error,
    .form-group select.error {
      border-color: #ef4444;
      box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
    }

    .select-wrapper {
      position: relative;
    }

    .select-wrapper::after {
      content: '▼';
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--medium-gray);
      pointer-events: none;
      font-size: 0.75rem;
    }

    .field-hint {
      font-size: 0.875rem;
      color: var(--medium-gray);
      margin-top: 0.5rem;
      font-style: italic;
    }

    /* Physical Info Grid */
    .physical-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    /* Form Actions */
    .form-actions {
      text-align: center;
      padding-top: 2rem;
      border-top: 2px solid var(--border-color);
    }

    .generate-btn {
      min-width: 280px;
      position: relative;
      overflow: hidden;
    }

    .generate-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }

    .generate-btn:hover:not(:disabled)::before {
      left: 100%;
    }

    .btn-icon {
      margin-right: 0.5rem;
      font-size: 1.1em;
    }

    .generate-note {
      margin-top: 1rem;
      color: var(--medium-gray);
      font-size: 0.9rem;
    }

    /* Plan Preview */
    .plan-preview-container {
      margin-top: 3rem;
    }

    .plan-preview {
      animation: slideInUp 0.5s ease-out;
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .plan-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid var(--border-color);
    }

    .plan-icon {
      width: 64px;
      height: 64px;
      background: var(--gradient-primary);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      box-shadow: 0 8px 24px rgba(36, 165, 81, 0.3);
    }

    .plan-title h3 {
      font-size: 1.75rem;
      color: var(--dark-charcoal);
      margin-bottom: 0.25rem;
    }

    .plan-title p {
      color: var(--medium-gray);
      margin: 0;
    }

    /* Plan Summary */
    .summary-card {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      background: rgba(36, 165, 81, 0.05);
      padding: 1.5rem;
      border-radius: 16px;
      border: 1px solid rgba(36, 165, 81, 0.1);
      margin-bottom: 2rem;
    }

    .summary-icon {
      width: 48px;
      height: 48px;
      background: var(--gradient-primary);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .summary-content h4 {
      font-size: 1.25rem;
      color: var(--dark-charcoal);
      margin-bottom: 0.75rem;
    }

    .summary-stats {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .stat-badge {
      padding: 6px 12px;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--dark-charcoal);
    }

    /* Plan Week */
    .plan-week {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .day-card {
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 1.5rem;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .day-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--gradient-primary);
    }

    .day-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-medium);
    }

    .day-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .day-icon {
      width: 36px;
      height: 36px;
      background: var(--gradient-primary);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }

    .day-header h5 {
      font-size: 1.1rem;
      color: var(--dark-charcoal);
      margin: 0;
      font-weight: 700;
    }

    .exercises-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .exercise-item {
      padding: 0.75rem;
      background: rgba(36, 165, 81, 0.05);
      border-radius: 8px;
      border-left: 3px solid var(--primary-green);
      font-size: 0.95rem;
      color: var(--dark-charcoal);
      font-weight: 500;
    }

    /* Plan Actions */
    .plan-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    /* Error Container */
    .error-container {
      margin-top: 2rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .alert-icon {
      font-size: 1.25rem;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero-section {
        margin: -1rem -1rem 2rem;
        padding: 2rem 1rem;
      }

      .questionnaire-form {
        padding: 2rem 1.5rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .physical-grid {
        grid-template-columns: 1fr;
      }

      .plan-actions {
        flex-direction: column;
        align-items: center;
      }

      .generate-btn {
        min-width: auto;
        width: 100%;
      }
    }

    @media (max-width: 480px) {
      .hero-title {
        font-size: 1.75rem;
      }

      .hero-subtitle {
        font-size: 1rem;
      }

      .questionnaire-form {
        padding: 1.5rem;
      }

      .section-header {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
      }

      .summary-card {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }

      .plan-week {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class QuestionnaireComponent {
  questionnaireForm: FormGroup;
  generatedPlan: Plan | null = null;
  loading = false;
  saving = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.questionnaireForm = this.fb.group({
      age: ['', [Validators.required, Validators.min(16)]],
      level: ['', Validators.required],
      goal: ['', Validators.required],
      daysPerWeek: ['', [Validators.required, Validators.min(1), Validators.max(7)]],
      height: [''],
      weight: [''],
      constraints: ['']
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.questionnaireForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.questionnaireForm.valid) {
      this.loading = true;
      this.error = '';
      
      const formValue = this.questionnaireForm.value;
      
      this.apiService.postPlanFromAI(formValue).subscribe({
        next: (plan) => {
          this.generatedPlan = plan;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Errore nella generazione del piano: ' + error.message;
          this.loading = false;
        }
      });
    }
  }

  savePlan() {
    if (this.generatedPlan) {
      this.saving = true;
      
      this.apiService.savePlan(this.generatedPlan).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/plans', this.generatedPlan!.id]);
        },
        error: (error) => {
          this.error = 'Errore nel salvare il piano: ' + error.message;
          this.saving = false;
        }
      });
    }
  }

  generateNew() {
    // Reset form and generate new plan
    this.generatedPlan = null;
    this.error = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}