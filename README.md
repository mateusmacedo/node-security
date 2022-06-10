# NodeJS Security

## Ajustes e melhorias

O projeto ainda está em desenvolvimento e as próximas atualizações serão voltadas nas seguintes tarefas:

- [ ] `<task>`

## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

- Você instalou a versão `nodejs16`
- Você instalou a versão mais recente de `npm`
- Você tem uma máquina `<Windows / Linux / Mac>`

## ☕ Clonando e Instalando ``<node-security>``

Para clonar o repositório `<node-security>`, siga estas etapas:

```bash
$ git clone <vcs>/node-security.git
```

Para instalar as dependências `<node-security>`, siga estas etapas:

```bash
$ npm run install
```

## ⚙️ Configurando ambiente `<node-security>`

Executar o script de configurações dos hooks de qualidade

```bash
$ npm run prepare
```

Utilizar o arquivo `example.env` como base para a criação dos seguintes arquivos de configuração:

- `.env`
- `test.env`

> Para as configurações dos módulos definir `src/<module>/configs/<module>.config.ts`, seguindo `src/common/configs/app.config.ts` como base.
 
## 🚀 Usando `<node-security>`

Para usar `<node-security>`, siga estas etapas:

```bash
# development
$ npm run start
# watch mode
$ npm run start:dev
# debug watch mode
$ npm run start:debug
```

## 🧪 Testes

```bash
# unit tests
$ npm run test
# e2e tests
$ npm run test:e2e
# test coverage
$ npm run test:cov
```

## ✅ Gerando arquivo de change log

```bash
npm run changelog # only changelog
npm run changelog:minor # x.y.x
npm run changelog:major # y.x.x
npm run changelog:patch # x.x.y
npm run changelog:alpha # x.x.x-alpha.0
```
