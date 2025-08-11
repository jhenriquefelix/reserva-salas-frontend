# reserva-salas-frontend

Aplicação web em Angular para gerenciamento de reservas de salas de reuniões.

- CRUD de reservas com validação de conflito de horários
- Campos obrigatórios: local, sala, data/hora de início e fim, responsável
- Opção de café (quantidade, descrição)
- Integração com API .NET em `https://localhost:7009/api` via proxy
- Nomenclaturas em português (módulos, serviços, componentes)

## Requisitos

- Node.js >= 18 (recomendado LTS)
- Angular CLI >= 18
- NPM >= 9
- API .NET rodando em `https://localhost:7009/api`

## Instalação

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Certifique-se de que a API .NET está executando em `https://localhost:7009/api`.

## Executando em desenvolvimento

Execute o servidor de desenvolvimento do Angular:

```bash
ng serve
# ou
npm start
```

Aplicação disponível em `http://localhost:4200`.

## Build de produção

```bash
ng build --configuration production
# ou simplesmente
ng build
```

Os artefatos serão gerados em `dist/`.

## Estrutura principal

- `src/app/funcionalidades/reservas/`
  - `api/` serviços HTTP (`reservas.api.ts`, `locais.api.ts`, `salas.api.ts`)
  - `estado/` facade e sinais de estado (`reservas.facade.ts`)
  - `paginas/`
    - `lista/` página de listagem (`reservas-lista.pagina.ts/html/scss`)
    - `editar/` página de criação/edição (`reserva-editar.pagina.ts/html/scss`)
  - `reservas.rotas.ts` rotas da funcionalidade
- `src/app/compartilhado/` componentes e DTOs compartilhados
- `src/app/nucleo/` serviços de núcleo (ex.: notificações, interceptores)

## Integração com a API

- Base URL: `https://localhost:7009/api` (via proxy)
- Endpoints principais:
  - `GET /locais` — listar locais
  - `GET /locais/{localId}/salas` — listar salas por local
  - `GET /reservas` — listar reservas
  - `POST /reservas` — criar reserva
  - `PUT /reservas/{id}` — atualizar reserva
  - `DELETE /reservas/{id}` — excluir reserva

### DTOs

`CriarReservaDto`

```ts
{
  localId: string;
  salaId: string;
  responsavelNome: string;
  responsavelEmail: string;
  inicio: string; // ISO
  fim: string;    // ISO
  cafe: boolean;
  cafeQuantidade: number | null;
  cafeDescricao: string | null;
}
```

`AtualizarReservaDto`

```ts
{
  id: string;
  localId: string;
  salaId: string;
  responsavelNome: string;
  responsavelEmail: string;
  inicio: string; // ISO
  fim: string;    // ISO
  cafe: boolean;
  cafeQuantidade: number | null;
  cafeDescricao: string | null;
  rowVersion: number[]; // controle de concorrência
}
```

## Scripts úteis

- `ng serve` ou `npm start` — desenvolvimento
- `ng build` — build de produção

## Dicas e troubleshooting

- Certifique-se de que a API .NET está ativa em `https://localhost:7009/api`.
- Conflitos de horário: o formulário bloqueia intervalos sobrepostos na mesma sala.
- Versões do Node/Angular incompatíveis podem causar erros de build (`ng version` para conferir).
