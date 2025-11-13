import {inject, Injectable} from '@angular/core';
import {ContactFormTypes} from '@models/contact-form.types';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '@tokens/api-url.token';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactFormService {
  private apiUrl = inject(API_URL);
  private http: HttpClient = inject(HttpClient);

  sendContactMail(contactObject: ContactFormTypes): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/contact', contactObject);

  }

}
