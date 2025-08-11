import { Component, OnInit, computed, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormControl, FormGroup, AbstractControl, ValidationErrors, NonNullableFormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReservasFacade } from '../../estado/reservas.facade';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { LocaisApi } from '../../api/locais.api';
import { SalasApi } from '../../api/salas.api';
import { Local } from '../../../../compartilhado/modelos/local.modelo';
import { Sala } from '../../../../compartilhado/modelos/sala.modelo';
import { CriarReservaDto } from '../../../../compartilhado/dtos/criar-reserva.dto';
import { AtualizarReservaDto } from '../../../../compartilhado/dtos/atualizar-reserva.dto';
import { NotificacaoServico } from '../../../../nucleo/servicos/notificacao.servico';
import { firstValueFrom } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type ReservaForm = FormGroup<{
  localId: FormControl<string>;
  localNome: FormControl<string>;
  salaId: FormControl<string>;
  salaNome: FormControl<string>;
  inicioLocal: FormControl<string>; // 'YYYY-MM-DDTHH:mm' (datetime-local)
  fimLocal: FormControl<string>;    // idem
  responsavelNome: FormControl<string>;
  responsavelEmail: FormControl<string>;
  cafe: FormControl<boolean>;
  cafeQuantidade: FormControl<number | null>;
  cafeDescricao: FormControl<string>;
}>;

/** Valida se inicioLocal < fimLocal */
function rangeValidator(group: AbstractControl): ValidationErrors | null {
  const ini = group.get('inicioLocal')?.value as string | null;
  const fim = group.get('fimLocal')?.value as string | null;
  if (!ini || !fim) return null;
  return new Date(ini).getTime() < new Date(fim).getTime()
    ? null
    : { intervaloInvalido: true };
}

/** Converte 'YYYY-MM-DDTHH:mm' (local) -> ISO UTC */
function localToIso(local: string | null | undefined): string {
  if (!local) return '';
  return new Date(local).toISOString();
}

