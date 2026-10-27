# AimBase — Relatório de Melhorias

Branch: `melhorias-seguranca` · 19 commits · 58 arquivos, +2037 / −487

Trabalho dividido em quatro frentes: **segurança** (A), **correção de
comportamento** (B), **refatoração** (C), **internacionalização e qualidade**
(D1/D2, E1–E4, F1). Cada frente é um commit isolado, com `php -l`,
`node --check`, verificação de encoding e testes antes de fechar.

---

## 1. Segurança (A1–A5)

### A1 — `ce48032` Sessão e papel de admin

O painel e as escritas da API não checavam quem estava logado: qualquer
chamada POST/PUT/DELETE chegava ao banco. Agora existe
`includes/auth.php` com:

- `bootSession()` — cookie `HttpOnly` / `SameSite=Lax`, marcado `Secure`
  quando a requisição é HTTPS (`isHttpsRequest()`);
- `currentUser()` — lê o usuário do banco, não só a sessão, com `role`;
- `requireUser()` / `requireRole('admin')` — encerram com 403;
- `requireAdminWrite()` — sessão + papel + CSRF em um atalho.

Motivo de ler o papel do banco a cada requisição: confiar em `$_SESSION`
faria um rebaixamento de papel só aparecer no login seguinte.

### A2 — `7a4e6f3` Token CSRF e CORS restrito

Todas as escritas exigem `X-CSRF-Token` (ou `csrf_token`), comparado em
tempo constante (`hash_equals`) com o token da sessão. Sem ele, resposta
403. O CORS passou a usar allowlist (`allowedOrigins()`): sem `APP_ORIGIN`,
só a própria origem e os hosts locais do Laragon passam; preflight `OPTIONS`
é respondido no `applyCors()` e encerra o script.

### A3 — `f9f85dc` Comentários autenticados e com rate limit

`api/comments.php` aceitia POST anônimo com o nome digitado no formulário:
dava para_impostar texto falso em nome de qualquer pessoa. Agora exige
sessão e usa o `username` da sessão como autor, ignorando o campo do
cliente. O `includes/rate_limit.php` limita por sessão (com fallback por IP
sem sessão) e o diretório de armazenamento ficou com `.htaccess` negando
acesso web.

### A4 — `4157fb1` Credenciais de demonstração removidas do seed

O `database/seed.sql` continha um usuário com senha conhecida. A conta
`demo` / `demo1234` foi movida para `database/dev/seed-dev.sql`, protegida
por `.htaccess`, e o `schema.sql` passou a descrever `users.role`. Os
diretórios `config/`, `database/`, `database/migrations/`, `storage/` e
`config/database.local.php.example` ganharam bloqueio de acesso web, e
`.gitignore` passou a ignorar o config local.

### A5 — `2d6525f` `safeUrl()` com allowlist e `safeCssUrl()`

Havia `esc()` em URLs, que escapa para HTML mas não impede esquemas
perigosos (`javascript:`, `data:`). `validatedUrl()` agora normaliza via
`URL()`, recusa esquema fora de http(s), credenciais embutidas e
caracteres de controle — que o parser de URL ignora e que escondiam
`java\tscript:`. `safeCssUrl()` escapa `" ' \ )` para não fechar a regra
`url("...")` de um `style.backgroundImage`.

---

## 2. Correção de comportamento (B1–B3)

### B1 — `fe45378` `pcSpecs` e JSON inválido

`pcSpecs` vinha sem o tipo do item, então o painel não distinguiia
periférico de componente. Adicionado `spec_type` no SELECT. E
`API.handle()` engolia JSON malformado e devolvia `false` silencioso; agora
lança, e o erro cita `HTTP <status>` para o log do servidor diferenciar
404 de 500.

### B2 — `1dd4f94` Identificadores próprios e alt traduzido

`scopedSensitivity` era localizado por `childNodes[2]` e a breadcrumb por
`.breadcrumb span` — qualquer inserção quebrava. Ambos ganharam `id`. A
img da retícula usava `data-i18n-aria-label`, que não substitui o texto
alternativo: um leitor de tela continuaria lendo o `alt` estático em
português. Novo atributo `data-i18n-alt`, tratado por `apply()` e incluído
no `attributeFilter` do `MutationObserver`.

