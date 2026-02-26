import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

import {
  BrDocumentoMascaradoBase,
  TEMPLATE_DOCUMENTO_MASCARADO,
} from '../shared/br-documento-mascarado.base';
import { MASCARA_CNPJ, MascaraDocumento } from '../shared/mascara-documento';

/**
 * Campo de CNPJ com máscara, dígito verificador e mensagens de erro.
 *
 * Todo o comportamento está na base compartilhada com `br-input-cpf`; aqui
 * ficam só a máscara e o placeholder. A API pública é a mesma da 1.2.7.
 */
@Component({
  selector: 'br-input-cnpj',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: TEMPLATE_DOCUMENTO_MASCARADO,
})
export class BrInputCnpjComponent extends BrDocumentoMascaradoBase {
  readonly mascara: MascaraDocumento = MASCARA_CNPJ;

  @Input() override placeholder = '00.000.000/0000-00';
}
