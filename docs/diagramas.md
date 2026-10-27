# Diagramas do AimBase

Este arquivo reúne os diagramas do projeto em Mermaid. Eles podem ser renderizados
no GitHub, no VS Code (extensão Markdown Preview Mermaid Support) ou em
<https://mermaid.live>. Para a monografia em PDF/DOCX, exporte cada diagrama como
PNG/SVG e insira na seção correspondente.

## Figura D1 — Arquitetura geral

```mermaid
flowchart LR
    subgraph Cliente["Navegador"]
        UI["HTML + CSS + JavaScript"]
        LS["localStorage<br/>(tema, idioma, fallback)"]
        UI --- LS
    end

    subgraph Servidor["Laragon / Apache"]
        WEB["Arquivos estáticos<br/>index, player, lineups"]
        ADMIN["Painel admin<br/>PHP + sessão"]
        API["API REST em PHP<br/>api/*.php"]
    end

    subgraph Dados["Persistência"]
        DB[("MySQL 8.4<br/>prosettings")]
        RL["storage/ratelimit<br/>(contadores em arquivo)"]
    end

    EXT["Google Fonts<br/>YouTube (lineups)"]

    UI -->|HTTPS/HTTP| WEB
    UI -->|fetch JSON| API
    ADMIN -->|fetch JSON| API
    API -->|PDO preparado| DB
    API -->|contadores| RL
    WEB -->|CSS, imagens, vídeos| UI
    UI -->|fontes e iframes| EXT
```

O frontend é estático; o PHP atua apenas na API e no painel administrativo. A
sessão é compartilhada entre site, API e painel por cookie `HttpOnly`.

## Figura D2 — Modelo entidade-relacionamento (DER)

```mermaid
erDiagram
    GAMES ||--o{ PLAYERS : "game_id"
    TEAMS ||--o{ PLAYERS : "team_id"
    PLAYERS ||--|| PLAYER_SETTINGS : "1:1"
    PLAYERS ||--o{ PLAYER_SOCIAL : "possui"
    PLAYERS ||--o{ PLAYER_VIDEO_SETTINGS : "possui"
    PLAYERS ||--o{ PLAYER_PC_SPECS : "possui"
    PLAYERS ||--o{ COMMENTS : "recebe"
    PERIPHERALS ||--o{ PLAYER_SETTINGS : "mouse/teclado/etc."

    GAMES {
        int id PK
        varchar name
        varchar slug UK
        datetime created_at
    }
    TEAMS {
        int id PK
        varchar name
        varchar slug UK
        varchar logo
        varchar country
    }
    PLAYERS {
        int id PK
        varchar nickname
        varchar real_name
        int team_id FK
        int game_id FK
        varchar role
        varchar country
        varchar slug UK
        varchar photo
        text description
        tinyint active
        tinyint is_pro
    }
    PLAYER_SETTINGS {
        int id PK
        int player_id FK,UK
        int dpi
        decimal sensitivity
        int edpi
        int polling_rate
        varchar resolution
        varchar aspect_ratio
        text crosshair
        varchar crosshair_image
        tinyint raw_input
        decimal scoped_sensitivity
        decimal zoom_sensitivity
        varchar agents
        text notes
        int mouse_id FK
        int keyboard_id FK
        int mousepad_id FK
        int headset_id FK
        int monitor_id FK
    }
    PERIPHERALS {
        int id PK
        varchar name
        varchar slug UK
        varchar type
        varchar brand
        text description
    }
    PLAYER_SOCIAL {
        int id PK
        int player_id FK
        varchar platform
        varchar url
    }
    PLAYER_VIDEO_SETTINGS {
        int id PK
        int player_id FK
        varchar setting_key
        varchar setting_value
        int sort_order
    }
    PLAYER_PC_SPECS {
        int id PK
        int player_id FK
        varchar spec_type
        varchar label
        varchar link
        varchar image
        int sort_order
    }
    USERS {
        int id PK
        varchar username UK
        varchar email UK
        varchar password_hash
        varchar role
        datetime created_at
    }
    COMMENTS {
        int id PK
        int player_id FK
        int user_id FK
        varchar author
        text message
        datetime created_at
    }
```

