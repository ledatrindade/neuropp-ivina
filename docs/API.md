# API REST — NeuroPP Ivina

## 1. Informações gerais

### URL local

```text
http://localhost:8080
```

### Prefixo das rotas

```text
/api
```

### Formato

- requisições e respostas em JSON;
- autenticação por Bearer Token;
- datas no formato ISO `AAAA-MM-DD`;
- horários no formato `HH:mm`;
- identificadores no formato UUID.

## 2. Autenticação

As rotas protegidas exigem:

```http
Authorization: Bearer SEU_TOKEN
```

O login retorna:

```json
{
  "token": "jwt",
  "tokenType": "Bearer",
  "expiresAt": "2026-08-20T14:00:00Z",
  "userId": "00000000-0000-0000-0000-000000000000",
  "name": "Pessoa de Exemplo",
  "email": "pessoa@example.com",
  "role": "RESPONSIBLE"
}
```

## 3. Papéis de acesso

| Marcador | Significado |
|---|---|
| Público | não exige token |
| Autenticado | aceita qualquer perfil autenticado |
| Responsável | exige `RESPONSIBLE` |
| Admin | exige `ADMIN` |

## 4. Endpoints

### 4.1 Saúde

| Método | Rota | Acesso | Retorno esperado |
|---|---|---|---|
| `GET` | `/api/health` | Público | `200 OK` |
| `GET` | `/actuator/health` | Público | `200 OK` |

Exemplo:

```http
GET /api/health
```

```json
{
  "status": "UP",
  "service": "neuropp-ivina-api",
  "timestamp": "2026-08-20T12:00:00Z"
}
```

### 4.2 Cadastro e autenticação

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `POST` | `/api/responsibles` | Público | cria uma conta de responsável |
| `POST` | `/api/auth/login` | Público | autentica e devolve o JWT |
| `PUT` | `/api/account/password` | Autenticado | troca a própria senha e revoga tokens antigos |

#### Cadastrar responsável

```http
POST /api/responsibles
Content-Type: application/json

{
  "name": "Pessoa Responsável",
  "email": "pessoa@example.com",
  "phone": "81999999999",
  "password": "Cacto-Lua-27-Ponte!"
}
```

Validações principais:

- nome entre 3 e 150 caracteres;
- e-mail válido com até 254 caracteres;
- telefone somente com números, permitindo `+` no início;
- senha entre 12 e 72 caracteres;
- regras adicionais da política de senha.

Retorno: `201 Created`.

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "pessoa@example.com",
  "password": "Cacto-Lua-27-Ponte!"
}
```

Retorno: `200 OK` com o token e os dados básicos da sessão.

#### Trocar senha

```http
PUT /api/account/password
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "currentPassword": "Cacto-Lua-27-Ponte!",
  "newPassword": "Montanha-Rio-48-Janela!"
}
```

Retorno: `204 No Content`. Após a troca, tokens emitidos anteriormente deixam de ser aceitos.

### 4.3 Crianças

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `POST` | `/api/children/my` | Responsável | cadastra uma criança para o usuário atual |
| `GET` | `/api/children/my` | Responsável | lista as crianças do usuário atual |

#### Cadastrar criança

```http
POST /api/children/my
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "name": "Criança de Exemplo",
  "age": 8
}
```

Validações principais:

- nome entre 2 e 150 caracteres;
- idade entre 0 e 17 anos.

Retorno: `201 Created`.

### 4.4 Disponibilidade

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `GET` | `/api/availability?date=AAAA-MM-DD` | Público | lista horários disponíveis do dia |
| `POST` | `/api/admin/availability` | Admin | cria horário |
| `GET` | `/api/admin/availability?date=AAAA-MM-DD` | Admin | lista todos os horários do dia |
| `PUT` | `/api/admin/availability/{slotId}` | Admin | altera data e intervalo |
| `PUT` | `/api/admin/availability/{slotId}/block` | Admin | bloqueia horário |
| `PUT` | `/api/admin/availability/{slotId}/unblock` | Admin | desbloqueia horário |
| `DELETE` | `/api/admin/availability/{slotId}` | Admin | remove logicamente o horário |

#### Consultar horários públicos

```http
GET /api/availability?date=2026-08-20
```

O parâmetro `date` é obrigatório.

#### Criar horário

```http
POST /api/admin/availability
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "date": "2026-08-20",
  "startTime": "09:00",
  "endTime": "10:00"
}
```

Regras principais:

- data atual ou futura;
- horário final posterior ao inicial;
- intervalos não podem se sobrepor.

Retorno: `201 Created`.

#### Atualizar horário

```http
PUT /api/admin/availability/UUID_DO_HORARIO
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "date": "2026-08-21",
  "startTime": "10:00",
  "endTime": "11:00"
}
```

#### Bloquear ou desbloquear

```http
PUT /api/admin/availability/UUID_DO_HORARIO/block
Authorization: Bearer TOKEN_ADMIN
```

```http
PUT /api/admin/availability/UUID_DO_HORARIO/unblock
Authorization: Bearer TOKEN_ADMIN
```

#### Remover horário

```http
DELETE /api/admin/availability/UUID_DO_HORARIO
Authorization: Bearer TOKEN_ADMIN
```

Retorno: `204 No Content`.

### 4.5 Agendamentos do responsável

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `POST` | `/api/appointments/my` | Responsável | cria agendamento |
| `GET` | `/api/appointments/my` | Responsável | lista os próprios agendamentos |
| `PUT` | `/api/appointments/my/{appointmentId}/cancel` | Responsável | cancela o próprio agendamento |
| `PUT` | `/api/appointments/my/{appointmentId}/reschedule` | Responsável | reagenda para outro horário |
| `DELETE` | `/api/appointments/my/{appointmentId}/history` | Responsável | oculta item terminal do próprio histórico |

#### Criar agendamento

```http
POST /api/appointments/my
Authorization: Bearer TOKEN_RESPONSAVEL
Content-Type: application/json

