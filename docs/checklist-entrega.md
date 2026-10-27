# Checklist de entrega — AimBase

Use este arquivo como conferência final antes de gerar o PDF, o DOCX e os slides.
Marque cada item e registre a data da verificação.

## 1. Dados acadêmicos (preencher antes de converter)

- [ ] nome oficial da instituição;
- [ ] cidade da instituição;
- [ ] sobrenome do orientador (o nome "Anderson" já está no documento);
- [ ] nomes dos membros da banca;
- [ ] data de aprovação (prevista: 02/12/2026);
- [ ] capa e folha de aprovação com os dados corretos;
- [ ] título e subtítulo iguais nos slides, na capa e na monografia.

## 2. Formatação ABNT

- [ ] papel A4 (21 × 29,7 cm);
- [ ] margens: superior e esquerda 3 cm; inferior e direita 2 cm;
- [ ] fonte Arial ou Times New Roman, tamanho 12 no texto;
- [ ] espaçamento 1,5 entre linhas no texto;
- [ ] citações longas (mais de 3 linhas) com recuo de 4 cm, fonte 10 e
      espaçamento simples;
- [ ] títulos numerados e alinhados conforme a NBR 14724;
- [ ] capa, folha de aprovação, resumo, abstract, listas, sumário, capítulos,
      referências, apêndices;
- [ ] paginação a partir da introdução (contagem começa na capa, mas o número
      aparece a partir da introdução);
- [ ] figuras com legenda acima e fonte abaixo;
- [ ] tabelas com título acima e fonte abaixo;
- [ ] referências em ordem alfabética e com acesso em 26 out. 2026;
- [ ] sumário atualizado com os números de página corretos;
- [ ] lista de figuras e lista de tabelas atualizadas.

> O Markdown é a fonte do conteúdo. A formatação fina (margens, paginação,
> sumário automático e legendas) deve ser concluída no Word/LibreOffice ou no
> template ABNT da instituição.

## 3. Converter Markdown em DOCX/PDF

### Opção A — Word/LibreOffice

1. Abra `docs/monografia.md` no editor de Markdown de sua preferência.
2. Exporte para DOCX ou copie o conteúdo para o template ABNT da instituição.
3. Insira as imagens de `docs/screenshots/` e os diagramas exportados.
4. Atualize o sumário, as listas de figuras/tabelas e a paginação.
5. Exporte o PDF final.

### Opção B — Pandoc

DOCX:

```powershell
pandoc docs/monografia.md -o docs/monografia.docx --toc --number-sections
```

PDF com LaTeX (requer MiKTeX/TeX Live):

```powershell
pandoc docs/monografia.md -o docs/monografia.pdf --pdf-engine=xelatex `
  -V mainfont="Arial" -V fontsize=12pt -V geometry:margin=3cm --toc
```

Para os diagramas Mermaid:

- exporte cada bloco de `docs/diagramas.md` como PNG/SVG;
- substitua os blocos Mermaid da monografia pelas imagens;
- ou use um filtro Mermaid compatível com o Pandoc.

## 4. Diagramas e screenshots

- [ ] exportar D1 (arquitetura) em PNG/SVG;
- [ ] exportar D2 (DER) em PNG/SVG;
- [ ] exportar D3 (login/CSRF), D4 (comentários), D5 (admin) e D6 (implantação)
      se forem usados nos slides;
- [ ] conferir se as imagens de `docs/screenshots/` estão nítidas;
- [ ] conferir legendas e fontes das figuras;
- [ ] conferir se a Figura 1 e a Figura 2 da monografia foram substituídas pelos
      diagramas renderizados.

Arquivos disponíveis:

```
docs/screenshots/home.png
docs/screenshots/home-en.png
docs/screenshots/home-mobile.png
docs/screenshots/player-pacheco.png
docs/screenshots/player-comments.png
docs/screenshots/player-404.png
docs/screenshots/lineups.png
docs/screenshots/admin-login.png
docs/screenshots/admin-dashboard.png
docs/screenshots/admin-players.png
docs/screenshots/admin-games.png
```

## 5. Validação técnica final

### PHP

```powershell
$php = "C:\laragon\bin\php\php-8.3.33-Win32-vs16-x64\php.exe"
Get-ChildItem -Recurse -Filter *.php | ForEach-Object { & $php -l $_.FullName }
```

### JavaScript

```powershell
Get-ChildItem -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```

### Paridade dos idiomas

```powershell
node -e "const fs=require('fs');const l=['pt-BR','en','es','fr','de'];const d={};for(const x of l)d[x]=JSON.parse(fs.readFileSync('assets/i18n/'+x+'.json','utf8'));const b=Object.keys(d['pt-BR']);let ok=true;for(const x of l){const m=b.filter(k=>!(k in d[x]));const e=Object.keys(d[x]).filter(k=>!(k in d['pt-BR']));console.log(x,Object.keys(d[x]).length,'faltando',m.length,'extras',e.length);if(m.length||e.length)ok=false}process.exit(ok?0:1)"
```

### UTF-8 e mojibake

```powershell
Get-ChildItem -Recurse -Include *.md,*.php,*.js,*.json,*.sql,*.html,*.css |
  Where-Object { $_.FullName -notmatch 'checklist-entrega\.md$' } |
  ForEach-Object {
    $t = Get-Content $_.FullName -Raw -Encoding UTF8
    if ($t -match 'Ã[©£§µ¡íóúêôçÇ]|â€|ï¿½') {
      Write-Output "Verificar: $($_.FullName)"
    }
  }
