# NodeJS Security

## Ajustes e melhorias

O projeto ainda está em desenvolvimento e as próximas atualizações serão voltadas nas seguintes tarefas:

- [ ] `<task>`

## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

- Você instalou a versão `nodejs16`
- Você instalou a versão mais recente de `npm`
- Você tem uma máquina `<Windows / Linux / Mac>`

## ☕ Clonando e Instalando `<node-security>`

Para clonar o repositório `<node-security>`, siga estas etapas:

```bash
$ git clone <vcs>/node-security.git
```

Para instalar as dependências `<node-security>`, siga estas etapas:

```bash
$ yarn install
```

## ⚙️ Configurando ambiente `<node-security>`

Executar o script de configurações dos hooks de qualidade

```bash
$ yarn prepare
```

Utilizar o arquivo `example.env` como base para a criação dos seguintes arquivos de configuração:

- `.env`
- `test.env`

> Para as configurações dos módulos definir `src/<module>/configs/<module>.config.ts`, seguindo `src/common/configs/app.config.ts` como base.

## 🚀 Usando `<node-security>`

Para usar `<node-security>`, siga estas etapas:

```bash
# development
$ yarn start
# watch mode
$ yarn start:dev
# debug watch mode
$ yarn start:debug
```

## 🧪 Testes

```bash
# unit tests
$ yarn test
# e2e tests
$ yarn test:e2e
# test coverage
$ yarn test:cov
```

## ✅ Gerando arquivo de change log

```bash
yarn changelog # only changelog
yarn changelog:minor # x.y.x
yarn changelog:major # y.x.x
yarn changelog:patch # x.x.y
yarn changelog:alpha # x.x.x-alpha.0
```
