import { Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { Observable } from "rxjs";
import { HttpClient , HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })

export class RestService {
    constructor(private http:HttpClient){

    }
    sendPost(body:FormData):Observable<any>{
        return this.http.post(`http://127.0.0.1:4201/api/documento`,body)
    }

}