### B3 — `1fde1cc` 404 real e filtro de sensibilidade por jogo

Jogador inexistente caía em uma página quase vazia. Agora há
`#profileNotFound` com CSS em `assets/css/components/utility.css`, e o
título vai para `page.notFoundTitle`. O filtro de sensibilidade usava as
faixas de VALORANT para os três jogos: as faixas passaram a ser por jogo
(`sens.valorant.*`, `sens.cs2.*`, `sens.r6.*`), com o dono dos rótulos em
`updateSensitivityLabels()`. Como esses textos são montados por JS, o
`i18n.js` passou a emitir `i18n:changed` também no carregamento inicial,
não só na troca de idioma.

---

## 3. Refatoração (C1–C3)

### C1 — `89d4911` `message()` duplicado e boot único

Havia dois `message()` (um no `script.js`, outro no `api.js`) e o
`#authSwitch` recriava o próprio `<button>` a cada troca de modo,
religando o listener e acumulando handlers. O botão virou elemento fixo
no HTML e só os textos mudam. O boot ficou em um `refreshPlayers()` só.

### C2 — `277c800` `$` e `initTheme()` centralizados

As três páginas declaravam o mesmo `$` e o mesmo par
`applyTheme` + listener do toggle. Ambos foram para `shared.js`; o
`initTheme()` de `lineups.js` ainda protegia o botão com um `if` que não
faz sentido — o elemento é opcional por decisão, não por acaso.

### C3 — `3c35bf5` Leituras por `API.get()`

Nove chamadas repetiam o mesmo `fetch` + `res.ok` + parse. Viraram
`API.get(url, options)`, e o `csrf()` deixou de fazer uma leitura só para
pegar o token. Os erros passaram a citar o status HTTP.

---

## 4. Internacionalização e qualidade

### D1 — `d41ee8a` Textos fixos traduzidos nos cinco idiomas

Cerca de 60 chaves novas nos cinco dicionários (194 chaves por idioma), e
a decisão de desenho que mais importou: **time, função e país passam a
guardar `null` na camada de dados** (`mapPlayerForUi`, em `api.js`) em vez
de um texto já traduzido. A tradução acontece na exibição, via
`textOr(value, key)` em `shared.js`. Se o mapeamento gravasse
"Sem time", trocar de idioma deixaria o rótulo velho na tela — o dado não
deveria carregar idioma.

Como o i18n só reescreve o que tem `data-i18n`, o que é montado por JS
precisa de aviso: `script.js`, `profile.js` e `assets/js/lineups.js`
escutam `i18n:changed` e redesenham. As seções montadas por JS (comentários,
rodapé, `.player-meta`, vídeo/PC/clips) são removidas antes de recriar, senão
duplicariam a cada troca — e os listeners de `profile.js` são registrados
uma vez, com a flag `listenersBound`.

O `JS_FALLBACKS` ganhou chaves porque `setAuthMode()` roda já no parse do
`script.js`, antes do dicionário carregar. `directory.count` foi criada e
removida por ser duplicata de `directory.players`.

### D2 — `865ee6e` Datas via `Intl`

`toLocaleDateString(I18N.lang || 'pt-BR')` virava `formatDate()` em
`shared.js`, com `Intl.DateTimeFormat` e placeholder `–` para data
ausente/inválida (o código antigo imprimia `Invalid Date`). Decisão
deliberada: **números não foram localizados**. Sensibilidade é valor
técnico e `0.45` é como o jogo mostra; trocar para `0,45` só causaria
dúvida. Vale registrar se a decisão mudar.

### E1 — `44fa28b` Mídia sob demanda

- imagens geradas (cards, produtos, logos, social) com `loading="lazy"` e
  `decoding="async"`, para não disputar a primeira renderização;
- banner do hero com `width`/`height` (reserva espaço, evita CLS) e
  `fetchpriority="high"`, por ser o elemento LCP;
- clips de 4K (≈36 MB) de `preload="metadata"` para `preload="none"`, e o
  iframe do YouTube em `loading="lazy"`.

