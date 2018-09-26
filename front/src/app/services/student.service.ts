import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators'
import { ajax } from 'rxjs/ajax'

import { MessageService } from './message.service';
import { Student } from '../student';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private studentsApi = 'http://localhost:3000/students';
  private studentApi = 'http://localhost:3000/student';

  constructor(
    private http:HttpClient,
    private messageService:MessageService
  ) { }

  // GET list of students
  getStudents():Observable<Student[]> {
    return this.http.get<Student[]>(this.studentsApi)
      .pipe(
        tap(students => this.log('fetched students')),
        catchError(this.handleError('fetchStudents',[]))
      );
  }

  // GET one student
  getStudent(id:string):Observable<Student> {
    return this.http.get<Student>(`${this.studentApi}/${id}`)
      .pipe(
        tap( s => this.log(`fetched student ${s.id}`)),
        catchError(this.handleError('fetchStudent',null))
      );
  }

  // PUT - update a student on the server
  updateStudent(id:string,s:Student):Observable<any> {
    return this.http.put<any>(`${this.studentApi}/${id}`, s, httpOptions)
      .pipe(
        tap( _ => this.log(`updated student ${s.id}`)),
        catchError(this.handleError('updateStudent'))
    );
  }

  // POST - add a student on the server
  addStudent(s:Student):Observable<Student> {
    return this.http.post<Student>(this.studentApi, s, httpOptions)
      .pipe(
        tap( (s:Student) => this.log(`added student ${s.id}`)),
        catchError(this.handleError<Student>('addStudent'))
    );
  }

  // DELETE - delete a student from server
  deleteStudent(s:Student):Observable<Student> {
    return this.http.delete<Student>(`${this.studentApi}/${s.id}`, httpOptions)
      .pipe(
        tap( _ => this.log(`deleted student ${s.id}`)),
        catchError(this.handleError<Student>('deleteStudent'))
    );
  }

  searchStudents(term:string):Observable<Student[]> {
    if ( !term.trim()) return of([]);
    return this.http.get<Student[]>(`${this.studentsApi}?name=${term}`)
      .pipe(
        tap( _ => this.log(`found student matching ${term}`)),
        catchError(this.handleError<Student[]>('searchStudents',[]))
    );
  }

  // log messages
  private log(message:string) {
    this.messageService.add(`StudentService: ${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?:T) {
    return (error:any):Observable<T> => {
 
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
 
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
 
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
