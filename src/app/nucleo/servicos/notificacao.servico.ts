import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificacaoServico {
  private snack = inject(MatSnackBar);

  sucesso(mensagem: string, duracao = 3000) {
    this.snack.open(mensagem, 'OK', { duration: duracao, panelClass: ['snack-sucesso'] });
  }

  erro(mensagem: string, duracao = 4000) {
    this.snack.open(mensagem, 'Fechar', { duration: duracao, panelClass: ['snack-erro'] });
  }

  info(mensagem: string, duracao = 3000) {
    this.snack.open(mensagem, 'OK', { duration: duracao });
  }
}
