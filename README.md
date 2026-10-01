# AimBase — Configurações de jogadores e API

Site para consultar configurações, periféricos, perfis de jogadores e lineups de
e-sports. O projeto usa HTML, CSS e JavaScript no frontend, **API PHP** e banco
**MySQL/MariaDB**. A interface está disponível em pt-BR, en, es, fr e de.

### Requisitos

- Apache e PHP com as extensões **PDO MySQL** e **mbstring**.
- MySQL ou MariaDB.
- Laragon é o ambiente local documentado abaixo. Não há etapa de build nem
  dependências npm.

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
├── assets\              # Imagens, CSS, JavaScript e traduções
├── data.js              # Dados estáticos/fallback dos jogadores e lineups
├── shared.js            # Helpers compartilhados (esc, safeUrl, tema, toast)
├── api.js               # Cliente JS da API
├── script.js            # Lógica da página inicial (index.html)
├── profile.js           # Lógica da página de perfil (player.html)
├── index.html
├── player.html
└── lineups.html
```

O CSS fica em `assets/css/`. O seletor de idioma usa `assets/i18n/`.

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

O `seed.sql` insere **dados de exemplo** (jogadores, times, periféricos, settings
e comentários). Também cria a conta `demo` / `demo1234` para testar o painel
localmente. Os dados não são uma fonte oficial de configurações de pro players;
veja o aviso de acesso na seção [Segurança](#segurança).

---

## 4. Como configurar a conexão PHP com MySQL

O arquivo `config/database.php` lê os valores abaixo de variáveis de ambiente e
usa esses padrões quando elas não estão definidas. No Laragon, a configuração
funciona sem alteração quando o usuário `root` não tem senha:

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
> Não versione credenciais reais. Se precisar de senha, defina `DB_PASSWORD` nas
> variáveis de ambiente do Windows em vez de colocá-la no código.

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
| Lineups                      | `http://localhost/prosettings-page-main/lineups.html` |
| Painel administrativo        | `http://localhost/prosettings-page-main/admin/index.php` |

> A partir do `index.html`, os dados dos jogadores são carregados da API via
> `fetch` de `api/players.php`. O frontend também tem fallback com dados estáticos
> caso a API não esteja disponível.

### Idiomas

A interface oferece **pt-BR, en, es, fr e de**. O idioma escolhido fica salvo no
`localStorage`; os textos ficam em `assets/i18n/` e são aplicados por
`assets/i18n/i18n.js`.

---

## 7. Como testar a API

As respostas da aplicação usam o formato JSON
`{ "success": true, "message": "", "data": ... }`. Se a conexão com o banco
falhar, `includes/database.php` retorna `{ "success": false, "error": ... }`.

### Consultas públicas

| Método | Endpoint                              | Descrição                             |
| ------ | ------------------------------------- | ------------------------------------- |
| GET    | `/api/players.php`                    | Lista todos os jogadores              |
| GET    | `/api/players.php?game=valorant`      | Filtra por jogo (slug)                |
| GET    | `/api/players.php?search=gustavo`     | Busca por nick/nome/time              |
| GET    | `/api/players.php?team_id=1`          | Filtra por time                       |
| GET    | `/api/players.php?role=Duelista`       | Filtra por função                     |
| GET    | `/api/players.php?country=Brasil`       | Filtra por país                       |
| GET    | `/api/player.php?id=1`                | Detalhe de um jogador (por id)        |
| GET    | `/api/player.php?slug=pacheco`        | Detalhe de um jogador (por slug)      |
| GET    | `/api/games.php`                      | Lista de jogos                        |
| GET    | `/api/teams.php`                      | Lista de times (com nº de jogadores)  |
| GET    | `/api/peripherals.php`                | Lista de periféricos                  |
| GET    | `/api/peripherals.php?type=mouse`     | Filtra periféricos por tipo           |
| GET    | `/api/filters.php`                    | Metadados para os filtros (jogos, times, funções, países) |
| GET    | `/api/comments.php?player_id=1`       | Lista comentários de um jogador       |

