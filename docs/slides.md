# Roteiro de apresentação — AimBase

**Tempo sugerido:** 12 a 15 minutos de apresentação + 5 a 10 minutos de perguntas.
**Formato:** 16:9. Use as capturas de `docs/screenshots/` e os diagramas de
`docs/diagramas.md`.

## Slide 1 — Capa (30 s)

**Título:** AimBase: plataforma web para consulta e compartilhamento de
configurações de jogadores de e-sports

**Subtítulo:** Trabalho de Conclusão de Curso — Técnico em Desenvolvimento de
Sistemas

**Integrantes:** Gustavo Pacheco, Igor Gomes, Gabriel Felipi, Victoria Domingos
**Orientador:** Prof. Anderson
**Data:** 02/12/2026

**Fala sugerida:** "Boa tarde. Somos [nomes] e vamos apresentar o AimBase, uma
plataforma que centraliza configurações de jogadores profissionais de e-sports."

## Slide 2 — O problema (1 min)

**Conteúdo:**

- configurações espalhadas em vídeos, streams, planilhas e sites estrangeiros;
- barreira do inglês e informação desatualizada;
- dificuldade de comparar DPI, sensibilidade, retícula e periféricos;
- falta de um canal organizado para a comunidade contribuir.

**Fala sugerida:** "Quem joga competitivamente já procurou o setup de um pro e
encontrou informação espalhada, desatualizada ou em inglês. O problema não é falta
de conteúdo, é falta de organização e confiança."

## Slide 3 — Objetivos (1 min)

**Objetivo geral:** desenvolver uma plataforma web para consulta e
compartilhamento de configurações de jogadores de e-sports.

**Objetivos específicos:**

- modelar o banco de dados;
- criar uma API REST em PHP;
- construir o frontend responsivo;
- implementar autenticação, papéis e segurança;
- criar o painel administrativo;
- internacionalizar em cinco idiomas;
- validar o sistema.

**Fala sugerida:** "Nosso objetivo foi além de uma página bonita: queríamos uma
base administrável, segura e fácil de consultar."

## Slide 4 — Justificativa (45 s)

**Conteúdo:**

- acadêmica: integra banco, web, API, segurança e engenharia de software;
- social: aproxima iniciantes do conhecimento técnico dos profissionais;
- prática: o painel permite manter o conteúdo atualizado sem mexer no código.

**Fala sugerida:** "O projeto conecta o que aprendemos no curso com uma dor real
da comunidade de e-sports."

## Slide 5 — Metodologia (1 min)

**Conteúdo:**

- pesquisa aplicada, com desenvolvimento iterativo;
- etapas: requisitos → modelagem → API → frontend → painel → segurança →
  validação;
- validação técnica com análise estática, HTTP e navegador headless.

**Fala sugerida:** "Seguimos um ciclo incremental: cada camada foi implementada e
testada antes de avançar. A validação foi técnica e funcional."

## Slide 6 — Trabalhos relacionados (45 s)

**Conteúdo:** comparativo com ProSettings.net, Liquipedia, vídeos/streams e
planilhas.

**Diferenciais do AimBase:**

- interface em português e mais quatro idiomas;
- administração integrada;
- comentários da comunidade;
- lineups;
- projeto acadêmico, com código e documentação.

**Fala sugerida:** "Não competimos com grandes portais; ocupamos um espaço de
organização, acessibilidade e manutenção do conteúdo."

## Slide 7 — Arquitetura (1,5 min)

**Imagem:** diagrama D1 (`docs/diagramas.md`).

**Conteúdo:**

- navegador com HTML, CSS e JavaScript;
- Apache servindo arquivos estáticos;
- API REST em PHP;
- MySQL com PDO;
- painel administrativo usando a mesma API;
- rate limit em arquivo.

**Fala sugerida:** "A separação entre frontend estático e API facilita a
implantação e permite testar as regras de negócio de forma independente."

## Slide 8 — Modelo de dados (1 min)

**Imagem:** DER D2.

**Conteúdo:**

- `players`, `player_settings`, `games`, `teams`, `peripherals`;
- dados complementares: redes sociais, vídeos e especificações de PC;
- `users` e `comments`;
- integridade com chaves estrangeiras e cascata onde faz sentido.

**Fala sugerida:** "O jogador é o centro do modelo. As configurações ficam em uma
tabela 1:1, e os dados complementares podem crescer sem alterar a tabela
principal."

## Slide 9 — Frontend (1,5 min)

**Imagens:** home, perfil e lineups.

**Conteúdo:**

- home com busca e filtros;
- perfil com carta, DPI, sensibilidade, eDPI, retícula, setup, vídeos e redes;
- botão para copiar configurações;
- página 404 real para slug inexistente;
- lineups com vídeos sob demanda;
- fallback com `data.js` se a API não responder.

**Fala sugerida:** "A experiência foi pensada para consulta rápida: o usuário
filtra, abre o perfil e copia os dados principais."

## Slide 10 — Comentários e autenticação (1 min)

