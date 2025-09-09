import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              Trasforma il tuo <span class="highlight">Fitness</span><br>
              con l'Intelligenza Artificiale
            </h1>
            <p class="hero-subtitle">
              Piani di allenamento personalizzati generati da Gemini AI.<br>
              Professionali, efficaci e adattati alle tue esigenze specifiche.
            </p>
            <div class="hero-actions">
              <button class="btn btn-primary btn-large" routerLink="/questionnaire">
                🚀 Crea il Tuo Piano AI
              </button>
              <button class="btn btn-secondary btn-large" routerLink="/plans">
                📋 I Miei Piani
              </button>
            </div>
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">{{ totalPlans }}</span>
                <span class="stat-label">Piani Creati</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">100%</span>
                <span class="stat-label">Personalizzati</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">AI</span>
                <span class="stat-label">Powered</span>
              </div>
            </div>
          </div>
          <div class="hero-visual">
            <div class="fitness-card">
              <div class="card-header">
                <div class="card-icon">💪</div>
                <div class="card-title">Piano Generato da AI</div>
              </div>
              <div class="card-content">
                <div class="progress-bar">
                  <div class="progress-fill"></div>
                </div>
                <div class="card-stats">
                  <div class="card-stat">
                    <span class="label">Livello</span>
                    <span class="value">{{ currentUserLevel }}</span>
                  </div>
                  <div class="card-stat">
                    <span class="label">Obiettivo</span>
                    <span class="value">{{ currentUserGoal }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="section-header">
          <h2>Perché scegliere FitnessAI?</h2>
          <p>La combinazione perfetta tra esperienza professionale e tecnologia avanzata</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card card-primary">
            <div class="feature-icon">🤖</div>
            <h3>Intelligenza Artificiale Avanzata</h3>
            <p>Powered by Google Gemini 2.5 Flash per piani sempre aggiornati e scientificamente accurati</p>
          </div>
          
          <div class="feature-card card-accent">
            <div class="feature-icon">🎯</div>
            <h3>100% Personalizzati</h3>
            <p>Ogni piano è unico, creato specificatamente per te considerando età, livello e obiettivi</p>
          </div>
          
          <div class="feature-card card-primary">
            <div class="feature-icon">⚡</div>
            <h3>Risultati in Secondi</h3>
            <p>Genera piani professionali in meno di 10 secondi, pronti per essere seguiti immediatamente</p>
          </div>
          
          <div class="feature-card card-accent">
            <div class="feature-icon">🏆</div>
            <h3>Standard Professionali</h3>
            <p>Basato su metodologie riconosciute nel settore fitness e personal training</p>
          </div>
        </div>
      </section>

      <!-- Quick Stats -->
      <section class="stats-section">
        <div class="section-header">
          <h2>La tua panoramica fitness</h2>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <h3>Piani Totali</h3>
              <p class="stat-number">{{ totalPlans }}</p>
              <span class="stat-trend">↗️ In crescita</span>
            </div>
          </div>
          
          <div class="stat-card card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-content">
              <h3>Ultimo Accesso</h3>
              <p class="stat-date">{{ lastUpdate | date:'medium' }}</p>
              <span class="stat-trend">🔥 Attivo</span>
            </div>
          </div>
          
          <div class="stat-card card">
            <div class="stat-icon">🎯</div>
            <div class="stat-content">
              <h3>Obiettivo Attuale</h3>
              <p class="stat-goal">{{ currentUserGoal || 'Non impostato' }}</p>
              <span class="stat-trend">💪 Focus</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Hero Section */
    .hero-section {
      padding: 4rem 0 6rem;
      /* Add horizontal breathing room while keeping full-bleed background */
      padding-inline: clamp(16px, 4vw, 32px);
      background: var(--gradient-primary);
      margin: -2rem -2rem 4rem;
      border-radius: 0 0 32px 32px;
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
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="2" fill="white" opacity="0.1"/><circle cx="40" cy="80" r="2" fill="white" opacity="0.1"/></svg>');
      animation: float 20s ease-in-out infinite;
    }

    /* Improve contrast behind left-side hero text without covering content */
    .hero-section::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      /* Smoother falloff to avoid visibile bordi dell'overlay */
      background: radial-gradient(1000px 620px at 18% 38%, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.08) 60%, rgba(0,0,0,0.0) 78%);
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    .hero-content {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 4rem;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .hero-text {
      max-width: 760px;
    }

    .hero-title {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 800;
      color: white;
      /* Force solid text color (override global h1 gradient) */
      background: none !important;
      -webkit-background-clip: initial !important;
      background-clip: initial !important;
      -webkit-text-fill-color: #ffffff !important;
      margin-bottom: 1.5rem;
      line-height: 1.1;
      /* Soften shadows for better readability */
      text-shadow: 0 1px 2px rgba(0,0,0,0.35);
      filter: none;
      text-wrap: balance;
    }

    .hero-title .highlight {
      color: white;
      background: none !important;
      -webkit-background-clip: initial !important;
      -webkit-text-fill-color: #ffffff !important;
      background-clip: initial !important;
      text-shadow: 0 1px 2px rgba(0,0,0,0.35);
      font-weight: 900;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.94);
      margin-bottom: 2rem;
      line-height: 1.6;
      text-shadow: 0 1px 2px rgba(0,0,0,0.35);
      font-weight: 500;
      max-width: 720px;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 3rem;
      flex-wrap: wrap;
    }

    /* Migliora contrasto del bottone outline nel hero su sfondo verde */
    .hero-section .btn-outline {
      color: rgba(255,255,255,0.96);
      border-color: rgba(255,255,255,0.75);
      background-color: rgba(255,255,255,0.06);
      text-shadow: 0 1px 1px rgba(0,0,0,0.25);
    }
    .hero-section .btn-outline:hover:not(:disabled) {
      background: var(--primary-green);
      color: #ffffff;
      border-color: transparent;
    }

    .hero-stats {
      display: flex;
      gap: 2rem;
      margin-top: 2rem;
    }

    .stat-item {
      text-align: center;
    }

    .stat-item .stat-number {
      display: block;
      font-size: 2rem;
      font-weight: 800;
      color: white;
      margin-bottom: 0.5rem;
    }

    .stat-item .stat-label {
      display: block;
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.8);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Hero Visual Card */
    .hero-visual {
      position: relative;
    }

    .fitness-card {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      transform: perspective(1000px) rotateY(-4deg) rotateX(4deg);
      transition: transform 0.3s ease;
    }

    .fitness-card:hover {
      transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .card-icon {
      width: 48px;
      height: 48px;
      background: var(--gradient-primary);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .card-title {
      font-weight: 600;
      color: var(--dark-charcoal);
      font-size: 1.125rem;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: rgba(2, 6, 23, 0.06);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 1.5rem;
    }

    .progress-fill {
      width: 78%;
      height: 100%;
      background: var(--gradient-primary);
      border-radius: 4px;
      animation: progress 2s ease-in-out infinite;
    }

    @keyframes progress {
      0%, 100% { width: 75%; }
      50% { width: 85%; }
    }

    .card-stats {
      display: flex;
      justify-content: space-between;
    }

    .card-stat {
      text-align: center;
    }

    .card-stat .label {
      display: block;
      font-size: 0.75rem;
      color: var(--medium-gray);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }

    .card-stat .value {
      display: block;
      font-weight: 600;
      color: var(--primary-green);
      font-size: 0.95rem;
    }

    /* Sections */
    section {
      margin-bottom: 3.5rem;
    }

    .section-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .section-header h2 {
      font-size: 2.25rem;
      margin-bottom: 1rem;
      color: var(--dark-charcoal);
    }

    .section-header p {
      font-size: 1.125rem;
      color: var(--medium-gray);
      max-width: 600px;
      margin: 0 auto;
    }

    /* Features Grid */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      text-align: center;
      padding: 2.5rem;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .feature-card:hover {
      transform: translateY(-8px);
      border-color: var(--primary-green);
    }

    .feature-icon {
      width: 80px;
      height: 80px;
      background: var(--gradient-primary);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin: 0 auto 1.5rem;
      box-shadow: 0 8px 24px rgba(36, 165, 81, 0.3);
    }

    .feature-card h3 {
      font-size: 1.375rem;
      margin-bottom: 1rem;
      color: var(--dark-charcoal);
    }

    .feature-card p {
      font-size: 1rem;
      line-height: 1.6;
      color: var(--medium-gray);
    }

    /* Stats Section */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 2rem;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
    }

    .stat-icon {
      width: 64px;
      height: 64px;
      background: var(--gradient-primary);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .stat-content h3 {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
      color: var(--dark-charcoal);
    }

    .stat-content .stat-number {
      font-size: 1.875rem;
      font-weight: 800;
      color: var(--primary-green);
      margin: 0;
      display: block;
    }

    .stat-content .stat-date,
    .stat-content .stat-goal {
      font-size: 1rem;
      color: var(--medium-gray);
      margin: 0;
      display: block;
    }

    .stat-trend {
      display: inline-block;
      padding: 4px 8px;
      background: rgba(36, 165, 81, 0.1);
      color: var(--primary-green);
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-top: 0.5rem;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .hero-content {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 2rem;
      }
      
      .hero-visual {
        max-width: 400px;
        margin: 0 auto;
      }

      .hero-section::after {
        background: radial-gradient(800px 520px at 50% 28%, rgba(0,0,0,0.22), transparent 60%);
      }
    }

    @media (max-width: 768px) {
      .hero-section {
        padding: 3rem 0 4rem;
        padding-inline: clamp(12px, 6vw, 20px);
        margin: -2rem -1rem 3rem;
      }
      
      .hero-actions {
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
      }
      .hero-text { max-width: none; }
      
      .hero-actions .btn {
        width: 100%;
        max-width: 300px;
      }
      
      .hero-stats {
        justify-content: center;
        gap: 1.5rem;
      }
      
      .features-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      
      .feature-card {
        padding: 2rem;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      
      .stat-card {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  // Dashboard properties
  totalPlans = 0;
  lastUpdate = new Date();
  currentUserLevel = 'Principiante';
  currentUserGoal = 'Perdita di Peso';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadStats();
  }

  private loadStats() {
    this.apiService.getPlans().subscribe({
      next: (plans) => {
        this.totalPlans = plans.length;
      },
      error: (error) => {
        console.error('Error loading plans:', error);
      }
    });
  }
}