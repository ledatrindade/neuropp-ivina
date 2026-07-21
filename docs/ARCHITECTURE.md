# Arquitetura do NeuroPP Ivina

## 1. Visão geral

O NeuroPP Ivina é organizado como uma aplicação web em três partes:

```text
Navegador
   │
   │ HTTPS + JSON
   ▼
Frontend React/Vite
   │
   │ HTTP + Bearer JWT
   ▼
API Spring Boot
   │
   │ JPA/Hibernate + JDBC
   ▼
PostgreSQL
```

O frontend apresenta as páginas públicas e os painéis protegidos. A API concentra autenticação, autorização, validações e regras de negócio. O PostgreSQL preserva usuários, crianças, horários, agendamentos e documentos.

## 2. Componentes principais

| Componente | Responsabilidade | Tecnologia principal |
|---|---|---|
| Frontend | Interface, navegação, formulários e consumo da API | React, TypeScript, Vite, Tailwind CSS |
| API | Regras de negócio, segurança, autenticação e contratos HTTP | Java 21, Spring Boot, Spring Security |
| Banco | Persistência, integridade e restrições concorrentes | PostgreSQL 17 |
| Migrações | Criação e evolução controlada do esquema | Flyway |
| Ambiente local | Subida coordenada da API e do banco | Docker Compose |

## 3. Arquitetura do frontend

### 3.1 Ponto de entrada

```text
index.html
   ↓
src/main.tsx
   ↓
BrowserRouter
   ↓
src/App.tsx
   ↓
páginas e componentes
```

O `index.html` contém a `div#root`. O `main.tsx` monta o React nesse elemento e envolve a aplicação com o roteador. O `App.tsx` declara as rotas públicas e protegidas.

### 3.2 Organização por responsabilidade

```text
src/
├── components/
│   ├── auth/          # proteção de rotas por perfil
│   ├── layout/        # Header, Footer e comportamento de navegação
│   └── ui/            # elementos reutilizáveis de interface
├── content/           # dados institucionais editáveis
├── pages/
│   ├── admin/         # painel administrativo
│   ├── auth/          # login e cadastro
│   ├── public/        # páginas públicas
│   └── responsible/   # área do responsável
├── services/          # comunicação HTTP e armazenamento da sessão
├── types/             # contratos TypeScript
├── utils/             # formatação e funções auxiliares
├── App.tsx
├── index.css
└── main.tsx
```

### 3.3 Rotas públicas

- `/`
- `/sobre`
- `/avaliacao`
- `/contato`
- `/agendar`
- `/login`
- `/cadastro`

### 3.4 Rotas do responsável

Protegidas pelo perfil `RESPONSIBLE`:

- `/confirmar-agendamento`
- `/responsavel`
- `/responsavel/agendamentos`
- `/responsavel/documentos`

### 3.5 Rotas administrativas

Protegidas pelo perfil `ADMIN`:

- `/admin`
- `/admin/horarios`
- `/admin/agendamentos`
- `/admin/documentos`

### 3.6 Comunicação com a API

O arquivo `src/services/api.ts` centraliza as chamadas HTTP. Ele:

- lê `VITE_API_URL`;
- monta query strings;
- serializa corpos em JSON;
- adiciona `Authorization: Bearer <token>` quando necessário;
- converte erros da API em `ApiRequestError`;
- remove a sessão e redireciona ao login ao receber `401`;
- captura o `X-Request-Id` para facilitar diagnóstico.

A URL-base local é:

```text
http://localhost:8080/api
```

Em produção, `VITE_API_URL` deve apontar para a URL pública da API, incluindo `/api`.

## 4. Arquitetura da API

### 4.1 Fluxo de uma requisição

```text
HTTP
 ↓
RequestIdFilter
 ↓
RateLimitFilter
 ↓
Spring Security / JWT
 ↓
Controller
 ↓
Service
 ↓
Repository
 ↓
PostgreSQL
```

### 4.2 Pacotes

#### `config`

Centraliza configurações do Spring, JWT, CORS, BCrypt, rate limiting e bootstrap opcional do primeiro administrador.

#### `controller`

Recebe requisições HTTP, valida DTOs e delega operações aos services. O controller não deve conter acesso direto ao banco nem regras de negócio extensas.

#### `dto`

Define contratos de entrada e saída. O uso de DTOs evita expor entidades JPA diretamente.

#### `entity`

Representa as tabelas persistidas. As entidades possuem auditoria e controle de versão otimista.

#### `repository`

Contém interfaces Spring Data JPA e consultas específicas. Algumas operações de reserva usam lock pessimista para reduzir conflitos concorrentes.

#### `service`

