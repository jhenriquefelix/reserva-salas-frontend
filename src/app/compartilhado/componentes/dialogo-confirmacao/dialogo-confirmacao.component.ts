import { Component, Inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

export interface DialogoConfirmacaoDados {
  titulo?: string;
  mensagem?: string;
  textoConfirmar?: string;
  textoCancelar?: string;
}

@Component({
  selector: 'app-dialogo-confirmacao',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.titulo || 'Confirmar ação' }}</h2>
    <div mat-dialog-content>
      <p>{{ data.mensagem || 'Deseja realmente continuar?' }}</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-stroked-button (click)="fechar(false)">{{ data.textoCancelar || 'Cancelar' }}</button>
      <button mat-raised-button color="warn" (click)="fechar(true)">{{ data.textoConfirmar || 'Confirmar' }}</button>
    </div>
  `
})
export class DialogoConfirmacaoComponent {
  constructor(
    public ref: MatDialogRef<DialogoConfirmacaoComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: DialogoConfirmacaoDados
  ) {}

  fechar(valor: boolean) {
    this.ref.close(valor);
  }
}
