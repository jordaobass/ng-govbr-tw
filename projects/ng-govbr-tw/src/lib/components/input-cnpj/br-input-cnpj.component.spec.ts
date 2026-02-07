import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { BrInputCnpjComponent } from './br-input-cnpj.component';

@Component({
  template: `<br-input-cnpj [formControl]="control" label="CNPJ"></br-input-cnpj>`,
  standalone: true,
  imports: [BrInputCnpjComponent, ReactiveFormsModule],
})
class TestHostComponent {
  control = new FormControl('');
}

describe('BrInputCnpjComponent', () => {
  let component: BrInputCnpjComponent;
  let fixture: ComponentFixture<BrInputCnpjComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrInputCnpjComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrInputCnpjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('CNPJ formatting', () => {
    it('should format CNPJ with dots, slash and dash', () => {
      component.writeValue('11222333000181');
      expect(component.displayValue).toBe('11.222.333/0001-81');
    });

    it('should handle partial CNPJ', () => {
      component.writeValue('11222');
      expect(component.displayValue).toBe('11.222');

      component.writeValue('112223330001');
      expect(component.displayValue).toBe('11.222.333/0001');
    });

    it('should strip non-numeric characters', () => {
      component.writeValue('11.222.333/0001-81');
      expect(component.displayValue).toBe('11.222.333/0001-81');
    });

    it('should limit to 14 digits', () => {
      component.writeValue('1122233300018199999');
      expect(component.displayValue).toBe('11.222.333/0001-81');
    });
  });

  describe('CNPJ validation', () => {
    it('should validate a valid CNPJ', () => {
      // CNPJ válido: 11.222.333/0001-81
      const control = new FormControl('11222333000181');
      const result = component.validate(control);
      expect(result).toBeNull();
    });

    it('should reject invalid CNPJ', () => {
      const control = new FormControl('12345678901234');
      const result = component.validate(control);
      expect(result).toEqual({ cnpjInvalid: true });
    });

    it('should reject incomplete CNPJ', () => {
      const control = new FormControl('1122233300018');
      const result = component.validate(control);
      expect(result).toEqual({ cnpjIncomplete: true });
    });

    it('should reject CNPJ with all same digits', () => {
      const control = new FormControl('11111111111111');
      const result = component.validate(control);
      expect(result).toEqual({ cnpjInvalid: true });
    });

    it('should return required error when empty and required', () => {
      component.required = true;
      const control = new FormControl('');
      const result = component.validate(control);
      expect(result).toEqual({ required: true });
    });

    it('should return null when empty and not required', () => {
      component.required = false;
      const control = new FormControl('');
      const result = component.validate(control);
      expect(result).toBeNull();
    });
  });

  describe('valid CNPJs', () => {
    const validCnpjs = [
      '11222333000181',  // 11.222.333/0001-81
      '11444777000161',  // 11.444.777/0001-61
      '00623904000173',  // 00.623.904/0001-73 (Petrobras)
    ];

    validCnpjs.forEach(cnpj => {
      it(`should accept valid CNPJ: ${cnpj}`, () => {
        const control = new FormControl(cnpj);
        const result = component.validate(control);
        expect(result).toBeNull();
      });
    });
  });
});

describe('BrInputCnpjComponent with FormControl', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  it('should work with reactive forms', () => {
    hostComponent.control.setValue('11222333000181');
    hostFixture.detectChanges();

    const input = hostFixture.nativeElement.querySelector('input');
    expect(input.value).toBe('11.222.333/0001-81');
  });

  it('should update form control on input', () => {
    const input = hostFixture.nativeElement.querySelector('input');
    input.value = '11.222.333/0001-81';
    input.dispatchEvent(new Event('input'));
    hostFixture.detectChanges();

    expect(hostComponent.control.value).toBe('11222333000181');
  });
});
