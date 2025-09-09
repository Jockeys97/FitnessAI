require('dotenv').config();
const express = require('express');
const cors = require('cors');
const GeminiService = require('./services/geminiService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini service
const geminiService = new GeminiService();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY 
  });
});

// Generate fitness plan endpoint
app.post('/ai/plan', async (req, res) => {
  try {
    console.log('Ricevuta richiesta per generazione piano:', req.body);
    
    const { age, level, goal, daysPerWeek, constraints, height, weight } = req.body;
    
    // Validazione input
    if (!age || !level || !goal || !daysPerWeek) {
      return res.status(400).json({
        error: 'Parametri mancanti',
        message: 'Campi obbligatori: age, level, goal, daysPerWeek'
      });
    }
    
    if (age < 16 || age > 100) {
      return res.status(400).json({
        error: 'Età non valida',
        message: 'L\'età deve essere compresa tra 16 e 100 anni'
      });
    }
    
    if (!['beginner', 'intermediate', 'advanced'].includes(level)) {
      return res.status(400).json({
        error: 'Livello non valido',
        message: 'Il livello deve essere: beginner, intermediate o advanced'
      });
    }
    
    if (!['fat_loss', 'muscle_gain', 'performance'].includes(goal)) {
      return res.status(400).json({
        error: 'Obiettivo non valido',
        message: 'L\'obiettivo deve essere: fat_loss, muscle_gain o performance'
      });
    }
    
    if (daysPerWeek < 1 || daysPerWeek > 7) {
      return res.status(400).json({
        error: 'Giorni per settimana non validi',
        message: 'I giorni per settimana devono essere compresi tra 1 e 7'
      });
    }
    
    // Genera il piano fitness usando Gemini
    const plan = await geminiService.generateFitnessPlan({
      age,
      level,
      goal,
      daysPerWeek,
      constraints: constraints || '',
      height: height || null,
      weight: weight || null
    });
    
    console.log('Piano generato con successo:', plan.id);
    
    res.json(plan);
    
  } catch (error) {
    console.error('Errore nella generazione del piano:', error);
    
    // Gestione errori specifici
    if (error.message.includes('GEMINI_API_KEY')) {
      return res.status(500).json({
        error: 'Configurazione server',
        message: 'API key di Gemini non configurata'
      });
    }
    
    if (error.message.includes('Errore API Gemini')) {
      return res.status(502).json({
        error: 'Errore servizio esterno',
        message: 'Errore nella comunicazione con Gemini API'
      });
    }
    
    if (error.message.includes('JSON non valido')) {
      return res.status(502).json({
        error: 'Errore parsing risposta',
        message: 'Risposta non valida dal servizio AI'
      });
    }
    
    res.status(500).json({
      error: 'Errore interno del server',
      message: 'Si è verificato un errore durante la generazione del piano'
    });
  }
});

// Storage per i piani (in memoria - in produzione useresti un database)
let savedPlans = [];

// Get all saved plans
app.get('/plans', (req, res) => {
  try {
    console.log(`Restituiti ${savedPlans.length} piani salvati`);
    res.json(savedPlans);
  } catch (error) {
    console.error('Errore nel caricamento dei piani:', error);
    res.status(500).json({
      error: 'Errore interno del server',
      message: 'Errore nel caricamento dei piani'
    });
  }
});

// Save a plan
app.post('/plans', (req, res) => {
  try {
    const plan = req.body;
    console.log('Richiesta di salvataggio piano:', plan.id);
    
    // Validazione base
    if (!plan.id || !plan.summary || !plan.week) {
      return res.status(400).json({
        error: 'Dati piano non validi',
        message: 'Campi obbligatori: id, summary, week'
      });
    }
    
    // Verifica se il piano esiste già
    const existingPlanIndex = savedPlans.findIndex(p => p.id === plan.id);
    if (existingPlanIndex !== -1) {
      savedPlans[existingPlanIndex] = plan;
      console.log('Piano aggiornato:', plan.id);
    } else {
      savedPlans.unshift(plan); // Aggiunge in testa
      console.log('Nuovo piano salvato:', plan.id);
    }
    
    res.json(plan);
  } catch (error) {
    console.error('Errore nel salvataggio del piano:', error);
    res.status(500).json({
      error: 'Errore interno del server',
      message: 'Errore nel salvataggio del piano'
    });
  }
});

// Get single plan by ID
app.get('/plans/:id', (req, res) => {
  try {
    const planId = req.params.id;
    console.log('Richiesta piano:', planId);
    
    const plan = savedPlans.find(p => p.id === planId);
    if (!plan) {
      return res.status(404).json({ 
        error: 'Piano non trovato',
        message: `Piano con ID ${planId} non trovato` 
      });
    }
    
    console.log('Piano trovato:', planId);
    res.json(plan);
  } catch (error) {
    console.error('Errore nel caricamento del piano:', error);
    res.status(500).json({
      error: 'Errore interno del server',
      message: 'Errore nel caricamento del piano'
    });
  }
});

// Delete plan by ID
app.delete('/plans/:id', (req, res) => {
  try {
    const planId = req.params.id;
    const initialLength = savedPlans.length;
    savedPlans = savedPlans.filter(p => p.id !== planId);
    if (savedPlans.length === initialLength) {
      return res.status(404).json({
        error: 'Piano non trovato',
        message: `Piano con ID ${planId} non trovato`
      });
    }
    console.log('Piano eliminato:', planId);
    res.status(204).send();
  } catch (error) {
    console.error('Errore nell\'eliminazione del piano:', error);
    res.status(500).json({
      error: 'Errore interno del server',
      message: 'Errore nell\'eliminazione del piano'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint non trovato',
    message: `${req.method} ${req.originalUrl} non esiste`
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Errore non gestito:', error);
  res.status(500).json({
    error: 'Errore interno del server',
    message: 'Si è verificato un errore imprevisto'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server avviato su porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 Gemini API configurata: ${!!process.env.GEMINI_API_KEY}`);
  
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  ATTENZIONE: GEMINI_API_KEY non trovata nelle variabili d\'ambiente!');
    console.warn('   Aggiungi GEMINI_API_KEY nel file .env');
  }
});

module.exports = app;