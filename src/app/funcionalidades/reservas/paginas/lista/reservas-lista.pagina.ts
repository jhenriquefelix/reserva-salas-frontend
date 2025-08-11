import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ReservasFacade } from '../../estado/reservas.facade';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NotificacaoServico } from '../../../../nucleo/servicos/notificacao.servico';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-reservas-lista-pagina',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule],
  templateUrl: './reservas-lista.pagina.html',
  styleUrls: ['./reservas-lista.pagina.scss']
})
export class ReservasListaPagina implements OnInit {
  facade = inject(ReservasFacade);
  router = inject(Router);
  dialog = inject(MatDialog);
  notify = inject(NotificacaoServico);
  colunas = ['local','sala','inicio','fim','responsavel','acoes'];

  ngOnInit() {
    this.facade.carregarLista();
  }

  async excluir(id?: string) {
    if (!id) return;
    const ref = this.dialog.open((await import('../../../../compartilhado/componentes/dialogo-confirmacao/dialogo-confirmacao.component')).DialogoConfirmacaoComponent, {
      data: {
        titulo: 'Excluir reserva',
        mensagem: 'Tem certeza que deseja excluir esta reserva?',
        textoConfirmar: 'Excluir',
        textoCancelar: 'Cancelar'
      }
    });
    const confirmado = await firstValueFrom(ref.afterClosed());
    if (!confirmado) return;
    try {
      await this.facade.excluir(id);
      this.notify.sucesso('Reserva excluída com sucesso.');
    } catch {
      this.notify.erro('Não foi possível excluir.');
    }
  }
}
