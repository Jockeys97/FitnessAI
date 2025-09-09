import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Plan, Questionnaire } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly mockApi = environment.mockApi;
  private readonly STORAGE_KEY = 'fitness-planner-plans';

  constructor(private http: HttpClient) {}

  postPlanFromAI(payload: Questionnaire): Observable<Plan> {
    if (this.mockApi) {
      const mockPlan = this.generateMockPlan(payload);
      return of(mockPlan).pipe(delay(400));
    }
    
    return this.http.post<Plan>(`${this.baseUrl}/ai/plan`, payload)
      .pipe(catchError(this.handleError));
  }

  getPlans(): Observable<Plan[]> {
    if (this.mockApi) {
      const plans = this.getPlansFromStorage();
      return of(plans);
    }
    
    return this.http.get<Plan[]>(`${this.baseUrl}/plans`)
      .pipe(catchError(this.handleError));
  }

  savePlan(plan: Plan): Observable<Plan> {
    if (this.mockApi) {
      const plans = this.getPlansFromStorage();
      plans.unshift(plan);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(plans));
      return of(plan);
    }
    
    return this.http.post<Plan>(`${this.baseUrl}/plans`, plan)
      .pipe(catchError(this.handleError));
  }

  getPlan(id: string): Observable<Plan> {
    if (this.mockApi) {
      const plans = this.getPlansFromStorage();
      const plan = plans.find(p => p.id === id);
      if (!plan) {
        return throwError(() => new Error('Plan not found'));
      }
      return of(plan);
    }
    
    return this.http.get<Plan>(`${this.baseUrl}/plans/${id}`)
      .pipe(catchError(this.handleError));
  }

  deletePlan(id: string): Observable<void> {
    if (this.mockApi) {
      const plans = this.getPlansFromStorage();
      const nextPlans = plans.filter(p => p.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(nextPlans));
      return of(void 0);
    }

    return this.http.delete<void>(`${this.baseUrl}/plans/${id}`)
      .pipe(catchError(this.handleError));
  }

  private generateMockPlan(questionnaire: Questionnaire): Plan {
    const exercises = {
      beginner: {
        fat_loss: ['Walking', 'Bodyweight squats', 'Push-ups'],
        muscle_gain: ['Bodyweight squats', 'Push-ups', 'Plank'],
        performance: ['Jumping jacks', 'Burpees', 'Mountain climbers']
      },
      intermediate: {
        fat_loss: ['Running', 'Jump squats', 'Burpees'],
        muscle_gain: ['Weighted squats', 'Pull-ups', 'Dips'],
        performance: ['Sprint intervals', 'Box jumps', 'Battle ropes']
      },
      advanced: {
        fat_loss: ['HIIT sprints', 'Plyometric squats', 'Advanced burpees'],
        muscle_gain: ['Heavy squats', 'Weighted pull-ups', 'Ring dips'],
        performance: ['Olympic lifts', 'Advanced plyometrics', 'Compound movements']
      }
    };

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const selectedExercises = exercises[questionnaire.level][questionnaire.goal];
    
    const week: any[] = [];
    for (let i = 0; i < questionnaire.daysPerWeek; i++) {
      week.push({
        day: days[i],
        exercises: [...selectedExercises]
      });
    }

    const goalLabels = {
      fat_loss: 'Fat Loss',
      muscle_gain: 'Muscle Gain',
      performance: 'Performance'
    };

    return {
      id: crypto.randomUUID(),
      summary: `${questionnaire.level.charAt(0).toUpperCase() + questionnaire.level.slice(1)} ${goalLabels[questionnaire.goal]} Plan - ${questionnaire.daysPerWeek} days/week`,
      createdAt: new Date().toISOString(),
      week
    };
  }

  private getPlansFromStorage(): Plan[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  };
}