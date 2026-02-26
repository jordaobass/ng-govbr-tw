#!/usr/bin/env node
/*
 * Backtick dentro de `template:` encerra o literal no meio do HTML.
 *
 * ⚠️ Contar paridade NÃO basta: um comentário com dois backticks fecha e
 * reabre o literal, o total fica par e o arquivo quebra do mesmo jeito. O
 * erro que sai é incompreensível — "Cannot find name 'expanded'" — e aponta
 * para uma linha que não tem nada de errado.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..', 'projects');

function* arquivos(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* arquivos(p);
    else if (p.endsWith('.ts')) yield p;
  }
}

const problemas = [];
for (const arq of arquivos(raiz)) {
  const texto = readFileSync(arq, 'utf-8');
  // conteúdo entre `template: \`` e o próximo backtick
  const i = texto.indexOf('template: `');
  if (i < 0) continue;
  const inicio = i + 'template: `'.length;
  const fim = texto.indexOf('`', inicio);
  if (fim < 0) continue;
  const depois = texto.slice(fim + 1, fim + 400);
  // se logo após o fechamento não vem o fim do literal (`,` ou `\n})`), o
  // literal fechou cedo demais — há backtick no meio do HTML
  // Depois do literal vem o fim do objeto: `,` `}` `)` ou `]`. Qualquer
  // outra coisa significa que o backtick que achei fechou o literal no meio
  // do HTML. (A primeira versão não aceitava `}` e acusou as 42 stories.)
  if (!/^\s*[,)\]}]/.test(depois)) {
    const linha = texto.slice(0, fim).split('\n').length;
    problemas.push(`${arq.replace(raiz, 'projects')}:${linha} — backtick dentro do template`);
  }
}

if (problemas.length) {
  console.error('Backtick dentro de template literal:\n  ' + problemas.join('\n  '));
  process.exit(1);
}
console.log('Nenhum backtick dentro de template literal.');
