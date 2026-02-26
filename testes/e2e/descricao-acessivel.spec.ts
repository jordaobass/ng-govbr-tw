import { test, expect } from '@playwright/test';
import { BASE_STORYBOOK } from '../playwright.config';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Texto de apoio e de erro precisa ser ANUNCIADO, não só pintado.
 *
 * WCAG 3.3.1 e 3.3.2: a descrição de um campo tem de estar associada ao campo
 * por programa, não por vizinhança visual. Um `<p>` logo abaixo do input é
 * claro para quem enxerga e simplesmente não existe para quem usa leitor de
 * tela.
 *
 * ⚠️ O axe não pega isto, e a suíte de acessibilidade desta lib passou limpa
 * com o defeito presente nos 114 stories. O motivo é estrutural: nenhuma
 * ferramenta tem como adivinhar que um parágrafo vizinho é a descrição do
 * campo — só o autor sabe. Por isso este teste existe à parte.
 *
 * Como se decide o que é descrição (convenção da própria lib, não palpite):
 * `<p>`/`<span>` com `text-govbr-gray-60` (apoio) ou `text-govbr-danger-dark`
 * (erro), ou qualquer `[role="alert"]`.
 *
 * Duas exclusões, ambas deliberadas:
 *  - o que está DENTRO da caixa do controle não é descrição: o prefixo `R$`
 *    do campo de moeda e o texto do gatilho do select caíram aqui;
 *  - contador de caracteres (`0/200`) é estado que muda a cada tecla —
 *    `aria-describedby` o anunciaria uma vez só, desatualizado. O lugar dele
 *    é uma região `aria-live`, que é outro assunto.
 */

const CAMPOS = [
  'br-input', 'br-textarea', 'br-select', 'br-datepicker', 'br-timepicker',
  'br-datetimepicker', 'br-upload', 'br-radio-group', 'br-input-cpf',
  'br-input-cnpj', 'br-input-telefone', 'br-input-cep', 'br-input-money',
].join(',');

test('todo texto de apoio e de erro é anunciado pelo leitor de tela', async ({ page }) => {
  test.setTimeout(180_000);

  const indice = JSON.parse(
    readFileSync(join(__dirname, '../../dist/storybook/index.json'), 'utf-8')
  );
  const ids = Object.values(indice.entries as Record<string, { id: string; type: string }>)
    .filter((e) => e.type === 'story')
    .map((e) => e.id);

  const mudos: string[] = [];

  for (const id of ids) {
    await page.goto(
      `${BASE_STORYBOOK}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`,
      { waitUntil: 'domcontentloaded' }
    );
    await page.waitForTimeout(120);

    const achados = await page.evaluate((seletorCampos) => {
      const DESCRITIVO = [
        'p.text-govbr-gray-60', 'span.text-govbr-gray-60',
        'p.text-govbr-danger-dark', 'span.text-govbr-danger-dark',
        '[role="alert"]',
      ].join(',');
      // `role="group"` e `role="radiogroup"` entram porque em campo COMPOSTO
      // (data+hora, conjunto de opções) a descrição é do grupo, não de um dos
      // controles: pendurá-la só no primeiro faria o leitor anunciar a regra
      // do conjunto como se fosse de uma parte. Vêm antes dos inputs no
      // documento, então `querySelector` os encontra primeiro.
      //
      // `[role="button"][tabindex]` entra pela zona de soltar do br-upload: o
      // `<input type=file>` ali é oculto e o que recebe foco é a zona. Medido
      // pelo protocolo do navegador, o texto DENTRO dela já compõe o nome
      // acessível do botão ("…clique para selecionar Formatos: .pdf · Max:
      // 5MB") — sem esta entrada, a sonda cobrava um `aria-describedby` para
      // texto que já é anunciado, e acusava defeito onde não havia.
      const CONTROLES =
        '[role="group"], [role="radiogroup"], [role="button"][tabindex], ' +
        'input:not([type=hidden]), textarea, select, [role="combobox"]';
      const CONTADOR = /^\d+\s*\/\s*\d+$/;

      const saida: string[] = [];
      for (const campo of Array.from(document.querySelectorAll(seletorCampos))) {
        const controle = campo.querySelector(CONTROLES);
        if (!controle) continue;

        // A caixa do controle: o que estiver aqui dentro é parte do campo, não
        // descrição dele (prefixo de moeda, texto do gatilho do select).
        //
        // ⚠️ Sem o `.relative` NÃO se cai no elemento pai: no br-upload o
        // input de arquivo é filho direto da raiz do componente, e usar o pai
        // como caixa excluía o componente inteiro — o defeito real sumia da
        // lista em silêncio.
        const caixa = controle.closest('.relative');

        // Num GRUPO a descrição mora legitimamente dentro do controle (o
        // `<fieldset role="radiogroup">` contém o próprio texto de erro), e
        // `controle.contains` a excluía — a sonda dava verde com o defeito
        // presente. Comprovado por mutação: tirar o `aria-describedby` do
        // radiogroup não derrubava teste nenhum.
        const ehGrupo = controle.matches('[role="group"], [role="radiogroup"]');

        const descricoes = Array.from(campo.querySelectorAll(DESCRITIVO)).filter((e) => {
          const texto = (e.textContent || '').trim();
          if (texto.length < 2) return false;
          if (CONTADOR.test(texto)) return false;

          // Campo aninhado (o datetimepicker contém datepicker e timepicker):
          // quem responde pela descrição é o campo interno, não o composto.
          if (e.closest(seletorCampos) !== campo) return false;

          if (ehGrupo) {
            // Rótulo de opção descreve a opção, não o grupo.
            if (e.closest('label')) return false;
          } else {
            if (controle.contains(e)) return false;
            if (caixa?.contains(e)) return false;
          }
          return (e as HTMLElement).offsetParent !== null;
        });
        if (!descricoes.length) continue;

        const referidos = new Set(
          (controle.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean)
        );

        for (const d of descricoes) {
          if (!d.id || !referidos.has(d.id)) {
            saida.push(
              `${campo.tagName.toLowerCase()} → "${(d.textContent || '').trim().slice(0, 34)}"` +
                (d.id ? ` (id=${d.id} não referenciado)` : ' (sem id)')
            );
          }
        }
      }
      return saida;
    }, CAMPOS);

    for (const a of achados) mudos.push(`${id} · ${a}`);
  }

  expect(
    mudos,
    `descrições que o leitor de tela nunca anuncia:\n  ${mudos.join('\n  ')}`
  ).toEqual([]);
});

