# Melhorias técnicas realizadas — NeuroPP Ivina

## 1. Objetivo da evolução

A versão atual foi organizada para transformar o projeto em uma aplicação full stack mais segura, previsível e adequada para demonstração técnica.

As melhorias foram orientadas por cinco objetivos:

1. integrar frontend e backend de forma consistente;
2. remover segredos e configurações frágeis do código;
3. separar responsabilidades;
4. proteger dados e operações por perfil;
5. preparar execução local, testes e deploy de staging.

## 2. Frontend

### 2.1 Integração centralizada com a API

Foi criado um cliente HTTP em `src/services/api.ts` para:

- normalizar a URL-base;
- montar query parameters;
- enviar JSON;
- adicionar JWT;
- transformar respostas de erro;
- capturar `X-Request-Id`;
- tratar falha de rede;
- redirecionar sessão expirada.

Antes de publicar, a URL pode ser alterada sem mudar o código:

```env
VITE_API_URL=https://api.example.app/api
```

### 2.2 Tipagem dos contratos

Os contratos foram separados em `src/types/`, incluindo:

- autenticação;
- agendamentos;
- disponibilidade;
- crianças;
- documentos;
- respostas e erros da API.

Isso reduz objetos sem tipo e melhora a detecção de erros durante o build.

### 2.3 Separação por áreas

As páginas foram organizadas em:

```text
pages/public
pages/auth
pages/responsible
pages/admin
```

A estrutura torna mais fácil identificar permissões, responsabilidades e rotas.

### 2.4 Proteção por perfil

O componente `RoleRoute` impede a navegação comum de um usuário para uma área incompatível e integra o comportamento de sessão ao roteador.

A API continua sendo a proteção definitiva.

### 2.5 Componentes reutilizáveis

Foram organizados componentes para:

- cabeçalho e rodapé;
- rolagem ao trocar de página;
- feedback de sucesso e erro;
- estado vazio;
- carregamento;
- confirmação;
- paginação;
- botão de voltar.

### 2.6 Carregamento sob demanda

As páginas são carregadas com `lazy` e `Suspense`, reduzindo o código necessário no carregamento inicial e fornecendo feedback enquanto uma rota é baixada.

### 2.7 Conteúdo institucional centralizado

Textos e dados institucionais ficam em:

```text
src/content/siteContent.ts
```

Isso reduz valores espalhados por várias páginas.

### 2.8 Scripts de qualidade

O `package.json` possui scripts para:

```text
lint
typecheck
build
check
preview
```

O build executa o typecheck antes de gerar os arquivos de produção.

## 3. Backend

### 3.1 Configurações externalizadas

Banco, JWT, CORS e bootstrap administrativo passaram a depender de variáveis de ambiente. Isso permite valores diferentes em desenvolvimento e produção sem versionar segredos.

### 3.2 Arquitetura em camadas

O backend foi separado em:

```text
controller
dto
service
repository
entity
mapper
security
exception
config
util
```

Essa separação facilita teste, manutenção e explicação do projeto.

### 3.3 DTOs em vez de entidades expostas

A API recebe e devolve DTOs. Entidades JPA não são utilizadas diretamente como contrato HTTP.

Benefícios:

- menor acoplamento;
- controle sobre os campos expostos;
- validações específicas;
- menor risco de serialização inesperada.

### 3.4 Autenticação JWT pelo Spring Security

A implementação usa recursos oficiais do Spring para validar assinatura, emissor, audiência e expiração.

O token inclui versão ligada ao usuário, permitindo revogação após troca de senha.

### 3.5 Autorizações explícitas

As permissões foram organizadas por rota:

- públicas;
- autenticadas;
- exclusivas de admin;
- exclusivas de responsável;
- negação por padrão para rotas não declaradas.

### 3.6 Política de senha

Foram incluídas regras de tamanho, limite de bytes do BCrypt, bloqueio de senhas comuns, somente numéricas e contendo a parte principal do e-mail.

### 3.7 Troca de senha segura

A troca exige a senha atual e revoga tokens antigos por meio de `token_version`.

### 3.8 Tratamento global de erros

As exceções são convertidas em respostas consistentes com:

- status HTTP;
- código da aplicação;
- mensagem pública;
- caminho;
- data;
- erros por campo;
- request ID.

Stack traces não são enviados ao cliente.

### 3.9 Request ID

