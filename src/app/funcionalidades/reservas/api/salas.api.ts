import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Sala } from '../../../compartilhado/modelos/sala.modelo';

@Injectable({ providedIn: 'root' })
export class SalasApi {
  private http = inject(HttpClient);
  private base = `${environment.urlApi}/locais`;

  listarPorLocal(localId: string): Observable<Sala[]> {
    return this.http.get<Sala[]>(`${this.base}/${localId}/salas`);
  }
}
