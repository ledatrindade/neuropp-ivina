# Segurança — NeuroPP Ivina

## 1. Escopo

Este documento descreve os controles de segurança existentes na versão atual e os cuidados obrigatórios para desenvolvimento e staging.

> O projeto é demonstrativo. Não armazene dados reais de pacientes, responsáveis ou atendimentos no ambiente público atual.

## 2. Princípios adotados

- segredos fora do código-fonte;
- menor privilégio por perfil;
- validação de entrada;
- autenticação sem sessão no servidor;
- respostas de erro sem stack trace;
- preservação da integridade no banco;
- identificação das requisições;
- proteção básica contra abuso de login e cadastro.

## 3. Segredos e variáveis de ambiente

Credenciais são lidas do ambiente:

```text
DB_PASSWORD
JWT_SECRET
BOOTSTRAP_ADMIN_PASSWORD
```

Nunca versionar:

```text
.env
*.backup
*.sql com dados
logs de produção
tokens JWT
credenciais do Postman
```

O `.env.example` deve conter apenas nomes de variáveis e valores públicos de desenvolvimento.

Se um segredo for publicado:

1. considere-o comprometido;
2. gere um novo valor;
3. altere-o no serviço e nos clientes necessários;
4. remova-o do histórico do Git quando aplicável;
5. revise logs e acessos;
6. documente o incidente.

Somente apagar do commit mais recente não torna o segredo seguro.

## 4. JWT

A API usa Spring Security OAuth2 Resource Server e JWT assinado com HS256.

Validações incluem:

- assinatura;
- emissor (`iss`);
- audiência (`aud`);
- expiração (`exp`);
- validade temporal;
- usuário ativo;
- versão do token.

Configuração:

```env
JWT_SECRET=SEGREDO_ALEATORIO_LONGO
JWT_ISSUER=neuropp-ivina-api
JWT_AUDIENCE=neuropp-ivina-web
JWT_ACCESS_TOKEN_TTL=PT1H
```

O segredo deve ser exclusivo por ambiente. Não reutilize o segredo local em staging ou produção.

## 5. Revogação após troca de senha

Ao trocar a senha, o backend incrementa `token_version` do usuário. Em requisições futuras, tokens antigos deixam de corresponder à versão atual e são rejeitados.

A rota:

```text
PUT /api/account/password
```

exige a senha atual e retorna `204 No Content` quando a troca é concluída.

## 6. Política de senha

Regras atuais:

- mínimo de 12 caracteres;
- máximo de 72 caracteres;
- máximo de 72 bytes para compatibilidade com BCrypt;
- não pode conter somente números;
- rejeita algumas senhas comuns;
- rejeita a parte principal do e-mail quando possui pelo menos quatro caracteres;
- hash BCrypt com custo configurável, padrão `12`.

O frontend pode orientar o usuário, mas a validação definitiva ocorre no backend.

## 7. Autorização

### Rotas públicas

- `GET /api/health`
- `GET /actuator/health`
- `GET /api/availability`
- `POST /api/auth/login`
- `POST /api/responsibles`

### Admin

```text
/api/admin/**
```

Exige `ROLE_ADMIN`.

### Responsável

```text
/api/appointments/my/**
/api/children/my/**
/api/documents/my/**
```

Exige `ROLE_RESPONSIBLE`.

Demais rotas `/api/**` exigem autenticação. Rotas não declaradas são negadas.

O frontend possui proteção de rota para experiência do usuário, mas somente a API é considerada barreira de segurança.

## 8. CORS

As origens permitidas vêm de:

```env
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Configuração atual:

- métodos: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`;
- headers aceitos: `Authorization`, `Content-Type`, `X-Request-Id`;
- header exposto: `X-Request-Id`;
- credenciais por cookie desativadas;
- cache de preflight por 3600 segundos.

Em staging, use somente a origem HTTPS exata do frontend. Não use `*`.

## 9. CSRF e sessão

A API é stateless e usa Bearer Token no header. Por isso:

- sessão HTTP não é criada;
- login por formulário do Spring está desativado;
- HTTP Basic está desativado;
- CSRF está desativado para esse desenho de API.

Caso o projeto mude para autenticação por cookie, a estratégia de CSRF deve ser revista.

## 10. Rate limiting

O login e o cadastro possuem limites configuráveis por IP:

```env
LOGIN_RATE_LIMIT_MAX=10
LOGIN_RATE_LIMIT_WINDOW=PT1M
REGISTRATION_RATE_LIMIT_MAX=5
REGISTRATION_RATE_LIMIT_WINDOW=PT1H
```

Essa implementação é uma proteção inicial em memória. Em múltiplas instâncias, cada instância teria contagem própria. Para escala horizontal, use Redis, API Gateway, WAF ou recurso equivalente.

