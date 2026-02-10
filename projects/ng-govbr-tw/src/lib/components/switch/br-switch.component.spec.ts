import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrSwitchComponent } from './br-switch.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('BrSwitchComponent', () => {
  let component: BrSwitchComponent;
  let fixture: ComponentFixture<BrSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrSwitchComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BrSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle on click', () => {
    expect(component.checked).toBe(false);
    component.toggle();
    expect(component.checked).toBe(true);
    component.toggle();
    expect(component.checked).toBe(false);
  });

  it('should not toggle when disabled', () => {
    component.disabled = true;
    component.toggle();
    expect(component.checked).toBe(false);
  });

  it('should emit checkedChange on toggle', () => {
    const spy = spyOn(component.checkedChange, 'emit');
    component.toggle();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should render label when provided', () => {
    component.label = 'Test Label';
    fixture.detectChanges();

    // `span` genérico pega o primeiro do DOM, que é o botão do switch (vazio).
    // O label é o span que carrega o texto.
    const label = fixture.nativeElement.querySelector('span.select-none');
    expect(label.textContent).toContain('Test Label');
  });

  it('should have proper role and aria-checked', () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');

    expect(button.getAttribute('role')).toBe('switch');
    expect(button.getAttribute('aria-checked')).toBe('false');

    component.toggle();
    fixture.detectChanges();

    expect(button.getAttribute('aria-checked')).toBe('true');
  });

  it('should work with ControlValueAccessor', () => {
    component.writeValue(true);
    expect(component.checked).toBe(true);

    component.writeValue(false);
    expect(component.checked).toBe(false);
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBe(true);
  });
});
