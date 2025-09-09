# 🏋️ FitnessAI - AI-Powered Fitness Planner

Un'applicazione moderna per la generazione di piani fitness personalizzati utilizzando l'intelligenza artificiale di Google Gemini.

## 🚀 Features

- 🤖 **AI-Powered**: Piani fitness generati da Google Gemini 2.5 Flash
- 🎯 **100% Personalizzati**: Basati su età, livello, obiettivi e vincoli
- ⚡ **Veloce**: Generazione in pochi secondi
- 📱 **Responsive**: Design moderno e mobile-friendly
- 📊 **Export**: Esporta piani in PDF
- 🔍 **Ricerca**: Sistema di ricerca e filtri avanzati

## 🏗️ Architettura

```
FitnessAI/
├── frontend/          # Angular 17 (Standalone Components)
├── backend/           # Node.js + Express + Gemini AI
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **Angular 17** (Standalone Components)
- **TypeScript**
- **SCSS** (Design professionale)
- **RxJS** (Gestione stato asincrono)

### Backend  
- **Node.js** + **Express.js**
- **Google Gemini AI** (2.5 Flash)
- **CORS** + **dotenv**

## 🚀 Deploy

### Frontend → Vercel
- Build automatico da questo repository
- Environment di produzione configurato
- SPA routing gestito

### Backend → Railway
- Deploy automatico da repository
- Environment variables per Gemini API Key
- Health check endpoint

## 📋 Environment Variables

### Backend (Railway)
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

## 🎨 Design

Design ispirato ad **Accademia Italiana Fitness** con:
- Palette colori professionale (Verde #24A551)
- Gradients e glassmorphism
- Animazioni fluide
- Typography moderna (Inter font)

## 📦 Installazione Locale

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
ng serve
```

## 🔧 Scripts

### Backend
- `npm start` - Avvia server produzione
- `npm run dev` - Avvia server development

### Frontend  
- `ng serve` - Development server
- `ng build` - Build produzione
- `ng build --configuration=production` - Build ottimizzato

## 📱 Screenshots

### Dashboard
- Hero section con statistiche AI
- Feature cards animate
- Call-to-action prominenti

### Questionario
- Form multi-step
- Validazione real-time
- UI/UX ottimizzata

### Lista Piani
- Grid responsive
- Search e filtri
- Export PDF integrato

## 🌟 Highlights Tecnici

- **Standalone Components** (Angular 17)
- **Dependency Injection** per servizi
- **Environment-based** configuration
- **Error handling** robusto
- **TypeScript** strict mode
- **Lazy loading** per ottimizzazioni

## 👨‍💻 Developed by Alessio

Progetto sviluppato per **Accademia Italiana Fitness** - Job Interview Technical Challenge.

---

🚀 **Live Demo**: [Coming Soon]  
💻 **Repository**: https://github.com/Jockeys97/FitnessAI