```

> A verificação acima é um alerta, não uma prova. Confira manualmente os arquivos
> apontados, principalmente os que contêm acentos e travessões.

## 6. Validação funcional no navegador

- [ ] Apache e MySQL iniciados;
- [ ] site abre em `http://localhost:8080/prosettings-page-main/` (ou porta
      configurada);
- [ ] home lista 10 jogadores e os filtros funcionam;
- [ ] perfil do Pacheco mostra DPI 800, sensibilidade 0,45 e eDPI 360;
- [ ] botão "Copiar settings" funciona;
- [ ] página 404 aparece para slug inexistente;
- [ ] lineups carregam os vídeos sob demanda;
- [ ] cinco idiomas trocam os textos;
- [ ] tema claro/escuro alterna e persiste;
- [ ] mobile 390×844 sem rolagem horizontal;
- [ ] login/registro funcionam;
- [ ] comentário exige login e mostra o autor da sessão;
- [ ] comentário pode ser excluído pelo autor;
- [ ] admin login com `demo@prosens.gg` / `demo1234`;
- [ ] painel abre somente para admin;
- [ ] CRUD de jogador, jogo, time e periférico funciona;
- [ ] moderação de comentários funciona;
- [ ] console do navegador sem exceções nas páginas principais.

## 7. Banco de dados e ambiente

- [ ] `database/schema.sql` importa em banco vazio;
- [ ] `database/seed.sql` importa sem erro;
- [ ] `database/migrations/001_users_role.sql` é idempotente;
- [ ] `database/dev/seed-dev.sql` só é usado localmente;
- [ ] `config/database.local.php` não está no pacote/commit;
- [ ] `storage/ratelimit/` não contém arquivos de teste no pacote;
- [ ] backup do banco gerado (`mysqldump`) antes de qualquer alteração;
- [ ] nenhuma senha real ou credencial de produção no repositório.

## 8. Conteúdo do pacote de entrega

- [ ] código-fonte completo (sem `config/database.local.php`, sem `.git` se a
      instituição não pedir, sem arquivos temporários);
- [ ] `README.md` atualizado;
- [ ] `RELATORIO.md` atualizado;
- [ ] `database/schema.sql`, `database/seed.sql` e migrações;
- [ ] monografia em PDF;
- [ ] monografia em DOCX (se exigido);
- [ ] slides em PDF e PPTX;
- [ ] diagramas exportados;
- [ ] screenshots;
- [ ] vídeo de demonstração (opcional);
- [ ] backup em nuvem e pendrive.

## 9. Riscos e pendências opcionais

- [ ] decidir se os clipes de 4K (≈36 MB) ficam no pacote ou são externalizados;
- [ ] decidir se as integrações Discord/Google permanecem como demonstração ou
      são removidas da interface;
- [ ] decidir se a recuperação de senha entra no escopo ou fica como trabalho
      futuro;
- [ ] revisar o texto da monografia com o orientador;
- [ ] revisar as referências e as citações;
- [ ] revisar a ortografia e a concordância;
- [ ] treinar a apresentação com cronômetro;
- [ ] preparar respostas para perguntas sobre segurança, modelagem e testes.

## 10. Assinaturas e registro

- [ ] orientador leu a versão final;
- [ ] banca recebeu o PDF com antecedência;
- [ ] data e local da defesa confirmados;
- [ ] cópia da versão entregue arquivada.

Data da conferência: ____ / ____ / 2026.

Responsável: ________________________________________
