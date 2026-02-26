/**
 * Máscara de documento como DADO, não como código espalhado.
 *
 * `br-input-cpf` e `br-input-cnpj` eram cópias com 18% de divergência: 54 de
 * ~297 linhas. E a duplicação já tinha cobrado o preço — a correção de
 * acessibilidade de uma rodada anterior chegou a três das cinco cópias de
 * campo mascarado e deixou justamente cpf e cnpj para trás.
 *
 * Tudo o que de fato varia entre os dois está aqui: agrupamento dos dígitos,
 * dígito verificador, ícone e texto de erro. O comportamento comum
 * (ControlValueAccessor, Validator, estado de erro, OnPush) vive na classe
 * base.
 *
 * ⚠️ Os algoritmos abaixo foram MOVIDOS dos componentes, não reescritos. Os
 * 29 testes de cpf e cnpj provam o cálculo atual e precisam continuar verdes
 * sem alteração — é esse o critério de que a refatoração não mudou nada.
 */
export interface MascaraDocumento {
  /** Prefixo do `id` do campo. Ex.: `br-input-cpf`. */
  readonly prefixoId: string;

  /** Quantos dígitos o documento tem, já sem pontuação. */
  readonly digitos: number;

  /** `maxlength` do `<input>` — conta a pontuação, por isso difere de `digitos`. */
  readonly tamanhoFormatado: number;

  /** Nome do ícone do Font Awesome, sem o prefixo `fa-`. */
  readonly icone: string;

  /** Chaves de erro que este documento publica no `ValidationErrors`. */
  readonly chaveIncompleto: string;
  readonly chaveInvalido: string;

  /** Mensagem padrão por chave de erro; o consumidor sobrescreve por `errorMessages`. */
  readonly mensagens: Record<string, string>;

  /** Aplica a pontuação a uma sequência de dígitos crua. */
  formatar(digitos: string): string;

  /** Confere os dígitos verificadores. Recebe o valor já completo. */
  valido(digitos: string): boolean;
}

export const MASCARA_CPF: MascaraDocumento = {
  prefixoId: 'br-input-cpf',
  digitos: 11,
  tamanhoFormatado: 14,
  icone: 'id-card',
  chaveIncompleto: 'cpfIncomplete',
  chaveInvalido: 'cpfInvalid',
  mensagens: {
    required: 'Campo obrigatório',
    cpfInvalid: 'CPF inválido',
    cpfIncomplete: 'CPF incompleto',
  },

  formatar(digitos: string): string {
    if (!digitos) return '';
    let saida = digitos;
    // 000.000.000-00
    if (digitos.length > 3) {
      saida = digitos.slice(0, 3) + '.' + digitos.slice(3);
    }
    if (digitos.length > 6) {
      saida = saida.slice(0, 7) + '.' + saida.slice(7);
    }
    if (digitos.length > 9) {
      saida = saida.slice(0, 11) + '-' + saida.slice(11);
    }
    return saida;
  },

  valido(valor: string): boolean {
    const digitos = valor.replace(/\D/g, '');

    if (digitos.length !== 11) return false;

    // Documento com todos os dígitos iguais passa no cálculo, mas não existe.
    if (/^(\d)\1+$/.test(digitos)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(digitos[i], 10) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(digitos[9], 10)) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(digitos[i], 10) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(digitos[10], 10)) return false;

    return true;
  },
};

export const MASCARA_CNPJ: MascaraDocumento = {
  prefixoId: 'br-input-cnpj',
  digitos: 14,
  tamanhoFormatado: 18,
  icone: 'building',
  chaveIncompleto: 'cnpjIncomplete',
  chaveInvalido: 'cnpjInvalid',
  mensagens: {
    required: 'Campo obrigatório',
    cnpjInvalid: 'CNPJ inválido',
    cnpjIncomplete: 'CNPJ incompleto',
  },

  formatar(digitos: string): string {
    if (!digitos) return '';
    let saida = digitos;
    // 00.000.000/0000-00
    if (digitos.length > 2) {
      saida = digitos.slice(0, 2) + '.' + digitos.slice(2);
    }
    if (digitos.length > 5) {
      saida = saida.slice(0, 6) + '.' + saida.slice(6);
    }
    if (digitos.length > 8) {
      saida = saida.slice(0, 10) + '/' + saida.slice(10);
    }
    if (digitos.length > 12) {
      saida = saida.slice(0, 15) + '-' + saida.slice(15);
    }
    return saida;
  },

  valido(valor: string): boolean {
    const digitos = valor.replace(/\D/g, '');

    if (digitos.length !== 14) return false;

    if (/^(\d)\1+$/.test(digitos)) return false;

    const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let soma = 0;
    for (let i = 0; i < 12; i++) {
      soma += parseInt(digitos[i], 10) * pesos1[i];
    }
    let resto = soma % 11;
    const verificador1 = resto < 2 ? 0 : 11 - resto;
    if (verificador1 !== parseInt(digitos[12], 10)) return false;

    const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    soma = 0;
    for (let i = 0; i < 13; i++) {
      soma += parseInt(digitos[i], 10) * pesos2[i];
    }
    resto = soma % 11;
    const verificador2 = resto < 2 ? 0 : 11 - resto;
    if (verificador2 !== parseInt(digitos[13], 10)) return false;

    return true;
  },
};
