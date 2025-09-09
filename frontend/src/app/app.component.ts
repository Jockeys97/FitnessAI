import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="container">
        <div class="nav-brand">
          <div class="logo">
            <div class="logo-icon">💪</div>
            <div class="logo-text">
              <span class="brand-name">FitnessAI</span>
              <span class="brand-subtitle">Powered by Gemini</span>
            </div>
          </div>
        </div>
        <div class="nav-links">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
            <span class="nav-icon">📊</span>
            <span>Dashboard</span>
          </a>
          <a routerLink="/questionnaire" routerLinkActive="active" class="nav-link">
            <span class="nav-icon">📝</span>
            <span>Crea Piano</span>
          </a>
          <a routerLink="/plans" routerLinkActive="active" class="nav-link">
            <span class="nav-icon">📋</span>
            <span>I Miei Piani</span>
          </a>
        </div>
        <div class="nav-cta">
          <button class="btn btn-primary btn-small" routerLink="/questionnaire">
            ✨ Nuovo Piano AI
          </button>
        </div>
      </div>
    </nav>
    
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-color);
      box-shadow: var(--shadow-medium);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    
    .navbar .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 24px;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .logo-icon {
      width: 48px;
      height: 48px;
      background: var(--gradient-primary);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      box-shadow: 0 4px 15px rgba(36, 165, 81, 0.3);
    }
    
    .logo-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    
    .brand-name {
      font-size: 1.5rem;
      font-weight: 800;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.02em;
    }
    
    .brand-subtitle {
      font-size: 0.75rem;
      color: var(--medium-gray);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .nav-links {
      display: flex;
      gap: 0.5rem;
    }
    
    .nav-link {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: var(--medium-gray);
      font-weight: 500;
      padding: 12px 16px;
      border-radius: 12px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    
    .nav-link:hover {
      color: var(--primary-green);
      background: rgba(36, 165, 81, 0.08);
      transform: translateY(-1px);
    }
    
    .nav-link.active {
      color: var(--primary-green);
      background: rgba(36, 165, 81, 0.1);
      font-weight: 600;
    }
    
    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 50%;
      transform: translateX(-50%);
      width: 24px;
      height: 3px;
      background: var(--gradient-primary);
      border-radius: 2px;
    }
    
    .nav-icon {
      font-size: 1.1rem;
      opacity: 0.8;
    }
    
    .nav-cta {
      display: flex;
      align-items: center;
    }
    
    .main-content {
      min-height: calc(100vh - 80px);
      padding-top: 2rem;
      padding-bottom: 3rem;
    }
    
    @media (max-width: 768px) {
      .navbar .container {
        padding: 1rem 16px;
      }
      
      .logo-text {
        display: none;
      }
      
      .nav-links {
        gap: 0.25rem;
      }
      
      .nav-link {
        padding: 10px 12px;
        font-size: 0.875rem;
      }
      
      .nav-link span:not(.nav-icon) {
        display: none;
      }
      
      .nav-cta .btn {
        font-size: 0.75rem;
        padding: 8px 12px;
      }
    }
  `]
})
export class AppComponent {
  title = 'fitness-planner';
}