
# Dev-Stickers
O **Dev-Stickers** é um álbum digital de figurinhas inspirado na Copa do Mundo. O projeto foi idealizado para consolidar conhecimentos em desenvolvimento Full Stack, aplicando na prática conceitos de persistência de dados e segurança na web.

O principal objetivo técnico deste projeto é implementar autenticação segura utilizando **JWT (JSON Web Tokens)** e aprofundar o domínio no gerenciamento e modelagem de **bancos de dados relacionais**.

<video src="https://github.com/user-attachments/assets/fbb8f8de-f8f4-4289-a736-beb8089388d7" autoplay loop muted playsinline width="100%"></video>

## 🎯 Funcionalidades 

* **Cadastro e Autenticação:** Criação de conta segura e controle de acesso via login com tokens JWT.
* **Álbum Exclusivo:** Cada usuário possui seu próprio registro de figurinhas salvas no banco de dados.
* **Marcação de Figurinhas:** Interface interativa para marcar e desmarcar as figurinhas adquiridas de cada seleção.
* **Persistência de Dados:** Salvamento automático do progresso do álbum no SQLite.


## 🛠️ Tecnologias Utilizadas

Este projeto foi desenvolvido de forma Full Stack utilizando as seguintes tecnologias:

### Back-end
* **Linguagem:** Python
* **Banco de Dados:** Sqlite
* **Autenticação:** JWT

### Front-end
* **Estruturação:** HTML
* **Estilização:** CSS
* **Interatividade:** Javascript

## 🔧 Configuração e Setup

### Passo 1: Configurar Variáveis de Ambiente

Na raiz do projeto, crie um arquivo `.env` copiando o exemplo:

```bash
cp .env.example .env
```

Abra o arquivo `.env` e configure o `JWT_SECRET`:

```env
SECRET_KEY="insira_sua_chave_aqui"
```

### Passo 2: Criar Ambiente Virtual e Instalar Dependências

```bash
# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows:
venv\Scripts\activate

# Linux/macOS:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt
```

### Passo 3: Criar os Bancos de Dados

Execute os scripts de criação dos bancos de dados do projeto.

```bash
python Back-end/database-files/criar-users.py
python Back-end/database-files/criar-selecoes.py
python Back-end/database-files/criar-figurinhas.py
```

### Passo 4: Importar Dados das Seleções e Figurinhas

> ⚠️ **Importante:** Sempre importe `selecoes.sql` antes de `figurinhas.sql`, pois as figurinhas dependem das seleções.

#### No Windows/Linux/macOS:

Ainda na raiz do projeto, execute a importação apontando para o caminho dos arquivos `.sql` que estão dentro da pasta:

```bash
sqlite3 banco-selecoes < Back-end/database-files/selecoes.sql
sqlite3 banco-figurinhas < Back-end/database-files/stickers.sql
```

### Passo 5: Iniciar o Servidor

```bash
python Back-end/main.py
```




