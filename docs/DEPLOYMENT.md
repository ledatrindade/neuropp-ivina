# Deploy de staging — NeuroPP Ivina

## 1. Objetivo

O primeiro deploy deve ser tratado como **staging/demonstração de portfólio**. O ambiente será usado para validar:

- integração entre frontend, API e PostgreSQL;
- variáveis de ambiente;
- CORS;
- migrations Flyway;
- autenticação e autorização;
- comportamento das rotas em produção.

Use somente dados fictícios.

## 2. Arquitetura de publicação

```text
Frontend estático
      ↓ HTTPS
API Spring Boot
      ↓ conexão privada/TLS
PostgreSQL gerenciado
```

O frontend e o backend podem ser publicados em serviços diferentes. O banco deve ser acessado somente pela API.

## 3. Ordem correta

```text
1. Revisar repositório e segredos
2. Criar PostgreSQL de staging
3. Publicar a API
4. Testar a API e o Flyway
5. Criar o primeiro admin
6. Configurar CORS
7. Publicar o frontend
8. Testar os fluxos completos
9. Desativar o bootstrap administrativo
```

## 4. Pré-deploy

### 4.1 Frontend

```bash
cd frontend
npm ci
npm run check
```

### 4.2 Backend

```bash
cd backend
./mvnw verify
```

Teste também a imagem:

```bash
docker build -t neuropp-api:staging .
```

### 4.3 Buscar segredos antes do push

```bash
git status
git check-ignore -v frontend/.env
git check-ignore -v backend/.env
git grep -n -i "password\|jwt_secret\|postgres_password\|bearer "
```

Analise os resultados. Nomes de variáveis podem aparecer; valores reais não.

## 5. Banco PostgreSQL

Crie um banco vazio de staging. Obtenha do provedor:

- host;
- porta;
- nome do banco;
- usuário;
- senha;
- URL JDBC ou URL PostgreSQL;
- necessidade de SSL.

A aplicação espera uma URL JDBC:

```text
jdbc:postgresql://HOST:PORT/NOME_DO_BANCO
```

Exemplo genérico:

```text
jdbc:postgresql://db.example.internal:5432/neuropp_db
```

Antes de publicar, confirme suporte à extensão:

```text
btree_gist
```

A migration inicial depende dela para impedir horários sobrepostos.

## 6. Variáveis da API

Configure no serviço do backend:

| Variável | Obrigatória | Exemplo seguro |
|---|---:|---|
| `SPRING_PROFILES_ACTIVE` | sim | `prod` |
| `SERVER_PORT` | depende do provedor | porta fornecida pelo ambiente |
| `DB_URL` | sim | URL JDBC do PostgreSQL |
| `DB_USERNAME` | sim | usuário do banco |
| `DB_PASSWORD` | sim | segredo do banco |
| `JWT_SECRET` | sim | segredo aleatório longo |
| `JWT_ISSUER` | recomendada | `neuropp-ivina-api` |
| `JWT_AUDIENCE` | recomendada | `neuropp-ivina-web` |
| `JWT_ACCESS_TOKEN_TTL` | recomendada | `PT1H` |
| `CORS_ALLOWED_ORIGINS` | sim | URL HTTPS exata do frontend |
| `APP_TIME_ZONE` | recomendada | `America/Recife` |
| `BCRYPT_STRENGTH` | recomendada | `12` |
| `BOOTSTRAP_ADMIN_ENABLED` | sim | `false` normalmente |
| `BOOTSTRAP_ADMIN_NAME` | apenas bootstrap | nome do admin |
| `BOOTSTRAP_ADMIN_EMAIL` | apenas bootstrap | e-mail do admin |
| `BOOTSTRAP_ADMIN_PHONE` | apenas bootstrap | telefone |
| `BOOTSTRAP_ADMIN_PASSWORD` | apenas bootstrap | senha forte temporária |

Gere `JWT_SECRET` com pelo menos 48 bytes aleatórios:

```bash
openssl rand -base64 48
```

Não reutilize o segredo local.

## 7. Porta da API

O projeto aceita:

```properties
server.port=${SERVER_PORT:8080}
```

Quando o provedor injeta `SERVER_PORT`, a aplicação utiliza esse valor. Caso contrário, usa `8080`.

## 8. Build e inicialização da API

O `Dockerfile` usa build em múltiplos estágios:

1. Maven e Java 21 compilam o JAR;
2. uma imagem JRE menor executa o arquivo;
3. o processo roda com usuário não root;
4. a porta exposta é `8080`.

Comando de execução fora de Docker:

```bash
java -jar app.jar
```

Em plataformas com Docker, o `ENTRYPOINT` já está definido.

## 9. Primeira inicialização e Flyway

Ao iniciar, procure nos logs por mensagens equivalentes a:

