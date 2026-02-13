import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { BrInputCpfComponent } from './br-input-cpf.component';

@Component({
  template: `<br-input-cpf [formControl]="control" label="CPF"></br-input-cpf>`,
  standalone: true,
  imports: [BrInputCpfComponent, ReactiveFormsModule],
})
class TestHostComponent {
  control = new FormControl('');
}

describe('BrInputCpfComponent', () => {
  let component: BrInputCpfComponent;
  let fixture: ComponentFixture<BrInputCpfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrInputCpfComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrInputCpfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('CPF formatting', () => {
    it('should format CPF with dots and dash', () => {
      component.writeValue('12345678901');
      expect(component.displayValue).toBe('123.456.789-01');
    });

    it('should handle partial CPF', () => {
      component.writeValue('123');
      expect(component.displayValue).toBe('123');

      component.writeValue('1234567');
      expect(component.displayValue).toBe('123.456.7');
    });

    it('should strip non-numeric characters', () => {
      component.writeValue('123.456.789-01');
      expect(component.displayValue).toBe('123.456.789-01');
    });

    it('should limit to 11 digits', () => {
      component.writeValue('123456789012345');
      expect(component.displayValue).toBe('123.456.789-01');
    });
  });

  describe('CPF validation', () => {
    it('should validate a valid CPF', () => {
      // CPF válido: 529.982.247-25
      const control = new FormControl('52998224725');
      const result = component.validate(control);
      expect(result).toBeNull();
    });

    it('should reject invalid CPF', () => {
      const control = new FormControl('12345678901');
      const result = component.validate(control);
      expect(result).toEqual({ cpfInvalid: true });
    });

    it('should reject incomplete CPF', () => {
      const control = new FormControl('1234567890');
      const result = component.validate(control);
      expect(result).toEqual({ cpfIncomplete: true });
    });

    it('should reject CPF with all same digits', () => {
      const control = new FormControl('11111111111');
      const result = component.validate(control);
      expect(result).toEqual({ cpfInvalid: true });
    });

    it('should return required error when empty and required', () => {
      fixture.componentRef.setInput('required', true);
      const control = new FormControl('');
      const result = component.validate(control);
      expect(result).toEqual({ required: true });
    });

    it('should return null when empty and not required', () => {
      fixture.componentRef.setInput('required', false);
      const control = new FormControl('');
      const result = component.validate(control);
      expect(result).toBeNull();
    });
  });

  describe('valid CPFs', () => {
    it('should accept valid CPF: 52998224725', () => {
      const control = new FormControl('52998224725');
      const result = component.validate(control);
      expect(result).toBeNull();
    });

    it('should accept valid CPF: 11144477735', () => {
      const control = new FormControl('11144477735');
      const result = component.validate(control);
      expect(result).toBeNull();
    });
  });
});

describe('BrInputCpfComponent with FormControl', () => {
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
    hostComponent.control.setValue('52998224725');
    hostFixture.detectChanges();

    const input = hostFixture.nativeElement.querySelector('input');
    expect(input.value).toBe('529.982.247-25');
  });

  it('should update form control on input', () => {
    const input = hostFixture.nativeElement.querySelector('input');
    input.value = '529.982.247-25';
    input.dispatchEvent(new Event('input'));
    hostFixture.detectChanges();

    expect(hostComponent.control.value).toBe('52998224725');
  });
});
