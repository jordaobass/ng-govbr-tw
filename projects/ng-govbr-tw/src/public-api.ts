/*
 * Public API Surface of @schenkerjon/ng-govbr-tw
 */

// Animation System
export * from './lib/animations/index';

// Components
export { BrButtonComponent } from './lib/components/button/br-button.component';
export { BrInputComponent } from './lib/components/input/br-input.component';
export { BrBadgeComponent } from './lib/components/badge/br-badge.component';
export { BrMessageComponent } from './lib/components/message/br-message.component';
export { BrTableComponent } from './lib/components/table/br-table.component';
export { BrCardComponent } from './lib/components/card/br-card.component';
export { BrHeaderComponent } from './lib/components/header/br-header.component';
export { BrFooterComponent } from './lib/components/footer/br-footer.component';
export { BrMenuComponent } from './lib/components/menu/br-menu.component';
export { BrMenuItemComponent } from './lib/components/menu/br-menu-item.component';
export {
  BrMenuBarComponent,
  BrMenuBarItemComponent,
  BrMenuBarSubItemComponent,
} from './lib/components/menu-bar/br-menu-bar.component';
export {
  BrMegaMenuComponent,
  BrMegaMenuTriggerComponent,
  BrMegaMenuPanelComponent,
  BrMegaMenuColumnComponent,
  BrMegaMenuLinkComponent,
} from './lib/components/mega-menu/br-mega-menu.component';
export type { BrMenuItem, BrSocialLink } from './lib/components/mega-menu/br-mega-menu.component';
export { BrLayoutComponent } from './lib/components/layout/br-layout.component';
export { BrModalComponent } from './lib/components/modal/br-modal.component';
export { BrLoadingComponent } from './lib/components/loading/br-loading.component';
export { BrTabComponent, BrTabPanelComponent } from './lib/components/tab/br-tab.component';
export type { BrTabItem } from './lib/components/tab/br-tab.component';
export { BrCheckboxComponent } from './lib/components/checkbox/br-checkbox.component';
export { BrRadioGroupComponent } from './lib/components/radio/br-radio.component';
export type { BrRadioOption } from './lib/components/radio/br-radio.component';
export { BrSelectComponent } from './lib/components/select/br-select.component';
export type { BrSelectOption } from './lib/components/select/br-select.component';
export { BrTextareaComponent } from './lib/components/textarea/br-textarea.component';
export { BrPaginationComponent } from './lib/components/pagination/br-pagination.component';
export { BrBreadcrumbComponent } from './lib/components/breadcrumb/br-breadcrumb.component';
export type { BrBreadcrumbItem } from './lib/components/breadcrumb/br-breadcrumb.component';
export { BrTooltipComponent } from './lib/components/tooltip/br-tooltip.component';
export {
  BrSidebarComponent,
  BrSidebarGroupComponent,
  BrSidebarGroupLabelComponent,
  BrSidebarItemComponent,
  BrSidebarSubComponent,
} from './lib/components/sidebar/br-sidebar.component';
export {
  BrAccordionComponent,
  BrAccordionItemComponent,
} from './lib/components/accordion/br-accordion.component';
export {
  BrWizardComponent,
  BrWizardStepComponent,
} from './lib/components/wizard/br-wizard.component';
export { BrCookiebarComponent } from './lib/components/cookiebar/br-cookiebar.component';
export type { BrCookieGroup } from './lib/components/cookiebar/br-cookiebar.component';
export { BrDatepickerComponent } from './lib/components/datepicker/br-datepicker.component';
export { BrTimepickerComponent } from './lib/components/timepicker/br-timepicker.component';
export { BrDatetimepickerComponent } from './lib/components/datetimepicker/br-datetimepicker.component';
export { BrMagicButtonComponent } from './lib/components/magic-button/br-magic-button.component';
export type { BrMagicAction } from './lib/components/magic-button/br-magic-button.component';
export { BrItemComponent, BrListComponent } from './lib/components/list/br-list.component';
export { BrUploadComponent } from './lib/components/upload/br-upload.component';
export type { BrUploadFile } from './lib/components/upload/br-upload.component';
export { BrAvatarComponent } from './lib/components/avatar/br-avatar.component';
export { BrSkeletonComponent } from './lib/components/skeleton/br-skeleton.component';
export { BrToastContainerComponent } from './lib/components/toast/br-toast.component';
export { BrToastService } from './lib/components/toast/br-toast.service';
export type { BrToast, BrToastOptions } from './lib/components/toast/br-toast.service';
export { BrInputCpfComponent } from './lib/components/input-cpf/br-input-cpf.component';
export { BrInputCnpjComponent } from './lib/components/input-cnpj/br-input-cnpj.component';
export { BrTimelineComponent } from './lib/components/timeline/br-timeline.component';
export type { BrTimelineItem } from './lib/components/timeline/br-timeline.component';
export { BrSwitchComponent } from './lib/components/switch/br-switch.component';
export { BrChipComponent } from './lib/components/chip/br-chip.component';
export { BrDividerComponent } from './lib/components/divider/br-divider.component';
export { BrStepperComponent } from './lib/components/stepper/br-stepper.component';
export type { BrStepperStep } from './lib/components/stepper/br-stepper.component';
export { BrInputTelefoneComponent } from './lib/components/input-telefone/br-input-telefone.component';
export { BrInputCepComponent } from './lib/components/input-cep/br-input-cep.component';
export type { BrCepAddress } from './lib/components/input-cep/br-input-cep.component';
export { BrInputMoneyComponent } from './lib/components/input-money/br-input-money.component';
export { BrNotificationComponent } from './lib/components/notification/br-notification.component';
export { BrSigninComponent } from './lib/components/signin/br-signin.component';

// Skiplink — atalhos de navegação exigidos pelo Gov.br DS / eMAG
export { BrSkiplinkComponent } from './lib/components/skiplink/br-skiplink.component';
export type { BrSkiplinkItem } from './lib/components/skiplink/br-skiplink.component';

// Services
export { BrContrastService } from './lib/services/br-contrast.service';
