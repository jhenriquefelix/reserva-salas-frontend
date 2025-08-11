import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Local } from '../../../compartilhado/modelos/local.modelo';

@Injectable({ providedIn: 'root' })
export class LocaisApi {
  private http = inject(HttpClient);
  private base = `${environment.urlApi}/locais`;

  listar(): Observable<Local[]> {
    return this.http.get<Local[]>(this.base);
  }
}