### Conta e comentários

| Método | Endpoint                         | Descrição                                    |
| ------ | -------------------------------- | -------------------------------------------- |
| GET    | `/api/auth.php?action=me`        | Retorna o usuário da sessão (ou null)        |
| POST   | `/api/auth.php?action=register`  | Cria conta (email, username e senha)         |
| POST   | `/api/auth.php?action=login`     | Autentica por e-mail ou username             |
| POST   | `/api/auth.php?action=logout`    | Encerra a sessão                             |
| POST   | `/api/comments.php`              | Publica comentário com nome enviado no corpo |
| DELETE | `/api/comments.php?id=1`         | Exclui comentário (exige sessão)             |

### Escritas de jogadores, jogos, times e periféricos

Os endpoints abaixo criam, editam e excluem registros:

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
| DELETE | `/api/peripherals.php?id=1` | Exclui periférico                        |

> **Atenção nesta versão da `main`:** essas rotas de escrita não verificam sessão
> nem papel de administrador. A área web do painel pede login, mas isso não
> protege chamadas diretas à API. Veja o aviso na seção [Segurança](#segurança).

### Exemplos (curl)

```bash
# Listar jogadores
curl http://localhost/prosettings-page-main/api/players.php

# Buscar "aspas"
curl "http://localhost/prosettings-page-main/api/players.php?search=aspas"

# Detalhe de um jogador
curl http://localhost/prosettings-page-main/api/player.php?id=1

# Criar um jogador
curl -X POST http://localhost/prosettings-page-main/api/players.php \
  -H "Content-Type: application/json" \
  -d '{"nickname":"Exemplo","game_id":1,"role":"Duelista"}'
```

---

## Segurança

- As consultas usam **PDO e prepared statements**; IDs e tipos de periféricos são
  validados, e o painel escapa valores exibidos em HTML.
- As credenciais do banco vêm de variáveis de ambiente; senhas de usuários são
  armazenadas com `password_hash()`.
- A sessão PHP usa cookie `HttpOnly` e `SameSite=Lax`.
- O frontend usa `esc()` para escapar conteúdo dinâmico e `safeUrl()` ao montar
  links e imagens.

O login/registro é real (via API + banco). O botão "Entrar" do site agora usa
esses endpoints. Os botões "Continuar com Discord/Google" continuam sendo apenas
demonstração.

### Acesso na branch `main`

Esta versão tem limitações importantes de acesso: o CORS permite qualquer origem,
e as rotas `POST`, `PUT` e `DELETE` de jogadores, jogos, times e periféricos não
exigem login, token CSRF nem papel de administrador. O painel web exige uma
sessão, mas aceita qualquer conta cadastrada; o banco ainda não tem papéis de
usuário. A criação de comentários também é pública, e o nome vem do corpo da
requisição. O `DELETE` de comentários exige uma sessão, mas não confere se a
pessoa é autora daquele comentário.

Por esses motivos, mantenha esta versão em desenvolvimento local ou proteja o
servidor por outros meios antes de expô-la publicamente. O `seed.sql` inclui a
conta conhecida `demo` / `demo1234`; remova-a ou troque a senha antes de qualquer
implantação.

---

## Estrutura do banco

- `players` (jogadores) → `games`, `teams`
- `player_settings` (1:1 com player; DPI, sens, periféricos, retícula etc.)
- `peripherals` (mouse, keyboard, mousepad, headset, monitor)
- `player_social`, `player_video_settings`, `player_pc_specs` (dados complementares)
- `users` (contas para autenticação) e `comments` (comentários da comunidade)

Índices em `nickname`, `slug`, `game_id`, `team_id` e `type` para consultas rápidas.

> **Para aplicar as novas tabelas** (`users` e `comments`) em um banco já criado,
> rode o trecho final do `database/schema.sql` manualmente (ou reimporte o schema —
> ele usa `CREATE TABLE IF NOT EXISTS`). Depois rode o `database/seed.sql` para
> incluir o usuário demo (**username `demo` / senha `demo1234`**) e comentários de exemplo.
