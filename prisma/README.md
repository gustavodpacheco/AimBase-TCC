# Banco de dados ProSettings

## Estrutura

| Tabela | Finalidade |
| --- | --- |
| `countries` | Catálogo de países por código ISO-2; é referenciado por jogadores e times. |
| `games` | Catálogo de jogos, com `slug` único para URLs e integrações. |
| `teams` | Times por jogo; um time pode ter vários perfis de jogadores. |
| `players` | Identidade global do jogador (username, nome, foto e país). |
| `player_game_profiles` | Perfil específico do jogador em cada jogo: tag, função e time. A chave única `(player_id, game_id)` impede duplicação. |
| `player_game_settings` | Raiz do conjunto atual de settings. `profile_id` único garante no máximo um conjunto por jogador/jogo. |
| `mouse_settings` | Settings estruturados de mouse em relação 1:1 com o conjunto atual. |
| `video_settings` | Settings de vídeo estruturados e tipados em relação 1:1 com o conjunto atual. |
| `crosshairs` | Código, descrição e JSON opcional para parâmetros específicos de cada jogo, em relação 1:1. |
| `equipment` | Catálogo reutilizável de periféricos. Não há cópia de mouse, teclado, headset, mousepad ou monitor por jogador. |
| `player_equipment` | Relação N:N entre settings e equipamentos; a unicidade `(settings_id, type)` mantém um item de cada categoria por setup. |
| `player_socials` | Redes sociais do jogador; uma plataforma só pode ser cadastrada uma vez por jogador. |
| `settings_revisions` | Histórico versionado e imutável via snapshot JSON de cada alteração de settings. |

## Relacionamentos principais

`Player 1:N PlayerGameProfile N:1 Game` permite que o mesmo jogador tenha perfis em jogos diferentes. `PlayerGameProfile 1:1 PlayerGameSettings` garante um conjunto atual de configurações por jogo. Os blocos de mouse, vídeo e crosshair são extensões 1:1 desse conjunto; equipamentos ficam em uma relação N:N explícita para reutilização segura.

## Aplicação

1. Copie `.env.example` para `.env` e informe a URL do PostgreSQL.
2. Instale Prisma no projeto que consumirá este banco.
3. Execute `npx prisma generate`.
4. Gere a primeira migration a partir do schema com `npx prisma migrate dev --name init`.

O `schema.prisma` é a fonte de verdade desta estrutura. Nenhuma migration SQL manual é mantida no repositório.