Concentra regras de negócio, validações de domínio e limites transacionais.

#### `mapper`

Converte entidades em DTOs de resposta, mantendo o modelo persistido separado do contrato HTTP.

#### `security`

Emite e valida JWT, converte claims em autenticação, identifica o usuário atual e produz respostas padronizadas para `401` e `403`.

#### `exception`

Converte falhas técnicas e de negócio em respostas HTTP previsíveis, sem enviar stack trace ao cliente.

#### `db/migration`

Contém migrations Flyway. O Hibernate está configurado com `ddl-auto=validate`, portanto valida o esquema, mas não cria ou modifica tabelas automaticamente.

## 5. Autenticação e autorização

### 5.1 Fluxo de login

```text
Usuário envia e-mail e senha
          ↓
POST /api/auth/login
          ↓
AuthService valida credenciais
          ↓
API emite JWT assinado com HS256
          ↓
Frontend armazena dados da sessão
          ↓
Requisições protegidas usam Bearer Token
```

O token inclui informações de emissor, audiência, expiração, identificador e versão do token. A versão permite invalidar tokens antigos após troca de senha.

### 5.2 Perfis

| Perfil | Uso |
|---|---|
| `ADMIN` | gerenciar agenda, agendamentos e documentos |
| `RESPONSIBLE` | gerenciar crianças, próprios agendamentos e documentos liberados |

A proteção existe em duas camadas:

1. o frontend impede a navegação comum para uma área incompatível;
2. a API valida o perfil em toda requisição protegida.

A API é a fonte definitiva de autorização. A proteção do frontend melhora a experiência, mas não substitui a segurança do backend.

## 6. Fluxo de agendamento

```text
Admin cria horário
       ↓
Horário aparece na consulta pública
       ↓
Responsável autentica e escolhe uma criança
       ↓
Responsável cria agendamento
       ↓
API bloqueia o slot durante a transação
       ↓
Banco impede agendamento ativo duplicado
       ↓
Admin atualiza o status do atendimento
```

### 6.1 Estados possíveis

```text
PENDING
CONFIRMED
RESCHEDULED
CANCELLED
ATTENDED
MISSED
COMPLETED
```

### 6.2 Transições permitidas

```text
PENDING     → CONFIRMED ou CANCELLED
CONFIRMED   → ATTENDED, MISSED ou CANCELLED
RESCHEDULED → CONFIRMED ou CANCELLED
ATTENDED    → COMPLETED
```

`CANCELLED`, `MISSED` e `COMPLETED` são estados finais.

## 7. Fluxo de documentos

```text
Admin cria documento relacionado a um agendamento
                      ↓
Documento começa não liberado
                      ↓
Admin revisa e libera
                      ↓
Responsável vê o resumo na própria área
                      ↓
Conteúdo completo é buscado somente ao abrir o documento
```

Listagens usam DTOs resumidos para evitar trafegar conteúdo privado desnecessariamente. O responsável só acessa documentos liberados e vinculados aos próprios agendamentos.

## 8. Decisões de integridade

### 8.1 Não sobreposição de horários

O PostgreSQL usa uma exclusion constraint GiST para impedir intervalos sobrepostos no mesmo dia. Horários vizinhos, como `09:00–10:00` e `10:00–11:00`, são permitidos.

### 8.2 Um agendamento ativo por horário

Um índice único parcial impede dois agendamentos não cancelados no mesmo slot. Agendamentos cancelados permanecem no histórico e o horário pode ser reutilizado.

### 8.3 Exclusão lógica

Horários não são necessariamente apagados fisicamente. O campo `deleted_at` permite preservar relacionamentos históricos.

### 8.4 Concorrência

As entidades possuem campo de versão para bloqueio otimista. Operações críticas também utilizam mecanismos do banco para garantir integridade mesmo quando duas requisições acontecem quase ao mesmo tempo.

## 9. Limites atuais

- O projeto deve usar somente dados fictícios no ambiente público.
- Arquivos clínicos ainda não possuem armazenamento privado dedicado.
- O rate limiting atual é adequado apenas para uma instância da API.
- Não existe fluxo completo de recuperação de senha.
- Não existe trilha de auditoria administrativa detalhada.
- A publicação inicial deve ser considerada **staging/demonstração**.

## 10. Evoluções recomendadas

- armazenar data de nascimento em vez de idade;
- usar storage privado e URLs temporárias para arquivos;
- documentar o contrato com OpenAPI;
- usar Redis ou gateway para rate limiting distribuído;
- implementar recuperação segura de senha;
- adicionar auditoria de ações administrativas;
- executar testes PostgreSQL com Testcontainers no CI;
- implementar política de retenção e exclusão de dados.
