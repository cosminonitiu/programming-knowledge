import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ThreadContentService {
  constructor(private http: HttpClient) {}

  getThreadContent(contentPath: string): Observable<string> {
    const filePath = `assets/data/threads/${contentPath}.md`;
    return this.http.get(filePath, { responseType: 'text' });
  }
} 