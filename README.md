# ProSens — Banco de Dados + API

Site de configurações e setups de jogadores profissionais de e-sports, com banco de
dados local (**MySQL/MariaDB via Laragon**), **API PHP** e **painel administrativo**.

---

## 1. Onde colocar o projeto no Laragon

Copie a pasta do projeto para o diretório `www` do Laragon:

```
C:\laragon\www\prosettings-page-main\
```

O projeto deve ficar em:

```
C:\laragon\www\prosettings-page-main\
├── api\                 # Endpoints REST (PHP)
├── admin\               # Painel administrativo
├── config\              # Configuração da conexão
├── database\            # schema.sql e seed.sql
├── includes\            # Helpers PHP
├── assets\              # Imagens
├── api.js               # Cliente JS da API
├── index.html
├── player.html
├── script.js
└── style.css
```

> Acesse pelo navegador em: `http://localhost/prosettings-page-main/`

---

## 2. Como criar o banco de dados

1. Abra o **Laragon** e clique em **Start All** (inicia Apache e MySQL).
2. Clique em **Database** (ícone de banco de dados) para abrir o phpMyAdmin,
   ou use a linha de comando.
3. O banco `prosettings` é criado automaticamente pelo `schema.sql` (usando
   `CREATE DATABASE IF NOT EXISTS`).

---

## 3. Como importar o arquivo SQL

Importe **primeiro** o schema e **depois** o seed, na ordem correta.

### Opção A — phpMyAdmin
1. Em `http://localhost/phpmyadmin`, clique na aba **Import**.
2. Selecione o arquivo `database/schema.sql` e clique em **Executar**.
3. Repita o processo com `database/seed.sql`.

### Opção B — Linha de comando (MySQL)
Abra o terminal do Laragon ou um terminal na pasta `database` e rode:

```bash
mysql -u root < schema.sql
mysql -u root < seed.sql
```

O `seed.sql` insere **dados fictícios de exemplo** (jogadores, times, periféricos e
settings) para você testar o sistema. Não são dados reais de pro players.

---

## 4. Como configurar a conexão PHP com MySQL

Edite o arquivo `config/database.php` se necessário. Os valores padrão são os que o
Laragon usa por padrão:

```php
'host'     => '127.0.0.1',
'port'     => '3306',
'database' => 'prosettings',
'username' => 'root',
'password' => '',
'charset'  => 'utf8mb4',
```

> **Nenhuma senha real fica no código.** O arquivo lê variáveis de ambiente
> (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`). Em um ambiente
> básico do Laragon, o usuário `root` sem senha funciona sem alteração.
>
> Nunca versionar credenciais reais. Se precisar de senha, defina a variável de
> ambiente `DB_PASSWORD` no Windows em vez de colocar no código.

---

## 5. Como iniciar o Apache e o MySQL no Laragon

1. Abra o **Laragon**.
2. Clique em **Start All** no botão verde.
3. Ambos **Apache** e **MySQL/MariaDB** ficarão verdes quando ativos.

---

## 6. Como acessar o projeto pelo navegador

| Página                       | URL                                                   |
| ---------------------------- | ----------------------------------------------------- |
| Site principal               | `http://localhost/prosettings-page-main/index.html`   |
| Perfil de jogador            | `http://localhost/prosettings-page-main/player.html?player=pacheco` |
| Painel administrativo        | `http://localhost/prosettings-page-main/admin/index.php` |

> A partir do `index.html`, os dados dos jogadores são carregados da API via
> `fetch` de `api/players.php`. O frontend também tem fallback com dados estáticos
> caso a API não esteja disponível.

---

## 7. Como testar a API

Todos os endpoints retornam JSON no formato:
`{ "success": true, "message": "", "data": ... }`

### Públicos (consultas)

| Método | Endpoint                              | Descrição                             |
| ------ | ------------------------------------- | ------------------------------------- |
| GET    | `/api/players.php`                    | Lista todos os jogadores              |
| GET    | `/api/players.php?game=valorant`      | Filtra por jogo (slug)                |
| GET    | `/api/players.php?search=gustavo`     | Busca por nick/nome/time              |
| GET    | `/api/players.php?team_id=1`          | Filtra por time                       |
| GET    | `/api/player.php?id=1`                | Detalhe de um jogador (por id)        |
| GET    | `/api/player.php?slug=pacheco`        | Detalhe de um jogador (por slug)      |
| GET    | `/api/games.php`                      | Lista de jogos                        |
| GET    | `/api/teams.php`                      | Lista de times (com nº de jogadores)  |
| GET    | `/api/peripherals.php`                | Lista de periféricos                  |
| GET    | `/api/peripherals.php?type=mouse`     | Filtra periféricos por tipo           |

### Administrativos

| Método | Endpoint                 | Descrição                              |
| ------ | ------------------------ | -------------------------------------- |
| POST   | `/api/players.php`       | Cria jogador                           |
| PUT    | `/api/players.php`       | Edita jogador (inclui settings)        |
| DELETE | `/api/players.php?id=1`  | Exclui jogador                         |
| POST   | `/api/games.php`         | Cria jogo                              |
| PUT    | `/api/games.php`         | Edita jogo                             |
| DELETE | `/api/games.php?id=1`    | Exclui jogo                            |
| POST   | `/api/teams.php`         | Cria time                              |
| PUT    | `/api/teams.php`         | Edita time                             |
| DELETE | `/api/teams.php?id=1`    | Exclui time                            |
| POST   | `/api/peripherals.php`   | Cria periférico                        |
| PUT    | `/api/peripherals.php`   | Edita periférico                       |
| DELETE | `/api/peripherals.php?id=1` | Exclui periférico                    |

### Exemplos (PowerShell/curl)

```bash
# Listar jogadores
curl http://localhost/prosettings-page-main/api/players.php

# Buscar "aspas"
curl "http://localhost/prosettings-page-main/api/players.php?search=aspas"

# Detalhe de um jogador
curl http://localhost/prosettings-page-main/api/player.php?id=1

# Criar um jogador (admin)
curl -X POST http://localhost/prosettings-page-main/api/players.php \
  -H "Content-Type: application/json" \
  -d '{"nickname":"Exemplo","game_id":1,"role":"Duelista"}'
```

---

## Segurança

- **PDO + prepared statements** em todas as consultas com dados do usuário.
- **Validação de IDs** (inteiros positivos) e **validação de tipos** de periféricos.
- **Saída HTML sanitizada** com `htmlspecialchars` no painel admin.
- **JSON padronizado** e tratamento de erros que **nunca expõe erros SQL** ao usuário.
- **Credenciais do banco** são lidas de variáveis de ambiente, nunca hardcoded.

O painel admin ainda **não tem autenticação** nesta versão (conforme solicitado). A
estrutura está preparada para adicionar login/autenticação posteriormente.

---

## Estrutura do banco

- `players` (jogadores) → `games`, `teams`
- `player_settings` (1:1 com player; DPI, sens, periféricos, retícula etc.)
- `peripherals` (mouse, keyboard, mousepad, headset, monitor)
- `player_social`, `player_video_settings`, `player_pc_specs` (dados complementares)

Índices em `nickname`, `slug`, `game_id`, `team_id` e `type` para consultas rápidas.
