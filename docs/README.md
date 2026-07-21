# Documentação técnica — NeuroPP Ivina

Esta pasta reúne a documentação técnica da versão integrada do projeto **NeuroPP Ivina**, composta por:

- frontend em React, TypeScript, Vite e Tailwind CSS;
- API REST em Java 21 e Spring Boot;
- autenticação JWT com perfis de acesso;
- persistência em PostgreSQL;
- migrações de banco com Flyway;
- execução local com Docker Compose.

> **Escopo atual:** aplicação demonstrativa e de portfólio. Use somente dados fictícios. Esta versão não deve ser tratada como prontuário eletrônico nem como sistema clínico pronto para armazenar informações reais de pacientes.

## Ordem recomendada de leitura

1. [`ARCHITECTURE.md`](./ARCHITECTURE.md) — visão geral, componentes, camadas e fluxos.
2. [`DEVELOPMENT.md`](./DEVELOPMENT.md) — configuração e execução local.
3. [`API.md`](./API.md) — rotas, autenticação, exemplos e erros.
4. [`DATABASE.md`](./DATABASE.md) — tabelas, relacionamentos e migrations.
5. [`SECURITY.md`](./SECURITY.md) — controles existentes e cuidados obrigatórios.
6. [`DEPLOYMENT.md`](./DEPLOYMENT.md) — publicação de staging passo a passo.
7. [`IMPROVEMENTS.md`](./IMPROVEMENTS.md) — melhorias técnicas realizadas e próximos passos.

## Organização esperada no repositório

```text
neuropp-ivina/
├── backend/
├── docs/
│   ├── README.md
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── DEPLOYMENT.md
│   ├── DEVELOPMENT.md
│   ├── IMPROVEMENTS.md
│   └── SECURITY.md
├── frontend/
├── .gitignore
├── LICENSE
└── README.md
```

## Convenções utilizadas

- Os caminhos do frontend são relativos a `frontend/`.
- Os caminhos da API são relativos a `backend/`.
- A URL local da API é `http://localhost:8080`.
- As rotas de negócio começam com `/api`.
- A URL local do frontend é normalmente `http://localhost:5173`.
- As variáveis reais ficam em arquivos `.env`, que não devem ser versionados.
- Os arquivos `.env.example` devem ser versionados sem valores secretos.

## Estado da documentação

Esta documentação descreve a versão analisada do frontend integrado e da API segura. 