const https = require('https');
const { URL } = require('url');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    this.model = 'gemini-2.5-flash';
  }

  createFitnessPlanPrompt(userData) {
    const { age, level, goal, daysPerWeek, constraints, height, weight } = userData;
    
    const levelDescriptions = {
      beginner: 'principiante (poca o nessuna esperienza con l\'esercizio fisico)',
      intermediate: 'intermedio (qualche mese di esperienza regolare)',
      advanced: 'avanzato (anni di esperienza e allenamento costante)'
    };
    
    const goalDescriptions = {
      fat_loss: 'perdita di peso e riduzione del grasso corporeo',
      muscle_gain: 'aumento della massa muscolare',
      performance: 'miglioramento delle prestazioni atletiche e della forza'
    };

    return `Crea un piano di allenamento personalizzato per un utente con le seguenti caratteristiche:

DATI UTENTE:
- Età: ${age} anni
- Altezza: ${height ? height + ' cm' : 'non specificata'}
- Peso: ${weight ? weight + ' kg' : 'non specificato'}
- Livello di fitness: ${levelDescriptions[level] || level}
- Obiettivo principale: ${goalDescriptions[goal] || goal}
- Giorni di allenamento a settimana: ${daysPerWeek}
- Vincoli o limitazioni: ${constraints || 'nessuna limitazione specificata'}

RICHIESTE SPECIFICHE:
1. Crea un piano settimanale con esattamente ${daysPerWeek} giorni di allenamento
2. Per ogni giorno specifica 4-6 esercizi appropriati al livello e obiettivo
3. Gli esercizi devono essere adatti al livello ${level}
4. Considera le limitazioni: ${constraints || 'nessuna'}
5. Include una breve descrizione del piano (1-2 frasi)

FORMATO RISPOSTA RICHIESTO (rispondi SOLO con questo JSON valido):
{
  "summary": "Descrizione breve del piano (max 100 caratteri)",
  "week": [
    {
      "day": "Nome del giorno",
      "exercises": [
        "Esercizio 1 con dettagli (es: Squat 3x12)",
        "Esercizio 2 con dettagli",
        "Esercizio 3 con dettagli",
        "Esercizio 4 con dettagli"
      ]
    }
  ]
}

IMPORTANTE: Rispondi ESCLUSIVAMENTE con il JSON richiesto, senza testo aggiuntivo prima o dopo. Il JSON deve essere valido e parsabile.`;
  }

  async generateFitnessPlan(userData, retryCount = 0) {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY non trovata nelle variabili d\'ambiente');
    }

    const prompt = this.createFitnessPlanPrompt(userData);
    const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096
      }
    };

    try {
      const data = await this.makeHttpsRequest(url, requestBody);
      console.log('Risposta Gemini:', JSON.stringify(data, null, 2));
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('Struttura risposta non valida:', data);
        throw new Error('Risposta non valida da Gemini API');
      }

      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Pulisce il testo e cerca di estrarre solo il JSON
      let cleanText = generatedText.trim();
      
      // Rimuove eventuali backticks e "json" markers
      cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Trova l'inizio e la fine del JSON
      const jsonStart = cleanText.indexOf('{');
      let jsonEnd = cleanText.lastIndexOf('}') + 1;
      
      if (jsonStart === -1) {
        throw new Error('JSON non trovato nella risposta di Gemini');
      }
      
      // Se il JSON sembra troncato, prova a completarlo
      if (jsonEnd === 0 || jsonEnd <= jsonStart) {
        console.warn('JSON sembra troncato, tentativo di completamento...');
        // Prova a trovare una struttura parziale
        const partialJson = cleanText.substring(jsonStart);
        const openBraces = (partialJson.match(/{/g) || []).length;
        const closeBraces = (partialJson.match(/}/g) || []).length;
        const missingBraces = openBraces - closeBraces;
        
        if (missingBraces > 0) {
          cleanText = cleanText + '}'.repeat(missingBraces);
          jsonEnd = cleanText.lastIndexOf('}') + 1;
        }
      }
      
      const jsonText = cleanText.substring(jsonStart, jsonEnd);
      
      try {
        const planData = JSON.parse(jsonText);
        
        // Aggiunge ID e timestamp
        const completePlan = {
          id: this.generateId(),
          createdAt: new Date().toISOString(),
          ...planData
        };
        
        return completePlan;
      } catch (parseError) {
        console.error('Errore parsing JSON:', parseError);
        console.error('Testo da parsare:', jsonText);
        throw new Error('Risposta JSON non valida da Gemini');
      }
      
    } catch (error) {
      console.error('Errore chiamata Gemini API:', error);
      
      // Retry per errori temporanei (503, 429, 500)
      if (retryCount < 2 && (
        error.message.includes('503') || 
        error.message.includes('429') || 
        error.message.includes('500') ||
        error.message.includes('overloaded')
      )) {
        console.log(`Retry ${retryCount + 1}/2 tra 3 secondi...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        return this.generateFitnessPlan(userData, retryCount + 1);
      }
      
      throw error;
    }
  }

  makeHttpsRequest(url, requestBody) {
    return new Promise((resolve, reject) => {
      const urlParsed = new URL(url);
      const postData = JSON.stringify(requestBody);
      
      const options = {
        hostname: urlParsed.hostname,
        port: 443,
        path: urlParsed.pathname + urlParsed.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode !== 200) {
            reject(new Error(`Errore API Gemini (${res.statusCode}): ${data}`));
            return;
          }
          
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (parseError) {
            reject(new Error('Risposta JSON non valida da Gemini API'));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Errore rete: ${error.message}`));
      });

      req.on('timeout', () => {
        reject(new Error('Timeout richiesta Gemini API'));
      });

      req.setTimeout(30000); // 30 second timeout
      req.write(postData);
      req.end();
    });
  }

  generateId() {
    return 'plan_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
  }
}

module.exports = GeminiService;