import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private baseUrl = 'http://localhost:8000/chatbot';

  constructor(private http: HttpClient) {}

  getQuestions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/questions/`);
  }

  getAnswer(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/answer/${id}/`);
  }
}
