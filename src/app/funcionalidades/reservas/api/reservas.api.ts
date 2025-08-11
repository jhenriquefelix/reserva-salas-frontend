import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Reserva } from '../../../compartilhado/modelos/reserva.modelo';
import { CriarReservaDto } from '../../../compartilhado/dtos/criar-reserva.dto';
import { AtualizarReservaDto } from '../../../compartilhado/dtos/atualizar-reserva.dto';

@Injectable({ providedIn: 'root' })
export class ReservasApi {
  private http = inject(HttpClient);
  private base = `${environment.urlApi}/reservas`;

  listar(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.base);
  }

  obter(id: string): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.base}/${id}`);
  }

  criar(payload: CriarReservaDto): Observable<Reserva> {
    return this.http.post<Reserva>(this.base, payload);
  }

  atualizar(id: string, payload: AtualizarReservaDto): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, payload);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
