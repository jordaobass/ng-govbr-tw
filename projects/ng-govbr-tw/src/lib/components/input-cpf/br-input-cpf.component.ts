import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

import {
  BrDocumentoMascaradoBase,
  TEMPLATE_DOCUMENTO_MASCARADO,
} from '../shared/br-documento-mascarado.base';
import { MASCARA_CPF, MascaraDocumento } from '../shared/mascara-documento';

/**
 * Campo de CPF com máscara, dígito verificador e mensagens de erro.
 *
 * Todo o comportamento está na base compartilhada com `br-input-cnpj`; aqui
 * ficam só a máscara e o placeholder. A API pública é a mesma da 1.2.7.
 */
@Component({
  selector: 'br-input-cpf',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: TEMPLATE_DOCUMENTO_MASCARADO,
})
export class BrInputCpfComponent extends BrDocumentoMascaradoBase {
  readonly mascara: MascaraDocumento = MASCARA_CPF;

  @Input() override placeholder = '000.000.000-00';
}