## 11. Identificação de requisição

O `RequestIdFilter` associa um identificador a cada requisição e o expõe em:

```text
X-Request-Id
```

Erros também contêm `requestId`. Isso permite encontrar a exceção nos logs sem mostrar detalhes internos ao cliente.

Não coloque dados pessoais ou tokens no próprio request ID.

## 12. Tratamento de erros

O backend desativa exposição automática de:

- mensagem interna do servidor;
- stack trace;
- erros de binding internos.

O `GlobalExceptionHandler` converte falhas em códigos previsíveis, como:

```text
VALIDATION_ERROR
INVALID_CREDENTIALS
RESOURCE_NOT_FOUND
BUSINESS_CONFLICT
BUSINESS_RULE_VIOLATION
DATA_CONFLICT
INTERNAL_ERROR
```

Erros inesperados são registrados no servidor, mas o cliente recebe uma mensagem genérica.

## 13. Integridade e concorrência

Proteções atuais:

- lock pessimista em operações críticas de reserva;
- índice único parcial para um agendamento ativo por slot;
- exclusion constraint GiST para horários sobrepostos;
- bloqueio otimista por `version`;
- transações nos services;
- FKs com exclusão restrita.

As validações da aplicação fornecem mensagens melhores; as constraints do banco são a última linha de defesa.

## 14. Documentos de atendimento

Controles atuais:

- documentos pertencem a um agendamento;
- começam não liberados;
- somente admin cria e libera;
- responsável vê apenas documentos liberados e vinculados à própria conta;
- listagens retornam resumo sem o conteúdo completo;
- detalhes são carregados por rota protegida específica.

Limite atual: `file_url` não é, por si só, armazenamento seguro. Para arquivos reais, use storage privado com autorização e URL temporária.

## 15. Dados pessoais e privacidade

No staging público:

- use nomes inventados;
- use e-mails de teste;
- não use telefone real;
- não escreva conteúdo clínico real;
- não envie laudos, fotos ou documentos reais;
- não compartilhe credenciais em capturas de tela.

Antes de uso real, são necessários requisitos jurídicos, consentimento, retenção, exclusão, auditoria, criptografia operacional, controle de acesso e resposta a incidentes.

## 16. Bootstrap administrativo

O bootstrap vem desativado:

```env
BOOTSTRAP_ADMIN_ENABLED=false
```

Use somente uma vez em banco novo. Depois:

- volte para `false`;
- remova a senha do ambiente quando possível;
- confirme que a conta foi criada;
- não mantenha credencial padrão.

## 17. Docker

O `Dockerfile` final:

- usa JRE em vez da imagem completa de build;
- cria usuário de sistema;
- executa a aplicação como usuário não root;
- não copia `.env` para a imagem quando o `.dockerignore` está correto.

Ainda é recomendado:

- analisar vulnerabilidades da imagem;
- fixar políticas de atualização;
- usar registry confiável;
- aplicar limites de CPU e memória no ambiente.

## 18. Checklist antes do push

```bash
git status
git check-ignore -v backend/.env
git check-ignore -v frontend/.env
git grep -n -i "password\|secret\|token\|authorization"
```

- [ ] nenhum `.env` será enviado;
- [ ] nenhuma senha está em README ou coleção do Postman;
- [ ] nenhum token está salvo;
- [ ] nenhum dump de banco está presente;
- [ ] imagens possuem autorização de uso;
- [ ] testes de segurança passam;
- [ ] bootstrap está desativado no ambiente normal.

## 19. Checklist de staging

- [ ] HTTPS no frontend e na API;
- [ ] CORS restrito à origem correta;
- [ ] JWT_SECRET exclusivo;
- [ ] banco exclusivo de staging;
- [ ] usuário do banco com apenas permissões necessárias;
- [ ] dados totalmente fictícios;
- [ ] logs sem segredos;
- [ ] backups não públicos;
- [ ] admin sem senha padrão;
- [ ] `BOOTSTRAP_ADMIN_ENABLED=false` após inicialização.

## 20. Melhorias futuras prioritárias

- recuperação de senha com token único e expiração;
- MFA para administradores;
- auditoria de ações sensíveis;
- storage privado para arquivos;
- rate limiting distribuído;
- rotação de chaves e segredos;
- Content Security Policy no frontend;
- SAST, análise de dependências e scan de container no CI;
- alertas de login suspeito;
- testes de autorização por objeto para todas as rotas.

## 21. Relato responsável de falhas

Uma falha de segurança não deve ser publicada em issue contendo dados reais ou instruções de exploração. O repositório deve indicar um canal privado do mantenedor para relato responsável.
