import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrInputTelefoneComponent } from './br-input-telefone.component';

describe('BrInputTelefoneComponent', () => {
  let component: BrInputTelefoneComponent;
  let fixture: ComponentFixture<BrInputTelefoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrInputTelefoneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrInputTelefoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format mobile phone correctly', () => {
    component.writeValue('11999998888');
    expect(component.displayValue).toBe('(11) 99999-8888');
  });

  it('should format landline correctly', () => {
    component.writeValue('1133334444');
    expect(component.displayValue).toBe('(11) 3333-4444');
  });

  it('should validate incomplete phone', () => {
    component.writeValue('1199');
    const errors = component.validate();
    expect(errors?.['phoneIncomplete']).toBe(true);
  });

  it('should validate invalid DDD', () => {
    component.writeValue('00999998888');
    const errors = component.validate();
    expect(errors?.['phoneInvalid']).toBe(true);
  });

  it('should validate mobile first digit', () => {
    component.writeValue('11899998888');
    const errors = component.validate();
    expect(errors?.['phoneInvalid']).toBe(true);
  });

  it('should accept valid mobile phone', () => {
    component.writeValue('11999998888');
    const errors = component.validate();
    expect(errors).toBeNull();
  });

  it('should accept valid landline when allowed', () => {
    component.allowLandline = true;
    component.writeValue('1133334444');
    const errors = component.validate();
    expect(errors).toBeNull();
  });

  it('should require field when required is true', () => {
    component.required = true;
    component.writeValue('');
    const errors = component.validate();
    expect(errors?.['required']).toBe(true);
  });

  it('should work with ControlValueAccessor', () => {
    component.writeValue('11999998888');
    expect(component.value).toBe('11999998888');
    expect(component.displayValue).toBe('(11) 99999-8888');
  });

  it('should strip non-digits from input', () => {
    component.writeValue('(11) 99999-8888');
    expect(component.value).toBe('11999998888');
  });

  it('should render label when provided', () => {
    component.label = 'Telefone';
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain('Telefone');
  });

  it('should show required indicator', () => {
    component.label = 'Telefone';
    component.required = true;
    fixture.detectChanges();

    const required = fixture.nativeElement.querySelector('.text-govbr-danger');
    expect(required.textContent).toBe('*');
  });
});
