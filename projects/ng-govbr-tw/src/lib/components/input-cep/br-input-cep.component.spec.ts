import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrInputCepComponent } from './br-input-cep.component';

describe('BrInputCepComponent', () => {
  let component: BrInputCepComponent;
  let fixture: ComponentFixture<BrInputCepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrInputCepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrInputCepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format CEP correctly', () => {
    component.writeValue('01310100');
    expect(component.displayValue).toBe('01310-100');
  });

  it('should validate incomplete CEP', () => {
    component.writeValue('0131');
    const errors = component.validate();
    expect(errors?.['cepIncomplete']).toBe(true);
  });

  it('should accept valid CEP', () => {
    component.writeValue('01310100');
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
    component.writeValue('01310100');
    expect(component.value).toBe('01310100');
    expect(component.displayValue).toBe('01310-100');
  });

  it('should strip non-digits from input', () => {
    component.writeValue('01310-100');
    expect(component.value).toBe('01310100');
  });

  it('should render label when provided', () => {
    component.label = 'CEP';
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain('CEP');
  });

  it('should show required indicator', () => {
    component.label = 'CEP';
    component.required = true;
    fixture.detectChanges();

    const required = fixture.nativeElement.querySelector('.text-govbr-danger');
    expect(required.textContent).toBe('*');
  });

  it('should limit input to 8 digits', () => {
    component.writeValue('0131010099999');
    expect(component.value).toBe('01310100');
  });
});
