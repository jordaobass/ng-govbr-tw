import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrInputMoneyComponent } from './br-input-money.component';

describe('BrInputMoneyComponent', () => {
  let component: BrInputMoneyComponent;
  let fixture: ComponentFixture<BrInputMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrInputMoneyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrInputMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format money correctly', () => {
    component.writeValue(123456); // 1234.56 in cents
    expect(component.displayValue).toBe('1.234,56');
  });

  it('should store value in cents', () => {
    component.writeValue(100); // 1.00 in cents
    expect(component.value).toBe(100);
    expect(component.valueInReais).toBe(1);
  });

  it('should validate minimum value', () => {
    fixture.componentRef.setInput('min', 10);
    component.writeValue(500); // 5.00 reais
    const errors = component.validate();
    expect(errors?.['min']).toBeTruthy();
  });

  it('should validate maximum value', () => {
    fixture.componentRef.setInput('max', 100);
    component.writeValue(15000); // 150.00 reais
    const errors = component.validate();
    expect(errors?.['max']).toBeTruthy();
  });

  it('should accept valid value within range', () => {
    fixture.componentRef.setInput('min', 10);
    fixture.componentRef.setInput('max', 100);
    component.writeValue(5000); // 50.00 reais
    const errors = component.validate();
    expect(errors).toBeNull();
  });

  it('should require field when required is true', () => {
    fixture.componentRef.setInput('required', true);
    component.writeValue(null);
    const errors = component.validate();
    expect(errors?.['required']).toBe(true);
  });

  it('should render prefix', () => {
    fixture.componentRef.setInput('showPrefix', true);
    fixture.componentRef.setInput('prefix', 'R$');
    fixture.detectChanges();

    const prefix = fixture.nativeElement.querySelector('span');
    expect(prefix.textContent).toContain('R$');
  });

  it('should render label when provided', () => {
    fixture.componentRef.setInput('label', 'Valor');
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain('Valor');
  });

  it('should show required indicator', () => {
    fixture.componentRef.setInput('label', 'Valor');
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const required = fixture.nativeElement.querySelector('.text-govbr-danger');
    expect(required.textContent).toBe('*');
  });

  it('should convert float input to cents', () => {
    // A unidade é declarada, não adivinhada: 100 centavos e 100 reais são o
    // mesmo número, então só quem usa o componente sabe qual é qual.
    fixture.componentRef.setInput('valueUnit', 'reais');
    component.writeValue(50.5);
    expect(component.value).toBe(5050);
  });

  it('should warn when a fractional value arrives declared as cents', () => {
    const warn = spyOn(console, 'warn');
    fixture.componentRef.setInput('valueUnit', 'cents');
    component.writeValue(50.5);

    // Não existe meio centavo em BRL: valor fracionário em centavos é sinal
    // confiável de que o formulário está entregando reais.
    expect(warn).toHaveBeenCalled();
    expect(component.value).toBe(51);
  });

  it('should handle null value', () => {
    component.writeValue(null);
    expect(component.value).toBeNull();
    expect(component.displayValue).toBe('');
  });
});