```text
Successfully validated ... migration
Migrating schema ...
Successfully applied ... migration
```

A aplicação deve iniciar sem erros de validação do Hibernate.

Teste:

```http
GET https://URL_DA_API/api/health
```

Resposta esperada:

```json
{
  "status": "UP",
  "service": "neuropp-ivina-api"
}
```

## 10. Bootstrap do administrador

Em um banco novo:

1. configure os dados do admin;
2. defina `BOOTSTRAP_ADMIN_ENABLED=true`;
3. publique ou reinicie a API;
4. confirme nos logs que o admin foi criado;
5. teste o login;
6. altere `BOOTSTRAP_ADMIN_ENABLED=false`;
7. remova `BOOTSTRAP_ADMIN_PASSWORD` do ambiente, quando possível;
8. reinicie novamente.

A senha não deve conter a parte principal do e-mail.

## 11. CORS

Quando o frontend ainda não foi publicado, é possível usar temporariamente uma URL planejada. Assim que o provedor entregar a URL real, configure:

```env
CORS_ALLOWED_ORIGINS=https://seu-frontend.example.app
```

Use a origem exata:

- com `https://`;
- sem caminho `/api`;
- sem barra final, salvo se a configuração final exigir;
- sem `*`.

Para múltiplas origens, confirme o formato aceito pela propriedade configurada na versão atual antes de inserir a lista.

## 12. Variável do frontend

Depois que a API tiver uma URL pública:

```env
VITE_API_URL=https://sua-api.example.app/api
```

Essa variável é incorporada durante o build. Após alterá-la, faça um novo deploy do frontend.

Não use em produção:

```env
VITE_API_URL=http://localhost:8080/api
```

Para o navegador do visitante, `localhost` significa o computador do próprio visitante.

## 13. Build do frontend

Comandos:

```bash
cd frontend
npm ci
npm run build
```

Diretório de saída:

```text
frontend/dist
```

Configuração típica do serviço estático:

| Campo | Valor |
|---|---|
| diretório raiz | `frontend` |
| comando de instalação | `npm ci` |
| comando de build | `npm run build` |
| diretório publicado | `dist` |

## 14. Fallback de SPA

O projeto usa `BrowserRouter`. Ao abrir diretamente `/admin` ou `/responsavel/documentos`, o servidor precisa devolver `index.html`.

### Nginx

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Regra genérica

```text
/* → /index.html com status 200
```

Cada provedor possui um formato próprio para rewrites.

## 15. Checklist pós-deploy

### API

- [ ] `/api/health` responde `200`.
- [ ] Flyway aplicou a migration.
- [ ] não há stack trace ou segredo nos logs públicos.
- [ ] login admin funciona.
- [ ] bootstrap voltou para `false`.
- [ ] token expirado retorna `401`.
- [ ] perfil incorreto retorna `403`.

### Frontend

- [ ] abre por HTTPS.
- [ ] título e favicon aparecem.
- [ ] atualização direta de uma rota não retorna `404`.
- [ ] chamadas apontam para a API publicada.
- [ ] não há erro de CORS.
- [ ] sessão expirada redireciona ao login.

### Fluxos

- [ ] cadastro com dados fictícios.
- [ ] cadastro de criança fictícia.
- [ ] criação de horário.
- [ ] agendamento.
- [ ] cancelamento e reagendamento.
- [ ] mudança de status.
- [ ] criação e liberação de documento fictício.
- [ ] acesso do responsável somente aos próprios dados.

## 16. Observabilidade básica

Use o `requestId` para investigar erros:

1. copie o `X-Request-Id` mostrado na resposta;
2. pesquise esse valor nos logs da API;
3. identifique a exceção sem expor stack trace ao usuário.

Monitore também:

- reinicializações do container;
- uso de memória;
- falhas de conexão com PostgreSQL;
- status do health check;
- espaço e conexões do banco.

## 17. Rollback

Antes de mudar o schema:

- mantenha backup do banco;
- preserve a versão anterior da imagem da API;
- não edite uma migration já aplicada;
- publique uma nova migration para correções.

Se o frontend falhar, reverta para o deploy anterior. Se a API falhar antes de uma migration, reverta a imagem. Depois que uma migration destrutiva for aplicada, o rollback exige procedimento de banco específico — por isso migrations destrutivas devem ser evitadas e testadas.

## 18. Produção real

Antes de transformar o staging em sistema real, ainda seriam necessários, entre outros:

- análise jurídica e de privacidade;
- política de consentimento, retenção e exclusão;
- armazenamento privado de documentos;
- backups testados;
- auditoria de acessos;
- recuperação de senha;
- gestão de incidentes;
- testes de carga e segurança;
- monitoramento e alertas;
- revisão profissional da infraestrutura.
