import { Injectable, computed, inject, signal } from '@angular/core';
import { ReservasApi } from '../api/reservas.api';
import { Reserva } from '../../../compartilhado/modelos/reserva.modelo';
import { CriarReservaDto } from '../../../compartilhado/dtos/criar-reserva.dto';
import { AtualizarReservaDto } from '../../../compartilhado/dtos/atualizar-reserva.dto';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReservasFacade {
  private api = inject(ReservasApi);

  private _lista = signal<Reserva[] | null>(null);
  private _selecionada = signal<Reserva | null>(null);
  private _carregando = signal<boolean>(false);
  private _erro = signal<string | null>(null);

  // selectors
  readonly lista = computed(() => this._lista());
  readonly selecionada = computed(() => this._selecionada());
  readonly carregando = computed(() => this._carregando());
  readonly erro = computed(() => this._erro());

  async carregarLista() {
    this._carregando.set(true);
    this._erro.set(null);
    try {
      const dados = await firstValueFrom(this.api.listar());
      this._lista.set(dados);
    } catch (e: any) {
      this._erro.set(this.mensagemErro(e));
    } finally {
      this._carregando.set(false);
    }
  }

  async carregarPorId(id: string) {
    this._carregando.set(true);
    this._erro.set(null);
    try {
      const dado = await firstValueFrom(this.api.obter(id));
      this._selecionada.set(dado);
    } catch (e: any) {
      this._erro.set(this.mensagemErro(e));
    } finally {
      this._carregando.set(false);
    }
  }

  async criar(payload: CriarReservaDto) {
    this._carregando.set(true);
    this._erro.set(null);
    try {
      await firstValueFrom(this.api.criar(payload));
      await this.carregarLista();
    } catch (e: any) {
      this._erro.set(this.mensagemErro(e));
      throw e;
    } finally {
      this._carregando.set(false);
    }
  }

  async atualizar(id: string, payload: AtualizarReservaDto) {
    this._carregando.set(true);
    this._erro.set(null);
    try {
      await firstValueFrom(this.api.atualizar(id, payload));
      await this.carregarLista();
    } catch (e: any) {
      this._erro.set(this.mensagemErro(e));
      throw e;
    } finally {
      this._carregando.set(false);
    }
  }

  async excluir(id: string) {
    this._carregando.set(true);
    this._erro.set(null);
    try {
      await firstValueFrom(this.api.excluir(id));
      await this.carregarLista();
    } catch (e: any) {
      this._erro.set(this.mensagemErro(e));
      throw e;
    } finally {
      this._carregando.set(false);
    }
  }

  private mensagemErro(err: any): string {
    const status = err?.status;
    if (status === 409) return 'Conflito de horário na reserva.';
    return 'Ocorreu um erro ao comunicar com o servidor.';
  }
}
