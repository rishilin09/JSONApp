import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserCrudService {

  endpoint = 'http://localhost:3000/users';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private httpClient: HttpClient) { }

  createUser(user: User): Observable<any> {
    return this.httpClient
      .post<User>(this.endpoint, JSON.stringify(user), this.httpOptions)
      .pipe(catchError(this.handleError<User>('Error occured')));
  }

  getUser(id: Number): Observable<User[]> {
    return this.httpClient.get<User[]>(this.endpoint + '/' + id).pipe(
      tap((_) => console.log(`User fetched: ${id}`)),
      catchError(this.handleError<User[]>(`Get user id=${id}`))
    );
  }

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.endpoint).pipe(
      tap((users) => console.log('Users retrieved!')),
      catchError(this.handleError<User[]>('Get user', []))
    );
  }

  updateUser(id: Number, user: User): Observable<any> {
    return this.httpClient
      .put(this.endpoint + '/' + id, JSON.stringify(user), this.httpOptions)
      .pipe(
        tap((_) => console.log(`User updated: ${id}`)),
        catchError(this.handleError<User[]>('Update user'))
      );
  }

  deleteUser(id: Number): Observable<User[]> {
    return this.httpClient
      .delete<User[]>(this.endpoint + '/' + id, this.httpOptions)
      .pipe(
        tap((_) => console.log(`User deleted: ${id}`)),
        catchError(this.handleError<User[]>('Delete user'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}
