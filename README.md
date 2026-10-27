# AimBase — Banco de Dados + API

Site de configurações e setups de jogadores de e-sports. O AimBase reúne perfis,
settings, periféricos, comentários da comunidade e lineups em uma interface
responsiva disponível em cinco idiomas (pt-BR, en, es, fr e de). O projeto usa
HTML, CSS e JavaScript no frontend, com **API PHP** e **MySQL/MariaDB** para os
recursos de conta e administração.

### Requisitos

- Apache e PHP com as extensões **PDO MySQL** e **mbstring**.
- MySQL ou MariaDB.
- Laragon é a configuração local documentada abaixo. Não há etapa de build nem
  dependências npm: o Apache serve os arquivos do frontend diretamente.

- [1. Onde colocar o projeto no Laragon](#1-onde-colocar-o-projeto-no-laragon)
- [2. Como criar o banco de dados](#2-como-criar-o-banco-de-dados)
- [3. Como importar o arquivo SQL](#3-como-importar-o-arquivo-sql)
- [4. Como configurar a conexão PHP com MySQL](#4-como-configurar-a-conexão-php-com-mysql)
- [5. Variáveis de ambiente](#5-variáveis-de-ambiente)
- [6. Como iniciar o Apache e o MySQL no Laragon](#6-como-iniciar-o-apache-e-o-mysql-no-laragon)
- [7. Páginas e idiomas](#7-páginas-e-idiomas)
- [8. Como testar a API](#8-como-testar-a-api)
- [9. Autenticação e CSRF](#9-autenticação-e-csrf)
- [10. Limites de taxa (rate limit)](#10-limites-de-taxa-rate-limit)
- [Segurança](#segurança)
- [Estrutura do banco](#estrutura-do-banco)
- [Relatório de melhorias](#relatório-de-melhorias)

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
├── config\              # Conexão: database.php (versionado) + database.local.php (seu)
├── database\            # schema.sql, seed.sql, migrations\ e dev\ (seed só local)
├── includes\            # Helpers PHP (auth.php, functions.php, rate_limit.php, database.php)
├── storage\ratelimit\   # Contadores de rate limit (gerados em runtime, bloqueados na web)
├── assets\              # brands\, players\, products\, css\, js\, i18n\ + *.mp4
├── robots.txt
├── sitemap.xml
├── data.js              # Dados estáticos/fallback (defaultPlayers, savedPlayers, valLineups)
├── shared.js            # Helpers (esc, safeUrl, safeCssUrl, textOr, formatDate, tema, toast)
├── api.js               # Cliente JS da API (get, csrf, writes)
├── script.js            # Lógica da página inicial (index.html)
├── profile.js           # Lógica da página de perfil (player.html)
├── index.html
├── player.html
└── lineups.html
```

O CSS fica em `assets/css/` (tokens, base, layout, componentes e páginas). Não há
`style.css` na raiz.

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

### Banco novo

O `schema.sql` cria as tabelas, incluindo `users.role`. Depois importe os dados de
exemplo com `seed.sql`:

### Opção A — phpMyAdmin
1. Em `http://localhost/phpmyadmin`, clique na aba **Import**.
2. Selecione `database/schema.sql` e clique em **Executar**.
3. Repita com `database/seed.sql`.

### Opção B — Linha de comando (MySQL)
Abra o terminal do Laragon ou um terminal na pasta `database` e rode:

```bash
mysql -u root < schema.sql
mysql -u root < seed.sql
```

### Banco já existente

`CREATE TABLE IF NOT EXISTS` cria tabelas que ainda não existem, mas não altera as
que já existem. Se o banco for anterior ao campo de papel dos usuários, execute
`database/migrations/001_users_role.sql` para adicionar `users.role` e seu índice.
Essa migração é idempotente. Depois, importe `database/seed.sql` se também quiser
os dados de exemplo.

O `seed.sql` insere **dados fictícios de exemplo** (jogadores, times, periféricos e
settings) para você testar o sistema. Não são dados reais de pro players, e ele
**não cria nenhuma conta de login** — veja
[Conta de demonstração](#conta-de-demonstração-somente-desenvolvimento).

---

## 4. Como configurar a conexão PHP com MySQL

O arquivo versionado `config/database.php` só tem os **valores padrão**, lidos de
variáveis de ambiente. Ele funciona sem alteração no Laragon, onde o usuário `root`
não tem senha:

```php
'host'     => getenv('DB_HOST') ?: '127.0.0.1',
'port'     => getenv('DB_PORT') ?: '3306',
'database' => getenv('DB_NAME') ?: 'prosettings',
'username' => getenv('DB_USER') ?: 'root',
'password' => getenv('DB_PASSWORD') ?: '',
'charset'  => 'utf8mb4',
```

Se a sua instalação precisar de senha, **não edite esse arquivo**. Copie o exemplo
e preencha localmente:

```
copy config\database.local.php.example config\database.local.php
```

O `config/database.local.php` tem prioridade sobre o `database.php` e já está no
`.gitignore`, então a credencial real nunca entra no repositório. O bloco
`config/` também é bloqueado por `.htaccess`, para o arquivo não ser baixável pela
web.

```php
<?php
// config/database.local.php
return [
    "host"     => "127.0.0.1",
    "port"     => "3306",
    "database" => "prosettings",
    "username" => "root",
    "password" => "sua-senha-aqui",
    "charset"  => "utf8mb4",
];
```

---

## 5. Variáveis de ambiente

| Variável         | Padrão                        | Para que serve                                                                             |
| ---------------- | ----------------------------- | ------------------------------------------------------------------------------------------ |
| `DB_HOST`        | `127.0.0.1`                   | Host do MySQL                                                                                 |
| `DB_PORT`        | `3306`                        | Porta do MySQL                                                                                |
| `DB_NAME`        | `prosettings`                 | Nome do banco                                                                                 |
| `DB_USER`        | `root`                        | Usuário do banco                                                                              |
| `DB_PASSWORD`    | vazio                         | Senha do banco. Evite: use `config/database.local.php`                                         |
| `APP_ENV`        | `production`                  | `dev`, `development` ou `local` exibe a dica da conta de demonstração na tela de login |
| `APP_ORIGIN`     | host atual + origens locais   | Adiciona origens CORS permitidas, separadas por vírgula. Ex.: `https://aimbase.gg,https://www.aimbase.gg` |
| `ADMIN_BASE_HREF`| `/prosettings-page-main/`      | Prefixo de URL do painel, se o projeto não estiver em `/prosettings-page-main/`               |

No Laragon local, nenhuma delas precisa ser definida quando o `root` não tem senha.
Sem `APP_ORIGIN`, o CORS permite a origem do host atual e os hosts locais
(`localhost`, `127.0.0.1` e `::1`). Defina `APP_ORIGIN` para permitir outros
domínios em produção.

> **Nunca defina `APP_ENV=dev` em produção.** É o que faz a tela de login sugerir
> `demo` / `demo1234`.

---

## 6. Como iniciar o Apache e o MySQL no Laragon

1. Abra o **Laragon**.
2. Clique em **Start All** no botão verde.
3. Ambos **Apache** e **MySQL/MariaDB** ficarão verdes quando ativos.

> Confira se o PHP consegue gravar em `storage/ratelimit/`. O rate limit usa essa
> pasta para registrar tentativas; sem permissão, os limites podem não ser
> aplicados corretamente.

## 7. Páginas e idiomas

| Página                | URL                                                                    |
| --------------------- | ---------------------------------------------------------------------- |
| Site principal        | `http://localhost/prosettings-page-main/index.html`                    |
| Perfil de jogador     | `http://localhost/prosettings-page-main/player.html?player=pacheco`    |
| Lineups               | `http://localhost/prosettings-page-main/lineups.html`                  |
| Painel administrativo | `http://localhost/prosettings-page-main/admin/index.php`               |

O `player.html` aceita `?player=<slug>` ou `?id=<id>`. Um slug inexistente não
carrega um perfil vazio: mostra a seção "Jogador não encontrado".

> A partir do `index.html`, os dados dos jogadores são carregados da API via
> `fetch` de `api/players.php`. O frontend também tem fallback com dados estáticos
> caso a API não esteja disponível.

### Idiomas

A interface está em **pt-BR, en, es, fr e de**. O seletor fica no topo das três
páginas; a escolha é salva no `localStorage` e reaplicada nas visitas seguintes.

- Textos fixos vêm de `assets/i18n/{pt-BR,en,es,fr,de}.json`, com
  `data-i18n="chave"` no HTML.
- O que o JS monta é desenhado por `I18N.t()` e redesenhado no evento
  `i18n:changed`.
- **Datas** de comentário são formatadas por idioma via `Intl.DateTimeFormat`
  (`formatDate()` em `shared.js`). **Números técnicos não são localizados**:
  sensibilidade continua em `0.45`, como o jogo mostra.

Ao adicionar uma chave, inclua-a nos cinco arquivos de idioma. O repositório não
inclui um script automático para conferir a paridade entre eles.

---

## 8. Como testar a API

As respostas da aplicação usam JSON no formato
`{ "success": true, "message": "", "data": ... }`. Se a conexão com o banco
falhar, `includes/database.php` retorna `{ "success": false, "error": ... }`.

### Consultas (sem autenticação)

| Método | Endpoint                              | Descrição                             |
| ------ | ------------------------------------- | ------------------------------------- |
| GET    | `/api/players.php`                    | Lista todos os jogadores              |
| GET    | `/api/players.php?game=valorant`      | Filtra por jogo (slug)                |
| GET    | `/api/players.php?search=gustavo`     | Busca por nick/nome/time              |
| GET    | `/api/players.php?team_id=1`          | Filtra por time                       |
| GET    | `/api/players.php?role=Duelista`      | Filtra por função                     |
| GET    | `/api/players.php?country=BR`         | Filtra por país                       |
| GET    | `/api/player.php?id=1`                | Detalhe de um jogador (por id)        |
| GET    | `/api/player.php?slug=pacheco`        | Detalhe de um jogador (por slug)      |
| GET    | `/api/games.php`                      | Lista de jogos                        |
| GET    | `/api/teams.php`                      | Lista de times (com nº de jogadores)  |
| GET    | `/api/peripherals.php`                | Lista de periféricos                  |
| GET    | `/api/peripherals.php?type=mouse`     | Filtra periféricos por tipo           |
| GET    | `/api/filters.php`                    | Metadados para os filtros (jogos, times, funções, países) |
| GET    | `/api/comments.php?player_id=1`       | Lista comentários de um jogador       |

### Sessão

Todas as escritas exigem **sessão + token CSRF** (veja a
[seção 9](#9-autenticação-e-csrf)).

| Método | Endpoint                        | Descrição                                        | Quem pode          |
| ------ | ------------------------------- | ------------------------------------------------ | ----------------- |
| POST   | `/api/auth.php?action=register` | Registra usuário (email+username+senha)           | anyone            |
| POST   | `/api/auth.php?action=login`    | Autentica por e-mail ou username e cria sessão    | anyone            |
| POST   | `/api/auth.php?action=logout`   | Encerra a sessão                                  | anyone logado     |
| POST   | `/api/comments.php`             | Publica um comentário                             | logado            |
| DELETE | `/api/comments.php?id=1`        | Exclui comentário                                 | autor ou admin    |

O autor do comentário **sempre vem da sessão**: o campo `author` do corpo é
ignorado, e o nome mostrado é o `username` de quem está logado.

### Administrativos (exigem `role = admin`)

| Método | Endpoint                    | Descrição                       |
| ------ | --------------------------- | ------------------------------- |
| POST   | `/api/players.php`          | Cria jogador                    |
| PUT    | `/api/players.php`          | Edita jogador (inclui settings) |
| DELETE | `/api/players.php?id=1`     | Exclui jogador                  |
| POST   | `/api/games.php`            | Cria jogo                       |
| PUT    | `/api/games.php`            | Edita jogo                      |
| DELETE | `/api/games.php?id=1`       | Exclui jogo                     |
| POST   | `/api/teams.php`            | Cria time                       |
| PUT    | `/api/teams.php`            | Edita time                      |
| DELETE | `/api/teams.php?id=1`       | Exclui time                     |
| POST   | `/api/peripherals.php`      | Cria periférico                 |
| PUT    | `/api/peripherals.php`      | Edita periférico                |
| DELETE | `/api/peripherals.php?id=1` | Exclui periférico               |

O papel é lido do banco a cada requisição, não só da sessão — um rebaixamento de
papel passa a valer na chamada seguinte, sem esperar novo login.

### Exemplos (curl)

```bash
# Consultas são diretas
curl http://localhost/prosettings-page-main/api/players.php
curl "http://localhost/prosettings-page-main/api/players.php?search=aspas"
curl http://localhost/prosettings-page-main/api/player.php?id=1

# Qualquer escrita precisa do token CSRF da sessão (cookie), então use -c/-b
# para manter o cookie entre as chamadas.
curl -c cookie.txt \
  http://localhost/prosettings-page-main/api/auth.php?action=csrf

# Para usar a conta demo, rode database/dev/seed-dev.sql (veja a seção
# "Conta de demonstração") antes. No campo email, vale e-mail ou username.
# Copie o valor de data.token retornado pela chamada /csrf acima.
curl -c cookie.txt -b cookie.txt -X POST \
  http://localhost/prosettings-page-main/api/auth.php?action=login \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: SEU_TOKEN" \
  -d '{"email":"demo","password":"demo1234"}'

# Criar jogador (agora exige admin logado + token)
curl -c cookie.txt -b cookie.txt -X POST \
  http://localhost/prosettings-page-main/api/players.php \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: SEU_TOKEN" \
  -d '{"nickname":"Exemplo","game_id":1,"role":"Duelista"}'
```

---

## 9. Autenticação e CSRF

O painel e as escritas da API usam `includes/auth.php`:

- **Sessão** com cookie `HttpOnly` / `SameSite=Lax`, marcado `Secure` quando a
  requisição é HTTPS.
- **Papel** (`users.role`) lido do banco a cada requisição. `requireRole('admin')`
  devolve 403 para quem não tem.
- **CSRF**: toda escrita — inclusive login, registro e logout — exige o header
  `X-CSRF-Token` (ou o campo `csrf_token`), comparado em tempo constante com o
  token da sessão. Sem ele ou com token errado, a resposta é **403**.

Para obter o token:

```
GET /api/auth.php?action=csrf   →   { "success": true, "data": { "token": "..." } }
```

O `api.js` faz isso automaticamente (`API.csrf()`); só é preciso fazer à mão ao
chamar a API direto, como nos exemplos acima.

**CORS**: as origens listadas em `APP_ORIGIN` são adicionadas à origem do host
atual e aos hosts locais permitidos por padrão. Em produção, configure
`APP_ORIGIN` para liberar os domínios do site.

---

## 10. Limites de taxa (rate limit)

`includes/rate_limit.php` conta por arquivo em `storage/ratelimit/`, sem
dependência externa. A chave combina ação + sessão + IP (o `X-Forwarded-For` é
ignorado de propósito, porque é falsificável).

| Ação                | Limite      | Janela | Escopo   |
| ------------------- | ----------- | ------ | -------- |
| Registrar conta     | 5 por hora  | 3600s  | por IP   |
| Tentar login        | 10          | 300s   | por IP   |
| Comentar            | 5           | 300s   | por sessão |

Excedendo, a resposta é **429**. O login libera o contador depois de autenticar
com sucesso. Os arquivos têm expiração de 24h e são limpos sozinhos.

---

## Segurança

Backend:

- **PDO + prepared statements** em todas as consultas com dados do usuário, com
  `ATTR_EMULATE_PREPARES = false`.
- **Sessão + token CSRF** nas operações de escrita. A API exige usuário logado
  para comentários e papel `admin` para operações administrativas; o papel é
  consultado no banco a cada requisição (`includes/auth.php`).
- **Token CSRF** em todas as escritas, comparado com `hash_equals`.
- **Rate limit** em login, registro e comentários ([seção 10](#10-limites-de-taxa-rate-limit)).
- **Validação de IDs** (inteiros positivos) e **validação de tipos** de periféricos.
- **Saída HTML sanitizada** com `htmlspecialchars` no painel admin.
- **JSON padronizado** e tratamento de erros que **nunca expõe erros SQL** ao usuário.
- **Credenciais do banco** lidas de variáveis de ambiente ou de
  `config/database.local.php` (ignorado pelo git), nunca hardcoded.
- **Senhas** com `password_hash()` (bcrypt), nunca em texto puro.
- **Diretórios sensíveis bloqueados** por `.htaccess`: `config/`, `database/`
  (incluindo `migrations/` e `dev/`) e `storage/`. Nenhum segredo é baixável pela web.
- **CORS** por allowlist (`APP_ORIGIN`).

Frontend:

- **`esc()`** em toda saída dinâmica.
- **`safeUrl()`** com allowlist: normaliza a URL, aceita só `http`/`https`, e
  recusa credenciais embutidas e caracteres de controle (o parser de URL ignora
  esses caracteres, e é aí que se esconderia um `java\tscript:`).
- **`safeCssUrl()`** escapa o que fecharia um `url("...")` dentro de CSS.

O login/registro é real (via API + banco). O botão "Entrar" do site usa esses
endpoints. Os botões "Continuar com Discord/Google" continuam sendo apenas
demonstração.

> O `profile.js` tem um caminho de fallback **sem API** (quando o banco não
> responde) em que os comentários vão para o `localStorage` e o campo de nome
> continua visível. Com o banco ativo, o formulário exige login e o nome vem da
> sessão.

---

## Estrutura do banco

- `players` (jogadores) → `games`, `teams`
- `player_settings` (1:1 com player; DPI, sens, periféricos, retícula etc.)
- `peripherals` (mouse, keyboard, mousepad, headset, monitor)
- `player_social`, `player_video_settings`, `player_pc_specs` (dados complementares)
- `users` (contas para autenticação, com `role`) e `comments` (comentários da comunidade)

Índices em `nickname`, `slug`, `game_id`, `team_id`, `type` e `role` para consultas
rápidas.

> Em um banco já criado, reimportar `database/schema.sql` cria tabelas ausentes,
> mas não altera tabelas existentes. Se a tabela `users` ainda não tiver a coluna
> `role`, rode `database/migrations/001_users_role.sql`. A migração não promove
> nenhuma conta a administrador.

### Conta de demonstração (somente desenvolvimento)

O `database/seed.sql` traz os dados de exemplo do site, mas **nenhum login** —
em produção não deve existir conta com senha conhecida. A conta de demonstração
do painel (`demo` / `demo1234`) fica em `database/dev/seed-dev.sql`, para rodar
só na sua máquina:

1. `database/schema.sql` (tabelas)
2. `database/seed.sql` (dados de exemplo)
3. `database/dev/seed-dev.sql` (conta admin local)

Em um banco antigo, rode também `database/migrations/001_users_role.sql` antes do
seed de desenvolvimento, caso `users.role` ainda não exista.

O `seed-dev.sql` é seguro para rodar mais de uma vez (`ON DUPLICATE KEY UPDATE`)
e não faz nada se `users.role` não existir — ele imprime um aviso. Para remover a
conta depois:

```sql
DELETE FROM users WHERE username = 'demo';
```

A tela de login do painel só sugere as credenciais com `APP_ENV=dev`.

---

## Relatório de melhorias

O [`RELATORIO.md`](RELATORIO.md) traz o inventário das 19 melhorias da série
`melhorias-seguranca` — o que cada commit fez, por quê, e as pendências conhecidas
(migração não executada, clips de 4K no repositório, validação ainda não feita no
navegador).