{
  "childId": "UUID_DA_CRIANCA",
  "slotId": "UUID_DO_HORARIO",
  "notes": "Observações iniciais opcionais"
}
```

Retorno: `201 Created`.

A criança informada deve pertencer ao responsável autenticado. O slot deve existir, estar disponível, não estar bloqueado e não possuir outro agendamento ativo.

#### Listar agendamentos

```http
GET /api/appointments/my?page=0&size=20
Authorization: Bearer TOKEN_RESPONSAVEL
```

Parâmetros:

- `page`: começa em `0`;
- `size`: mínimo `1`, máximo `100`, padrão `20`.

#### Cancelar

```http
PUT /api/appointments/my/UUID_DO_AGENDAMENTO/cancel
Authorization: Bearer TOKEN_RESPONSAVEL
```

#### Reagendar

```http
PUT /api/appointments/my/UUID_DO_AGENDAMENTO/reschedule
Authorization: Bearer TOKEN_RESPONSAVEL
Content-Type: application/json

{
  "newSlotId": "UUID_DO_NOVO_HORARIO"
}
```

#### Ocultar do histórico

```http
DELETE /api/appointments/my/UUID_DO_AGENDAMENTO/history
Authorization: Bearer TOKEN_RESPONSAVEL
```

Só agendamentos em estado terminal podem ser ocultados. Retorno: `204 No Content`.

### 4.6 Administração de agendamentos

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `GET` | `/api/admin/appointments` | Admin | lista todos os agendamentos |
| `PUT` | `/api/admin/appointments/{appointmentId}/status` | Admin | altera o status |
| `DELETE` | `/api/admin/appointments/{appointmentId}/history` | Admin | oculta item terminal do histórico administrativo |

#### Listar

```http
GET /api/admin/appointments?page=0&size=20
Authorization: Bearer TOKEN_ADMIN
```

#### Atualizar status

```http
PUT /api/admin/appointments/UUID_DO_AGENDAMENTO/status
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "status": "CONFIRMED"
}
```

Status válidos:

```text
PENDING
CONFIRMED
RESCHEDULED
CANCELLED
ATTENDED
MISSED
COMPLETED
```

Transições aceitas:

```text
PENDING     → CONFIRMED ou CANCELLED
CONFIRMED   → ATTENDED, MISSED ou CANCELLED
RESCHEDULED → CONFIRMED ou CANCELLED
ATTENDED    → COMPLETED
```

### 4.7 Documentos

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `POST` | `/api/admin/documents` | Admin | cria documento |
| `PUT` | `/api/admin/documents/{documentId}/release` | Admin | libera documento |
| `GET` | `/api/admin/documents` | Admin | lista documentos resumidos |
| `GET` | `/api/admin/documents/{documentId}` | Admin | consulta detalhe completo |
| `GET` | `/api/admin/appointments/{appointmentId}/documents` | Admin | lista documentos de um agendamento |
| `GET` | `/api/documents/my` | Responsável | lista os próprios documentos liberados |
| `GET` | `/api/documents/my/{documentId}` | Responsável | consulta documento liberado completo |

#### Criar documento

```http
POST /api/admin/documents
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "appointmentId": "UUID_DO_AGENDAMENTO",
  "title": "Resumo do atendimento",
  "documentType": "SESSION",
  "content": "Conteúdo privado do documento",
  "fileUrl": null
}
```

Tipos válidos:

```text
EVALUATION
SESSION
DEVOLUTION
GUIDANCE
```

Regras principais:

- título com até 180 caracteres;
- conteúdo com até 100000 caracteres;
- URL com até 2048 caracteres;
- pelo menos `content` ou `fileUrl` deve estar presente.

Retorno: `201 Created`.

#### Liberar documento

```http
PUT /api/admin/documents/UUID_DO_DOCUMENTO/release
Authorization: Bearer TOKEN_ADMIN
```

#### Listar como admin

```http
GET /api/admin/documents?page=0&size=20
Authorization: Bearer TOKEN_ADMIN
```

#### Listar como responsável

```http
GET /api/documents/my?page=0&size=20
Authorization: Bearer TOKEN_RESPONSAVEL
```

A resposta contém somente documentos liberados e vinculados ao responsável autenticado.

## 5. Paginação

As listagens paginadas retornam um objeto semelhante a:

```json
{
  "content": [],
  "page": 0,
  "size": 20,
  "totalElements": 0,
  "totalPages": 0,
  "first": true,
  "last": true
}
```

O contrato exato deve acompanhar o `PageResponse` da versão atual do backend.

## 6. Respostas de erro

Estrutura padronizada:

```json
{
  "status": 400,
  "error": "Bad Request",
  "code": "VALIDATION_ERROR",
  "message": "Existem campos inválidos na requisição.",
  "path": "/api/responsibles",
  "requestId": "identificador-da-requisicao",
  "timestamp": "2026-08-20T12:00:00Z",
  "fieldErrors": {
    "email": "Informe um e-mail válido."
  }
}
```

Códigos importantes:

| HTTP | Código da API | Significado |
|---|---|---|
| `400` | `VALIDATION_ERROR` | corpo com campos inválidos |
| `400` | `CONSTRAINT_VIOLATION` | parâmetro de rota ou query inválido |
| `400` | `MALFORMED_REQUEST` | valor ausente ou formato incorreto |
| `401` | `INVALID_CREDENTIALS` | e-mail ou senha incorretos |
| `401` | autenticação do Resource Server | token ausente, inválido ou expirado |
| `403` | `FORBIDDEN_OPERATION` | operação não permitida |
| `404` | `RESOURCE_NOT_FOUND` | recurso inexistente |
| `409` | `BUSINESS_CONFLICT` | conflito de negócio |
| `409` | `DATA_CONFLICT` | conflito de integridade ou concorrência |
| `422` | `BUSINESS_RULE_VIOLATION` | regra de negócio não atendida |
| `500` | `INTERNAL_ERROR` | erro inesperado sem exposição da stack trace |

O header `X-Request-Id` pode ser usado para relacionar um erro visto no navegador aos logs do backend.

## 7. Teste rápido com cURL

### Saúde

```bash
curl http://localhost:8080/api/health
```

### Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"pessoa@example.com","password":"Cacto-Lua-27-Ponte!"}'
```

### Rota protegida

```bash
curl http://localhost:8080/api/children/my \
  -H "Authorization: Bearer TOKEN"
```

## 8. Cuidados

- Não salve tokens reais no repositório.
- Não publique coleções do Postman com credenciais preenchidas.
- Não use dados reais na demonstração.
- Confirme o perfil do token ao testar rotas administrativas.
