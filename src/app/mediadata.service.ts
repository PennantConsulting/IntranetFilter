import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

@Injectable()
export class MediadataService {

    public error: any;

    constructor(public http: HttpClient) {
        // console.log('data service connected');
    }

    getPosts(datapath: string) {
        return this.http.get(datapath).pipe(
            tap(_ => console.log('Loaded data from ' + datapath)),
            catchError(this.handleError<object>('Load Data'))
        );
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            this.error = error;

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

}
