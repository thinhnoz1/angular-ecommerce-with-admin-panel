import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Params } from '../interface/core.interface';
import { QnAModel } from '../interface/questions-answers.interface';

@Injectable({
  providedIn: 'root'
})
export class QuestionsAnswersService {

  constructor(private http: HttpClient) { }

  getQuestionAnswers(payload: Params): Observable<QnAModel> {
    return this.http.get<QnAModel>(`${environment.URL}/questions.json`, payload);
  }

}
