import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NotificacaoServico } from '../servicos/notificacao.servico';
import { catchError, throwError } from 'rxjs';

export const erroInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificacaoServico);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 409) {
        notify.erro('Conflito de horário na reserva.');
      } else if (err.status >= 500) {
        notify.erro('Erro no servidor. Tente novamente mais tarde.');
      } else if (err.status === 0) {
        notify.erro('Não foi possível conectar ao servidor.');
      }
      return throwError(() => err);
    })
  );
};
