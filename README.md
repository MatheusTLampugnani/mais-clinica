
# Mais Clínica

Este repositório contém o código-fonte do sistema **Mais Clínica**, uma aplicação para gerenciamento de atendimentos em clínicas médicas. Este manual fornece instruções passo a passo para configurar e executar o projeto em um ambiente de desenvolvimento.

---

## 1. Pré-requisitos

Antes de iniciar, verifique se você tem os seguintes softwares instalados:

- **Node.js** (versão 18 ou superior)
- **npm** (geralmente instalado com o Node.js)
- **PostgreSQL** (banco de dados relacional)

---

## 2. Configuração do Backend

### Navegue até a pasta do backend

```bash
cd mais-clinica/backend
```

### Instale as dependências

```bash
npm install
```

### Configure o Banco de Dados

1. Certifique-se de que o serviço do PostgreSQL está em execução.
2. Crie um novo banco de dados, por exemplo: `mais_clinica_db`.

### Configure as variáveis de ambiente

Crie um arquivo chamado `.env` na raiz da pasta `backend` com o seguinte conteúdo (ajuste os valores conforme sua configuração local):

```env
# Configuração do Banco de Dados PostgreSQL
DB_HOST=localhost
DB_USER=seu_usuario_postgres
DB_PASSWORD=sua_senha_postgres
DB_NAME=mais_clinica_db
DB_PORT=5432

# Chave secreta para gerar os tokens JWT
JWT_SECRET=uma_chave_secreta_forte_e_longa_aqui

# Porta da aplicação
PORT=3001
```

### Inicie o servidor backend

```bash
npm start
```

O backend estará rodando em: [http://localhost:3001](http://localhost:3001)

---

## 3. Configuração do Frontend

### Abra um novo terminal

Mantenha o terminal do backend em execução e abra um novo terminal.

### Navegue até a pasta do frontend

```bash
cd mais-clinica/frontend
```

### Instale as dependências

```bash
npm install
```

### Inicie o servidor frontend

```bash
npm run dev
```

O frontend estará disponível no endereço exibido no terminal (geralmente: [http://localhost:5173](http://localhost:5173))

---

## 4. Acessando e Usando o Sistema

### Primeiro acesso

1. Abra seu navegador e acesse: [http://localhost:5173](http://localhost:5173)
2. Clique em **"Cadastre-se"** para criar o primeiro usuário.
3. Preencha os dados e selecione o perfil **"Administrador"**.
4. Após o cadastro, faça o login com as credenciais criadas.

### Fluxo de uso por perfil

- **Administrador:** Acesse o painel do administrador para cadastrar Convênios, Especialidades, Médicos e Pacientes.
- **Recepcionista:** Utilize a tela principal para agendar consultas para os pacientes e médicos cadastrados.
- **Médico:** Acesse seu painel para visualizar consultas, atender pacientes e preencher prontuários, incluindo upload de exames.
- **Paciente:** Acesse seu painel para visualizar o histórico e os detalhes de suas consultas.