@Component({
  selector: 'app-reserva-editar-pagina',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatCheckboxModule, MatSelectModule
  ],
  templateUrl: './reserva-editar.pagina.html',
  styleUrls: ['./reserva-editar.pagina.scss']
})
export class ReservaEditarPagina implements OnInit {
  public facade = inject(ReservasFacade);
  private rota = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder) as NonNullableFormBuilder;
  private notificacao = inject(NotificacaoServico);
  private locaisApi = inject(LocaisApi);
  private salasApi = inject(SalasApi);
  private destroyRef = inject(DestroyRef);

  id = signal<string | null>(null);
  titulo = computed(() => this.id() ? 'Editar Reserva' : 'Nova Reserva');
  locais = signal<Local[]>([]);
  salas = signal<Sala[]>([]);

  form: ReservaForm = this.fb.group({
    localId: this.fb.control('', { validators: [Validators.required] }),
    localNome: this.fb.control(''),
    salaId: this.fb.control('', { validators: [Validators.required] }),
    salaNome: this.fb.control(''),
    inicioLocal: this.fb.control('', { validators: [Validators.required] }), // datetime-local
    fimLocal: this.fb.control('', { validators: [Validators.required] }),    // datetime-local
    responsavelNome: this.fb.control('', { validators: [Validators.required, Validators.minLength(2)] }),
    responsavelEmail: this.fb.control('', { validators: [Validators.required, Validators.email] }),
    cafe: this.fb.control(false),
    cafeQuantidade: this.fb.control<number | null>(null),
    cafeDescricao: this.fb.control(''),
  }, { validators: [rangeValidator] });

  async ngOnInit() {
    if (!this.facade.lista()) await this.facade.carregarLista();

    try {
      const listaLocais = await firstValueFrom(this.locaisApi.listar());
      this.locais.set(listaLocais);
    } catch {}

    this.form.controls.localId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async (localId) => {
        this.form.controls.salaId.setValue('');
        this.salas.set([]);
        const local = this.locais().find(l => l.id === localId);
        this.form.controls.localNome.setValue(local?.nome ?? '');
        if (!localId) return;
        try {
          const listaSalas = await firstValueFrom(this.salasApi.listarPorLocal(localId));
          this.salas.set(listaSalas);
        } catch {}
      });

    // café: validação simples via required quando marcado
    this.form.controls.cafe.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((marcado) => {
        const qtd = this.form.controls.cafeQuantidade;
        const desc = this.form.controls.cafeDescricao;
        if (marcado) {
          qtd.addValidators([Validators.required, Validators.min(1)]);
          desc.addValidators([Validators.required, Validators.minLength(3)]);
          qtd.enable({ emitEvent: false });
          desc.enable({ emitEvent: false });
        } else {
          qtd.clearValidators();
          desc.clearValidators();
          qtd.setValue(null, { emitEvent: false });
          desc.setValue('', { emitEvent: false });
          qtd.disable({ emitEvent: false });
          desc.disable({ emitEvent: false });
        }
        qtd.updateValueAndValidity({ emitEvent: false });
        desc.updateValueAndValidity({ emitEvent: false });
      });

    // edição
    const id = this.rota.snapshot.paramMap.get('id');
    if (id) {
      this.id.set(id);
      await this.facade.carregarPorId(id);
      const r = this.facade.selecionada();
      if (r) {
        // transformar ISO -> datetime-local (YYYY-MM-DDTHH:mm)
        const toLocalInput = (iso: string) => {
          const d = new Date(iso);
          const pad = (n: number) => n.toString().padStart(2, '0');
          return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        };
        this.form.patchValue({
          localId: r.localId ?? '',
          localNome: r.localNome,
          salaId: r.salaId ?? '',
          salaNome: r.salaNome,
          inicioLocal: toLocalInput(r.inicio),
          fimLocal: toLocalInput(r.fim),
          responsavelNome: r.responsavelNome,
          responsavelEmail: r.responsavelEmail,
          cafe: !!r.cafe,
          cafeQuantidade: r.cafeQuantidade ?? null,
          cafeDescricao: r.cafeDescricao ?? ''
        });
      }
    }

    // estado inicial dos campos de café
    this.form.controls.cafe.setValue(this.form.controls.cafe.value, { emitEvent: true });
  }

  private conflitaComExistentes(): boolean {
    const v = this.form.getRawValue();
    const ini = new Date(v.inicioLocal).getTime();
    const fim = new Date(v.fimLocal).getTime();
    const sobrepoe = (aIni: number, aFim: number, bIni: number, bFim: number) => aIni < bFim && bIni < aFim;

    return (this.facade.lista() ?? []).some(r => {
      if (this.id() && r.id === this.id()) return false;
      const mesmoLocal = r.localId ? r.localId === v.localId : r.localNome === v.localNome;
      const mesmaSala = r.salaId ? r.salaId === v.salaId : r.salaNome === v.salaNome;
      if (!mesmoLocal || !mesmaSala) return false;
      const rIni = new Date(r.inicio).getTime();
      const rFim = new Date(r.fim).getTime();
      return sobrepoe(ini, fim, rIni, rFim);
    });
  }

  async salvar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.conflitaComExistentes()) {
      this.notificacao.erro('Conflito de horário nesta sala. Ajuste o intervalo.');
      return;
    }

    const v = this.form.getRawValue();
    const comum = {
      localId: v.localId,
      salaId: v.salaId,
      responsavelNome: v.responsavelNome,
      responsavelEmail: v.responsavelEmail,
      inicio: localToIso(v.inicioLocal),
      fim: localToIso(v.fimLocal),
      cafe: v.cafe,
      cafeQuantidade: v.cafe ? v.cafeQuantidade : null,
      cafeDescricao: v.cafe ? (v.cafeDescricao || null) : null,
    };

    try {
      if (this.id()) {
        const selecionada = this.facade.selecionada();
        const payload: AtualizarReservaDto = { id: this.id()!, ...comum, rowVersion: selecionada?.rowVersion ?? [] };
        await this.facade.atualizar(this.id()!, payload);
      } else {
        const payload: CriarReservaDto = { ...comum };
        await this.facade.criar(payload);
      }
      this.voltar();
    } catch {}
  }

  voltar() {
    this.router.navigate(['/reservas']);
  }

  hasError(ctrl: string, error: string): boolean {
    const c = this.form.get(ctrl);
    return !!(c && c.invalid && (c.dirty || c.touched) && c.hasError(error));
  }

  get intervaloInvalido(): boolean {
    return this.form.hasError('intervaloInvalido');
  }
}
