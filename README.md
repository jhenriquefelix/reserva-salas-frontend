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