# Desenvolvimento local — NeuroPP Ivina

## 1. Pré-requisitos

### Frontend

- Node.js `20.19.0` ou superior;
- npm compatível com a versão do Node;
- navegador atualizado.

### Backend

- Java 21;
- Docker Desktop, para a forma recomendada de execução;
- Git.

O Maven Wrapper já acompanha o backend, portanto não é obrigatório instalar Maven globalmente.

## 2. Estrutura esperada

```text
neuropp-ivina/
├── backend/
├── docs/
└── frontend/
```

Todos os comandos abaixo partem dessa estrutura.

## 3. Clonar e entrar no projeto

```bash
git clone URL_DO_REPOSITORIO
cd neuropp-ivina
```

## 4. Variáveis de ambiente

### 4.1 Backend

Entre no backend:

```bash
cd backend
```

Copie o exemplo:

#### Git Bash

```bash
cp .env.example .env
```

#### PowerShell

```powershell
Copy-Item .env.example .env
```

Preencha pelo menos:

```env
POSTGRES_DB=neuropp_db
POSTGRES_USER=neuropp_user
POSTGRES_PASSWORD=UMA_SENHA_LOCAL_FORTE
DB_PORT=5433

JWT_SECRET=UM_SEGREDO_LONGO_E_ALEATORIO
JWT_ISSUER=neuropp-ivina-api
JWT_AUDIENCE=neuropp-ivina-web
JWT_ACCESS_TOKEN_TTL=PT1H

CORS_ALLOWED_ORIGINS=http://localhost:5173
APP_TIME_ZONE=America/Recife
BCRYPT_STRENGTH=12

BOOTSTRAP_ADMIN_ENABLED=false
BOOTSTRAP_ADMIN_NAME=Ivina Peixoto
BOOTSTRAP_ADMIN_EMAIL=admin@example.com
BOOTSTRAP_ADMIN_PHONE=81999999999
BOOTSTRAP_ADMIN_PASSWORD=
```

Gerar um segredo JWT com OpenSSL:

```bash
openssl rand -base64 48
```

O `.env` real não deve entrar no Git.

### 4.2 Frontend

```bash
cd ../frontend
```

Copie o exemplo:

```bash
cp .env.example .env
```

Conteúdo local:

```env
VITE_API_URL=http://localhost:8080/api
```

A variável inclui `/api`.

## 5. Execução recomendada do backend

Na pasta `backend/`:

```bash
docker compose up --build
```

O Compose cria:

- PostgreSQL na porta local `5433` por padrão;
- API na porta `8080`.

Executar em segundo plano:

```bash
docker compose up --build -d
```

Ver estado:

```bash
docker compose ps
```

Ver logs:

```bash
docker compose logs -f api
```

Parar:

```bash
docker compose down
```

Parar e apagar o volume local do banco:

```bash
docker compose down -v
```

> O uso de `-v` apaga todos os dados locais do PostgreSQL desse Compose.

## 6. Execução do frontend

Na pasta `frontend/`:

```bash
npm install
npm run dev
```

Endereço comum:

```text
http://localhost:5173
```

Quando o `package-lock.json` estiver correto e já versionado, instalações reproduzíveis podem usar:

```bash
npm ci
```

## 7. Execução do backend sem container da API

É possível usar apenas o banco do Docker:

```bash
cd backend
docker compose up -d db
```

Depois, na mesma pasta:

### Git Bash

```bash
export DB_PASSWORD='SENHA_DO_ENV'
export JWT_SECRET='SEGREDO_DO_ENV'
./mvnw spring-boot:run
```

### PowerShell

```powershell
$env:DB_PASSWORD='SENHA_DO_ENV'
$env:JWT_SECRET='SEGREDO_DO_ENV'
.\mvnw.cmd spring-boot:run
```

A aplicação usa a URL padrão:

```text
jdbc:postgresql://localhost:5433/neuropp_db
```

Para esse modo, as demais variáveis também podem ser definidas no ambiente do terminal.

## 8. Admin inicial

