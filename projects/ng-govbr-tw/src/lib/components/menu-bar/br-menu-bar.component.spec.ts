import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrMenuBarItemComponent } from './br-menu-bar.component';

/**
 * Regressão de um defeito encontrado pelo E2E: quem usa mouse não conseguia
 * abrir o submenu pelo clique.
 *
 * O ponteiro sempre passa por cima do item antes do clique, então o
 * `mouseenter` abria e o clique seguinte alternava de volta para fechado.
 * Medido no navegador: hover → aberto; hover + clique → fechado.
 */
describe('BrMenuBarItemComponent — abertura do submenu', () => {
  let component: BrMenuBarItemComponent;
  let fixture: ComponentFixture<BrMenuBarItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrMenuBarItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrMenuBarItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Serviços');
    fixture.componentRef.setInput('hasSubmenu', true);
    fixture.detectChanges();
  });

  it('should open on hover', () => {
    component.openSub(true);
    expect(component.showSub).toBe(true);
  });

  it('should keep the submenu open when the click follows a hover', () => {
    component.openSub(true); // mouseenter
    component.toggleSub(); // clique do usuário no mesmo item

    expect(component.showSub)
      .withContext('o clique depois do hover fechou o submenu que o hover abriu')
      .toBe(true);
  });

  it('should still toggle on the second click', () => {
    component.openSub(true);
    component.toggleSub(); // confirma a abertura
    component.toggleSub(); // agora sim, alterna

    expect(component.showSub).toBe(false);
  });

  it('should toggle normally without hover (touch)', () => {
    component.toggleSub();
    expect(component.showSub).toBe(true);

    component.toggleSub();
    expect(component.showSub).toBe(false);
  });

  it('should close on mouseleave', () => {
    component.openSub(true);
    component.closeSub();
    expect(component.showSub).toBe(false);
  });

  it('should not open when there is no submenu', () => {
    fixture.componentRef.setInput('hasSubmenu', false);
    component.openSub(true);
    expect(component.showSub).toBe(false);
  });
});
