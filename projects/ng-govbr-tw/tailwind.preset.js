/** @type {import('tailwindcss').Config} */

/*
 * As cores apontam para CSS vars em forma de CANAL ("19 81 180"), não para hex.
 *
 * Por quê: com hex literal, `bg-govbr-primary` compilava para `#1351b4`
 * estático e o tema de alto contraste não tinha como alcançar a classe —
 * precisava re-estilizar componente por componente com `!important`.
 * Apontando para a var, trocar o tema é trocar a variável.
 *
 * Por que CANAL e não `var(--govbr-primary)` direto: a forma direta quebra o
 * modificador de opacidade do Tailwind, e a lib usa (`bg-govbr-primary-darkest/60`
 * no modal, `text-govbr-primary/60` no menu-item). Com canal + `<alpha-value>`,
 * `/60` continua funcionando.
 *
 * O segundo argumento de cada `var()` é o FALLBACK: quem usa o preset sem
 * importar `styles/govbr-tw.css` continua vendo as cores do Gov.br.
 */
const cor = (nome, fallbackRgb) =>
  `rgb(var(--govbr-${nome}-rgb, ${fallbackRgb}) / <alpha-value>)`;

module.exports = {
  theme: {
    extend: {
      colors: {
        'govbr-primary': cor('primary', '19 81 180'),
        'govbr-primary-dark': cor('primary-dark', '12 50 111'),
        'govbr-primary-darkest': cor('primary-darkest', '7 29 65'),
        'govbr-primary-light': cor('primary-light', '197 212 235'),
        'govbr-primary-lightest': cor('primary-lightest', '219 232 251'),
        'govbr-success': cor('success', '22 136 33'),
        'govbr-success-bg': cor('success-bg', '227 245 225'),
        'govbr-danger': cor('danger', '229 34 7'),
        'govbr-danger-bg': cor('danger-bg', '253 224 219'),
        'govbr-warning': cor('warning', '255 205 7'),
        'govbr-warning-bg': cor('warning-bg', '255 245 194'),
        'govbr-info': cor('info', '21 91 203'),
        'govbr-info-bg': cor('info-bg', '212 229 255'),
        // Variantes escuras: texto sobre as superfícies `-bg`. Ver o comentário
        // em govbr-tw.css — a cor sólida sobre o `-bg` reprova WCAG AA.
        'govbr-danger-dark': cor('danger-dark', '125 18 4'),
        'govbr-success-dark': cor('success-dark', '11 74 18'),
        'govbr-warning-dark': cor('warning-dark', '107 82 0'),
        // Hover de botão sólido de feedback — contraste do texto já conferido
        // (ver comentário em govbr-tw.css).
        'govbr-danger-hover': cor('danger-hover', '179 27 5'),
        'govbr-success-hover': cor('success-hover', '15 107 26'),
        'govbr-warning-hover': cor('warning-hover', '224 180 6'),
        'govbr-focus': cor('focus-color', '255 190 46'),
        'govbr-pure-0': cor('pure-0', '255 255 255'),
        'govbr-on-primary': cor('on-primary', '255 255 255'),
        'govbr-bg': cor('bg', '255 255 255'),
        'govbr-bg-alternative': cor('bg-alternative', '240 240 240'),
        'govbr-gray': {
          2: cor('gray-2', '248 248 248'),
          5: cor('gray-5', '237 237 237'),
          10: cor('gray-10', '204 204 204'),
          20: cor('gray-20', '168 168 168'),
          40: cor('gray-40', '136 136 136'),
          60: cor('gray-60', '85 85 85'),
          80: cor('gray-80', '51 51 51'),
        },
      },
      fontFamily: {
        rawline: ['Rawline', 'Raleway', 'sans-serif'],
      },
      borderRadius: {
        'govbr-pill': '100em',
      },
      fontSize: {
        'govbr-xs': ['0.75rem', { lineHeight: '1rem' }],
        'govbr-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'govbr-base': ['1rem', { lineHeight: '1.5rem' }],
        'govbr-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'govbr-xl': ['1.25rem', { lineHeight: '1.75rem' }],
        'govbr-2xl': ['1.5rem', { lineHeight: '2rem' }],
        'govbr-3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      keyframes: {
        'modal-in': {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(-10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        'modal-in': 'modal-in 0.2s ease-out',
      },
      spacing: {
        'govbr-1': '0.25rem',
        'govbr-2': '0.5rem',
        'govbr-3': '0.75rem',
        'govbr-4': '1rem',
        'govbr-5': '1.25rem',
        'govbr-6': '1.5rem',
        'govbr-8': '2rem',
        'govbr-10': '2.5rem',
      },
    },
  },
};
