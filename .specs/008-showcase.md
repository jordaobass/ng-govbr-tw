# 008 — Showcase: o monolito e os 10 componentes que ninguém vê

**Entra em:** 1.3.0 · Publicado em https://jordaobass.github.io/ng-govbr-tw/

> ## 🪦 SUPERADA em 26/02/2026 — o showcase não existe mais
>
> Esta spec propunha quebrar o monolito de 2.940 linhas por rota e cobrir os
> componentes que ninguém via. A decisão **D19** resolveu o problema pela
> raiz: o showcase foi removido e o **Storybook** assumiu a documentação
> oficial, na raiz do GitHub Pages.
>
> O diagnóstico aqui continua válido — e o remédio foi outro:
>
> | problema desta spec | como ficou |
> |---|---|
> | monolito de 2.940 linhas mantido à mão | 138 stories que saem do próprio componente |
> | componentes que ninguém via | teste reprova componente exportado sem story |
> | exemplo de código copiado ao lado | `Show code` gerado pelo Storybook |
>
> Escrever as stories dos cinco componentes que nunca tinham aparecido
> revelou **três violações sérias de acessibilidade** que o axe não via —
> porque não havia onde olhar. Está no commit `61ddddc`.
>
> Fica registrada porque o diagnóstico é a justificativa da D19.

O showcase não é enfeite: é a **única** superfície onde o comportamento desta lib é
verificado por olho humano, e é o que um órgão público olha antes de adotar. Hoje ele tem
três problemas medidos.

## 8.1 Dez seletores nunca renderizados em lugar nenhum

```bash
# 63 seletores declarados na lib, 52 usados no showcase, 1 (br-footer) no app.component
grep -rhoE "selector: '(br-[a-z-]+)'" --include='*.ts' projects/ng-govbr-tw/src/lib | sed "s/selector: '//;s/'//" | sort -u | wc -l   # 63
grep -ohE '<br-[a-z-]+' projects/demo/src/app/pages/showcase/showcase.component.ts | sed 's/<//' | sort -u | wc -l                    # 52
```

Declarados e **nunca renderizados** no demo:

`br-layout` · `br-menu` · `br-menu-item` · `br-menu-bar` · `br-menu-bar-item` ·
`br-menu-bar-sub-item` · `br-sidebar-group` · `br-sidebar-group-label` ·
`br-success-check` · `br-toast-container`

### O caso mais grave: o toast

```bash
grep -c 'toast\|Toast' projects/demo/src/app/pages/showcase/showcase.component.ts   # 0
```

**Zero ocorrências.** O sistema de toast — `BrToastService` + `br-toast-container` +
`br-toast`, com 13 `it()` em `toast.service.spec.ts` — não é demonstrado, não é
renderizado e não é exercitado em nenhum lugar. É exatamente o padrão de "peça testada
isoladamente que nunca roda junto": o service tem teste, o container nunca é montado, e
ninguém sabe se um toast aparece de verdade.

Pior com `OnPush` chegando (spec [002](002-performance-onpush.md)): o toast muda estado
por `setTimeout`, fora de evento de template. É o candidato nº 1 a quebrar com `OnPush` —
e não há nem demo nem teste de integração que mostre isso.

**O que implementar:** seção de toast no showcase com botões que disparam os 4 tipos, o
`br-toast-container` montado no `app.component`, e os demais 9 seletores com seção ou
exemplo.

## 8.2 O contraste está implementado duas vezes, e a versão da lib não é a que você clica

O showcase tem **a própria** implementação do toggle:

```ts
// projects/demo/src/app/pages/showcase/showcase.component.ts:2313-2318
contrastActive = false;
toggleContrast(): void {
  this.contrastActive = !this.contrastActive;
  document.documentElement.classList.toggle('govbr-contrast', this.contrastActive);
}
```

E a lib tem a dela em `br-header.component.ts:380-382`. O `<br-header>` **é** renderizado
no showcase (`:1460`, com `[showContrast]="true"` em `:1467`), mas o botão de contraste
que o visitante usa na barra superior é o do **demo**, não o da lib.

Consequência: a feature publicada no pacote é verificada por acidente, e a que o público
testa é código do demo que não vai para ninguém. As duas também divergem — nenhuma
persiste o estado (`grep -rc localStorage` → nada em lugar nenhum).

**O que implementar:** após a spec [005](005-portabilidade-ssr-e-cdn.md) §5.3 criar o
`BrContrastService`, o showcase passa a **consumir o service da lib** e apaga o
`toggleContrast()` local. O demo volta a provar o que o pacote entrega.

## 8.3 Monolito de 2.940 linhas

```bash
wc -l projects/demo/src/app/pages/showcase/showcase.component.ts   # 2940
grep -oE '<section id="[a-z0-9-]+"' ... | wc -l                    # 35 seções
```

Um componente, 2.940 linhas, 35 seções, template inline. Viola a regra de 200 linhas por
classe por uma ordem de grandeza, e tem custo prático: não se consegue olhar um componente
isolado, qualquer mexida recarrega tudo, e o arquivo é grande o bastante para desencorajar
contribuição externa — a lib é open-source com 0 estrelas e nenhum PR.

**O que implementar** — quebra por rota, não por capricho de tamanho:

- uma rota/arquivo por grupo de componentes (`/formularios`, `/navegacao`, `/feedback`,
  `/dados`, `/layout`), reaproveitando o `app.routes.ts` que hoje tem 7 linhas
- o shell (topbar + sidebar de navegação) sai para um componente de layout do demo
- as regras `.showcase-*` que hoje estão dentro do `govbr-contrast.css` **publicado**
  mudam para `projects/demo/src/styles.css` (ver spec [004](004-tokens-e-contraste.md) §4.3)

Com rotas por grupo, o showcase passa a servir de superfície de verificação por
componente — que é o que faltaria para qualquer auditoria visual futura.

**Ressalva de escopo:** quebrar o monolito é a parte de maior diff e menor risco desta
release. Se o tempo apertar, a ordem de corte é: 8.1 e 8.2 são **obrigatórios** (são
defeito de produto: feature invisível e feature não provada), 8.3 pode ir para a release
seguinte **se** ficar registrado no `MELHORIAS.md`.

## 8.4 Limpeza pontual

- `projects/demo/src/app/app.component.ts:12` importa `BrHeaderComponent` e **não usa** no
  template (só `<br-footer>` está lá). Import morto.
- `projects/ng-govbr-tw/src/public-api.ts:2` ainda diz
  `Public API Surface of @aspect-br/ng-govbr-tw` — nome antigo do pacote.

## Critério de aceite

1. `comm` entre seletores declarados e renderizados no demo → **conjunto vazio**
2. Seção de toast existe e, **aberta no navegador**, um clique faz o toast aparecer e
   desaparecer sozinho (prova de 002 contra `OnPush`)
3. Toggle de contraste do showcase usa `BrContrastService`; `grep -c 'classList.toggle' showcase` → 0
4. `grep -c 'showcase-' .../govbr-contrast.css` → 0
5. O deploy do GitHub Pages passa (`.github/workflows/deploy-demo.yml`) e a página no ar
   mostra as seções novas — **conferir o que está publicado**, não o que está no fonte