Cada requisição recebe um identificador. O frontend consegue exibi-lo ou registrá-lo, e o backend pode localizar a falha correspondente nos logs.

### 3.10 Rate limiting

Login e cadastro possuem proteção inicial por IP, com limites configuráveis por ambiente.

### 3.11 Perfis de ambiente

Foram separados comportamentos de desenvolvimento e produção:

```text
application-dev.properties
application-prod.properties
```

Produção reduz logs de segurança e não exibe SQL.

## 4. Banco de dados

### 4.1 Flyway

O esquema passou a ser criado por migration versionada. O Hibernate apenas valida a estrutura.

### 4.2 Integridade dos horários

A agenda possui constraint para impedir intervalos sobrepostos.

### 4.3 Concorrência de reservas

A reserva é protegida em mais de uma camada:

- lock durante a operação;
- índice único parcial no PostgreSQL;
- bloqueio otimista por versão.

### 4.4 Reutilização após cancelamento

Um horário pode possuir registros cancelados no histórico, mas apenas um agendamento não cancelado. Isso preserva rastreabilidade sem impedir reutilização.

### 4.5 Exclusão lógica

Horários utilizam `deleted_at` para evitar perda de relacionamentos históricos.

### 4.6 Documentos com menor exposição

Listagens devolvem resumos. O conteúdo completo só é solicitado em uma rota específica e protegida.

## 5. Docker e execução

### 5.1 Docker Compose

O ambiente local sobe PostgreSQL e API com:

```bash
docker compose up --build
```

O banco possui health check e a API aguarda o serviço ficar saudável.

### 5.2 Dockerfile em múltiplos estágios

O build usa Maven e Java 21. A execução final usa JRE e usuário não root.

### 5.3 Maven Wrapper

O repositório inclui `mvnw` e `mvnw.cmd`, reduzindo dependência de uma instalação global do Maven.

## 6. Testes

A versão atual inclui testes para:

- carregamento do contexto;
- segurança das rotas;
- segurança da conta e troca de senha;
- política de senha;
- política de transição dos agendamentos.

Os testes ajudam a impedir regressões ao alterar autenticação e regras de negócio.

## 7. Problemas de ambiente diagnosticados durante a integração

Durante a preparação local, foram identificados e tratados pontos comuns em projetos full stack:

- comandos executados na pasta incorreta;
- ausência ou inconsistência de scripts npm;
- `package.json` inválido por caractere solto;
- `package-lock.json` com registry inadequado;
- execução de TypeScript global incompatível;
- dependências `extraneous` no `node_modules`;
- variável obrigatória do PostgreSQL ausente;
- porta local do banco ocupada;
- bootstrap do admin rejeitado pela política de senha;
- reinicialização da API causada por configuração inválida.

Esses diagnósticos também foram incorporados ao guia de desenvolvimento para facilitar manutenção futura.

## 8. Melhorias de documentação

A documentação foi condensada em arquivos com responsabilidades claras:

```text
ARCHITECTURE.md
API.md
DATABASE.md
DEVELOPMENT.md
DEPLOYMENT.md
SECURITY.md
IMPROVEMENTS.md
```

Documentos antigos, relatórios de validação e arquivos temporários podem ser mantidos fora do repositório final ou ter seu conteúdo incorporado nesses documentos.

## 9. Próximos passos antes do deploy

- [ ] reunir frontend e backend em um único repositório;
- [ ] revisar o README principal;
- [ ] confirmar autorização das imagens;
- [ ] revisar `.gitignore` da raiz;
- [ ] executar `npm run check`;
- [ ] executar `./mvnw verify`;
- [ ] procurar segredos no histórico;
- [ ] criar banco de staging;
- [ ] publicar a API;
- [ ] configurar CORS;
- [ ] publicar o frontend;
- [ ] testar todos os fluxos online.

## 10. Evoluções futuras

### Prioridade alta

- armazenamento privado para documentos;
- recuperação de senha;
- auditoria administrativa;
- Testcontainers com PostgreSQL;
- OpenAPI;
- pipeline de CI para frontend e backend.

### Prioridade média

- data de nascimento no lugar de idade;
- filtros e buscas administrativas;
- notificações de agendamento;
- rate limiting centralizado;
- MFA para admin;
- métricas e alertas.

### Antes de uso real

- avaliação jurídica e de privacidade;
- consentimento e política de dados;
- retenção e exclusão;
- backups testados;
- plano de incidentes;
- revisão de infraestrutura e segurança.