O bootstrap administrativo vem desativado:

```env
BOOTSTRAP_ADMIN_ENABLED=false
```

Em um banco novo, para criar o primeiro admin:

1. escolha e configure uma senha forte que não contenha a parte principal do e-mail;
2. defina todos os campos do admin;
3. altere temporariamente para `true`;
4. inicie a API e confirme a criação;
5. volte imediatamente para `false`;
6. reinicie o serviço.

Exemplo apenas local:

```env
BOOTSTRAP_ADMIN_ENABLED=true
BOOTSTRAP_ADMIN_NAME=Ivina Peixoto
BOOTSTRAP_ADMIN_EMAIL=ivina@example.com
BOOTSTRAP_ADMIN_PHONE=81999999999
BOOTSTRAP_ADMIN_PASSWORD=Montanha-Lua-48-Janela!
```

Nunca use a senha do exemplo em ambiente real.

## 9. Verificações do frontend

```bash
cd frontend
npm run lint
npm run typecheck
npm run build
```

Executar tudo pelo script existente:

```bash
npm run check
```

Visualizar o build:

```bash
npm run preview
```

Não use um TypeScript global antigo com:

```text
tsc -b
```

Use os scripts do projeto ou:

```bash
npx tsc -b
```

## 10. Testes do backend

### Git Bash, Linux ou macOS

```bash
cd backend
./mvnw test
```

### Windows PowerShell ou Prompt

```powershell
cd backend
.\mvnw.cmd test
```

Validação mais completa:

```bash
./mvnw verify
```

Testes existentes incluem:

- carregamento do contexto;
- integração de segurança;
- troca de senha e revogação;
- transições de status;
- política de senha.

Os testes usam H2 no perfil de teste. Para garantir compatibilidade completa das constraints específicas do PostgreSQL, uma evolução recomendada é adicionar Testcontainers.

## 11. Teste manual mínimo

Antes de criar um commit importante:

1. abrir páginas públicas;
2. cadastrar um responsável fictício;
3. entrar como responsável;
4. cadastrar uma criança fictícia;
5. criar horário como admin;
6. realizar agendamento;
7. confirmar e atualizar status;
8. criar e liberar documento;
9. abrir documento como responsável;
10. testar logout e sessão expirada;
11. testar responsividade em tela pequena.

## 12. Comandos úteis

### Frontend

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run preview
npm prune
```

### Backend e Docker

```bash
docker compose up --build -d
docker compose ps
docker compose logs -f api
docker compose down
./mvnw test
./mvnw verify
```

## 13. Problemas comuns

### `vite` não reconhecido

Confirme que está dentro de `frontend/` e execute:

```bash
npm install
npm run dev
```

### Erro ao interpretar `package.json`

Valide se o JSON possui vírgulas, aspas e chaves corretas. Não podem existir caracteres soltos fora dos objetos.

### Porta PostgreSQL ocupada

Altere no `.env`:

```env
DB_PORT=5434
```

Se executar a API fora do Docker, atualize também `DB_URL` para usar a nova porta.

### API reiniciando

```bash
docker compose logs -f api
```

Procure a primeira exceção real, não somente as mensagens finais de encerramento.

### Senha do bootstrap rejeitada

A senha:

- precisa ter de 12 a 72 caracteres;
- não pode ser apenas numérica;
- não deve ser comum;
- não deve conter a parte principal do e-mail.

### Frontend não conecta na API

Verifique:

```env
VITE_API_URL=http://localhost:8080/api
```

Depois reinicie o servidor Vite. Confirme também que o CORS do backend permite `http://localhost:5173`.

### Rota do frontend funciona por clique, mas falha ao atualizar

O servidor de hospedagem precisa redirecionar rotas desconhecidas para `index.html`, pois o projeto usa `BrowserRouter`.

## 14. Arquivos que não devem ser versionados

```text
frontend/node_modules/
frontend/dist/
frontend/.env
backend/target/
backend/.env
*.log
backups do banco
volumes do PostgreSQL
```