**Imagem:** seção de comentários.

**Conteúdo:**

- login/registro reais com sessão;
- comentário exige login; autor vem da sessão;
- limite de 500 caracteres e 5 comentários por 5 minutos;
- autor ou admin pode excluir;
- sem login, aparece o convite para entrar.

**Fala sugerida:** "A comunidade participa, mas com autoria garantida pelo
servidor — não dá para comentar usando o nome de outra pessoa."

## Slide 11 — Painel administrativo (1 min)

**Imagens:** login, dashboard e jogos.

**Conteúdo:**

- acesso somente com `role = admin`;
- CRUD de jogadores, jogos, times e periféricos;
- moderação de comentários;
- usuário comum recebe 403; visitante vai para o login.

**Fala sugerida:** "O painel é o que mantém o site vivo depois da entrega. Sem ele,
cada novo jogador exigiria alteração no código."

## Slide 12 — Segurança (1,5 min)

**Conteúdo:**

- sessão com cookie `HttpOnly`, `SameSite=Lax` e `Secure` em HTTPS;
- papel lido do banco a cada requisição;
- CSRF em todas as escritas, com `hash_equals`;
- CORS com allowlist;
- rate limit: 5 registros/hora, 10 logins/5 min, 5 comentários/5 min;
- PDO com prepared statements;
- escape de saída (`htmlspecialchars`, `esc()`);
- `safeUrl()` e `safeCssUrl()`;
- diretórios sensíveis bloqueados no Apache.

**Fala sugerida:** "A regra vale no servidor. Mesmo chamando a API direto, sem
sessão, papel ou token, a operação é recusada."

## Slide 13 — Idiomas, tema e responsividade (1 min)

**Imagens:** home em inglês e mobile.

**Conteúdo:**

- pt-BR, en, es, fr e de;
- 194 chaves por idioma, com paridade;
- escolha salva em `localStorage`;
- datas com `Intl`; números técnicos não localizados;
- tema claro/escuro;
- mobile 390×844 sem overflow horizontal.

**Fala sugerida:** "A internacionalização foi tratada desde o início, e a validação
em mobile não encontrou rolagem horizontal."

## Slide 14 — Resultados dos testes (1 min)

**Conteúdo:**

| Verificação | Resultado |
| ----------- | --------- |
| Endpoints públicos | 200 |
| Jogador inexistente | 404 |
| Escrita sem login/CSRF | 403 |
| CRUD admin | 201/200/200 |
| Comentário autenticado | 201, autor da sessão |
| Painel sem sessão | 302 |
| Usuário comum no painel | 403 |
| Admin no painel | 200 |
| Idiomas | 5/5 com troca efetiva |
| Mobile | 0 px de overflow |

**Fala sugerida:** "Além dos testes de API, rodamos um navegador headless para
verificar console, rede, conteúdo renderizado e layout."

## Slide 15 — Limitações e trabalhos futuros (1 min)

**Limitações:**

- validação sem teste de usabilidade com usuários;
- Discord/Google e recuperação de senha demonstrativos;
- Open Graph genérico no perfil dinâmico;
- clips 4K no repositório;
- sem CI nem suíte de testes no repositório;
- comentários apenas texto.

**Trabalhos futuros:**

- teste de usabilidade;
- recuperação de senha e verificação de e-mail;
- OAuth real;
- respostas/reações e denúncia de comentários;
- paginação;
- CI e testes automatizados;
- PWA e cache offline;
- imagens Open Graph dinâmicas.

**Fala sugerida:** "Reconhecemos as limitações e já temos um caminho claro para
evoluir o projeto."

## Slide 16 — Conclusão (45 s)

**Conteúdo:**

- plataforma funcional e administrável;
- cinco idiomas, tema e responsividade;
- segurança aplicada no servidor;
- documentação, diagramas e capturas de tela;
- objetivos alcançados.

**Fala sugerida:** "O AimBase mostrou que uma stack acessível, com boas decisões de
modelagem e segurança, é suficiente para entregar uma plataforma completa."

## Slide 17 — Encerramento (15 s)

**Conteúdo:** "Obrigado!" + nomes + contato + espaço para perguntas.

**Fala sugerida:** "Obrigado pela atenção. Estamos à disposição para perguntas."

---

## Plano B para a demonstração

Se a internet ou o banco falharem:

1. use os screenshots de `docs/screenshots/`;
2. mostre o fallback do `data.js` abrindo a home sem a API;
3. apresente os testes registrados na monografia;
4. tenha o PDF da monografia e os slides em um pendrive.

## Checklist antes de apresentar

- [ ] slides exportados em PDF e PPTX;
- [ ] screenshots atualizados;
- [ ] monografia em PDF e DOCX;
- [ ] banco com a conta demo e dados de exemplo;
- [ ] Apache e MySQL iniciados;
- [ ] login `demo@prosens.gg` / `demo1234` testado;
- [ ] cronômetro treinado em 12–15 minutos;
- [ ] backup dos arquivos em nuvem e pendrive.