test('campo com erro marca aria-invalid', async ({ page }) => {
  test.setTimeout(90_000);

  // `role="alert"` faz o erro ser LIDO; `aria-invalid` faz o campo ser
  // ANUNCIADO como inválido ao receber foco. São coisas diferentes e o
  // br-timepicker tinha só a primeira.
  //
  // A lista é descoberta do índice, não escrita à mão: a versão anterior
  // citava cinco stories fixas e por isso não cobria o próprio timepicker que
  // motivou o teste — story nova nascia fora da rede sem ninguém notar.
  const indice = JSON.parse(
    readFileSync(join(__dirname, '../../dist/storybook/index.json'), 'utf-8')
  );
  const comErro = Object.values(
    indice.entries as Record<string, { id: string; type: string }>
  )
    .filter((e) => e.type === 'story' && /--com-erro$/.test(e.id))
    .map((e) => e.id);

  expect(comErro.length, 'nenhuma story de erro no índice').toBeGreaterThan(4);

  const semMarca: string[] = [];
  for (const id of comErro) {
    await page.goto(
      `${BASE_STORYBOOK}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`,
      { waitUntil: 'domcontentloaded' }
    );
    await page.waitForTimeout(150);
    const ok = await page.evaluate(() => {
      // Mesma ordem do outro teste: num grupo, quem é inválido é o conjunto.
      const c = document.querySelector(
        '[role="group"], [role="radiogroup"], input:not([type=hidden]), textarea, [role="combobox"]'
      );
      return c?.getAttribute('aria-invalid') === 'true';
    });
    if (!ok) semMarca.push(id);
  }
  expect(semMarca, `stories de erro sem aria-invalid: ${semMarca.join(', ')}`).toEqual([]);
});

test('mensagem de erro é anunciada assim que aparece', async ({ page }) => {
  test.setTimeout(90_000);

  /*
   * `role="alert"` é o que faz o leitor de tela LER a mensagem no momento em
   * que ela surge; sem ele, quem não enxerga só descobre o erro se por acaso
   * navegar até o texto.
   *
   * Esta checagem existe porque a sonda de descrição tem um ponto cego: ela
   * reconhece texto pelas classes de token da lib, e o br-checkbox marcava o
   * erro com classe própria (`br-checkbox-feedback danger`). O defeito passou
   * despercebido até a verificação de `aria-invalid` tropeçar nele. Exigir
   * `role="alert"` de toda story de erro não depende de convenção de classe.
   */
  const indice = JSON.parse(
    readFileSync(join(__dirname, '../../dist/storybook/index.json'), 'utf-8')
  );
  const comErro = Object.values(
    indice.entries as Record<string, { id: string; type: string }>
  )
    .filter((e) => e.type === 'story' && /--com-erro$/.test(e.id))
    .map((e) => e.id);

  const mudas: string[] = [];
  for (const id of comErro) {
    await page.goto(
      `${BASE_STORYBOOK}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`,
      { waitUntil: 'domcontentloaded' }
    );
    await page.waitForTimeout(150);
    const temAlerta = await page.evaluate(() => {
      const a = document.querySelector('[role="alert"]');
      return !!a && (a.textContent || '').trim().length > 1;
    });
    if (!temAlerta) mudas.push(id);
  }
  expect(mudas, `stories de erro sem role="alert": ${mudas.join(', ')}`).toEqual([]);
});