### E2 — `a34ddf2` Acessibilidade

- inputs de e-mail, username e senha ganharam `aria-label` (o rótulo visual
  era só um ícone). O de e-mail acompanha o modo login/cadastro via
  `setAuthMode()` — por isso ele **não** usa `data-i18n-aria-label`, que
  sobrescreveria com a chave de login fixo;
- banner do hero virou decorativo (`alt=""`) e perdeu o `aria-label`
  redundante;
- `toast` do `player.html` ganhou `role="status"`, como nas outras páginas;
- `<time>` dos comentários recebeu `datetime` com o valor ISO;
- avatares do admin ganharam `alt=""` (o nome já está ao lado).

### E3 — `a7dfc6b` SEO

Descrição, Open Graph e Twitter Card nas três páginas, com `og:image` e
`og:url` absolutos usando o domínio que já estava documentado em
`APP_ORIGIN` (`functions.php`). `canonical` na home e nos lineups; o perfil
fica de fora de propósito, porque a URL tem `?player=` e um canonical
estático consolidaria todos os jogadores na mesma página. `robots.txt`
bloqueia `/admin/`, `/api/` e `player-edit.php`; `sitemap.xml` lista só as
duas páginas estáveis. Favicon SVG com a cor de acento da marca.

### E4 — `b58b753` Conteúdo morto

O `index.html` tinha um painel de configurações completo (DPI, sens,
retícula, setup) com valores fixos do Gustavo Pacheco, e **nenhum script o
escrevia** — os cards direcionam para `player.html`. Era conteúdo morto
ocupando tela e prometendo dados desatualizados. Removido, com os links que
apontavam para `#settings` (rodapé, nav mobile, `lineups.html`) redirecionados
para `#players`.

### F1 — `e33b596` README corrigido

O README mandava rodar o `seed.sql` para criar o usuário demo — o que o A4
tinha movido de propósito para `database/dev/seed-dev.sql`. As instruções
antigas fariam alguém criar login desnecessário em produção.

---

## 5. Verificação

17 harnesses Node em `C:\Users\Usuario\AppData\Local\Temp\opencode\`
(`safeurl`, `b1`, `b2_dom`, `b2_i18n`, `b2_scoped`, `b3_404`,
`b3_sensbands`, `c1`, `c2`, `c3`, `d1`, `d1_runtime`, `d2`, `e1`, `e2`,
`e3`, `e4`) — todos passando nos 19 commits.

Além disso, em cada commit: `php -l` nos PHP alterados, `node --check` nos
JS, e um verificador de encoding que caça CJK e mojibake nos arquivos
tocados.

`b2_dom_test.js` e `e1_test.js` tiveram asserções ajustadas no E4 — não para
enfraquecer, mas porque a intenção original ("a retícula usa
`data-i18n-alt`") passou a ser verificável só no `player.html`, já que o
`index.html` deixou de ter esse bloco. As asserções novas verificam o
contrapositivo: os ids duplicados não podem voltar.

## 6. Pendências conhecidas

- **Migração não executada**: `database/migrations/001_users_role.sql` não
  foi rodada (fora do escopo de não tocar em banco). Se o `users.role` não
  existir no banco, o `seed-dev.sql` avisa e não insere.
- **Clipes de 4K**: os dois `.mp4` somam ≈36 MB no repositório. O
  `preload="none"` evita o download, mas recomprimir (ou mover para fora do
  repositório) traria ganho real de tamanho.
- **Vídeo do perfil dinâmico**: as tags Open Graph do `player.html` são
  genéricas, porque o conteúdo vem de JS e o scraper social não executa JS.
- **Comentário com login**: em ausência de API/banco, o `profile.js` ainda
  guarda comentários no `localStorage` e aceita o nome digitado. Esse é o
  caminho de fallback (`apiActive === false`), não o caminho com banco.
- **Confirmação no Laragon**: os testes são harnesses Node, e não passam
  pelo PHP real via HTTP. Recomendo subir no Laragon e percorrer cadastro,
  login, comentário, criação de jogador e o filtro por sensibilidade.