## Figura D3 — Fluxo de login, sessão e CSRF

```mermaid
sequenceDiagram
    participant N as Navegador
    participant A as api/auth.php
    participant S as Sessão PHP
    participant D as MySQL

    N->>A: GET ?action=csrf
    A->>S: cria/recupera sessão
    A-->>N: token CSRF
    N->>A: POST ?action=login + e-mail/senha + X-CSRF-Token
    A->>A: valida CSRF e rate limit
    A->>D: SELECT usuário por e-mail/username
    D-->>A: id, username, password_hash, role
    A->>A: password_verify()
    A->>S: session_regenerate_id(true)
    A-->>N: 200 + usuário (id, username, email, role)
    N->>A: GET ?action=me
    A->>D: relê usuário e papel
    A-->>N: 200 + usuário
```

Pontos importantes:

- o papel (`role`) é lido do banco a cada requisição, e não apenas da sessão;
- qualquer escrita exige o token CSRF, comparado com `hash_equals`;
- o login bem-sucedido limpa o contador de tentativas e regenera o ID da sessão.

## Figura D4 — Fluxo de comentários

```mermaid
flowchart TD
    A["Abre player.html?player=slug"] --> B["profile.js consulta api/player.php"]
    B --> C{API respondeu?}
    C -->|sim| D["Renderiza perfil com dados do banco"]
    C -->|não| E["Usa fallback do data.js"]
    D --> F["API.me() identifica usuário"]
    F --> G["mountForm injeta seção de comentários"]
    G --> H["reload() consulta api/comments.php?player_id"]
    H --> I["renderComments escreve em #commentList"]
    I --> J{Usuário logado?}
    J -->|sim| K["Formulário publica comentário"]
    J -->|não| L["Mostra aviso para entrar na conta"]
    K --> M["POST api/comments.php + CSRF"]
    M --> N["Autor vem da sessão; limite 5/300s"]
    N --> H
```

## Figura D5 — Fluxo do painel administrativo

```mermaid
flowchart LR
    L["admin/login.php"] -->|POST login| A["api/auth.php"]
    A -->|role = admin| D["admin/index.php"]
    D --> P["admin/players.php"]
    D --> G["admin/games.php"]
    D --> T["admin/teams.php"]
    D --> R["admin/peripherals.php"]
    D --> C["admin/comments.php"]
    P --> API["api/players.php"]
    G --> APIG["api/games.php"]
    T --> APIT["api/teams.php"]
    R --> APIR["api/peripherals.php"]
    C --> APIC["api/comments.php"]
    API --> DB[("MySQL")]
    APIG --> DB
    APIT --> DB
    APIR --> DB
    APIC --> DB
```

Todas as páginas do painel passam por `admin/includes/header.php`, que exige
sessão e `role = admin`. Um usuário comum recebe 403; um visitante é redirecionado
para o login.

## Figura D6 — Implantação local no Laragon

```mermaid
flowchart TB
    subgraph Windows["Máquina local"]
        B["Navegador<br/>localhost:8080/prosettings-page-main"]
        AP["Apache 2.4<br/>(Laragon)"]
        PHP["PHP 8.3<br/>PDO MySQL + mbstring"]
        MY["MySQL 8.4<br/>prosettings"]
        FS["Arquivos do projeto<br/>C:\laragon\www\prosettings-page-main"]
        RL["storage/ratelimit"]
    end

    B --> AP
    AP --> PHP
    AP --> FS
    PHP --> MY
    PHP --> RL
    FS --> AP
```

## Como exportar

1. **VS Code**: abra este arquivo no preview e use a extensão de Mermaid, ou
   exporte pelo comando da extensão.
2. **Mermaid Live**: cole cada bloco e exporte PNG em 2× para manter a nitidez.
3. **Pandoc/LaTeX**: use um filtro Mermaid (`mermaid-filter`) ou exporte as
   imagens antes de gerar o PDF.
4. Nomeie os arquivos como `figura-d1-arquitetura.png`, `figura-d2-der.png` etc.,
   e insira na monografia com legenda e fonte.
