import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrChipComponent } from './br-chip.component';

describe('BrChipComponent', () => {
  let component: BrChipComponent;
  let fixture: ComponentFixture<BrChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrChipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrChipComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Test Chip');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label', () => {
    const chip = fixture.nativeElement.querySelector('span');
    expect(chip.textContent).toContain('Test Chip');
  });

  it('should toggle selection when selectable', () => {
    fixture.componentRef.setInput('selectable', true);
    expect(component.selected).toBe(false);

    component.handleClick();
    expect(component.selected).toBe(true);

    component.handleClick();
    expect(component.selected).toBe(false);
  });

  it('should not toggle when not selectable', () => {
    fixture.componentRef.setInput('selectable', false);
    component.handleClick();
    expect(component.selected).toBe(false);
  });

  it('should not toggle when disabled', () => {
    fixture.componentRef.setInput('selectable', true);
    fixture.componentRef.setInput('disabled', true);
    component.handleClick();
    expect(component.selected).toBe(false);
  });

  it('should emit selectedChange on selection', () => {
    fixture.componentRef.setInput('selectable', true);
    const spy = spyOn(component.selectedChange, 'emit');

    component.handleClick();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should emit remove event', () => {
    fixture.componentRef.setInput('removable', true);
    fixture.detectChanges();

    const spy = spyOn(component.remove, 'emit');
    const event = new Event('click');
    component.handleRemove(event);

    expect(spy).toHaveBeenCalled();
  });

  it('should render icon when provided', () => {
    fixture.componentRef.setInput('icon', 'fas fa-star');
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('i.fas.fa-star');
    expect(icon).toBeTruthy();
  });

  it('should render remove button when removable', () => {
    fixture.componentRef.setInput('removable', true);
    fixture.detectChanges();

    const removeButton = fixture.nativeElement.querySelector('button');
    expect(removeButton).toBeTruthy();
  });

  it('should have proper aria attributes when selectable', () => {
    fixture.componentRef.setInput('selectable', true);
    fixture.detectChanges();

    const chip = fixture.nativeElement.querySelector('span');
    expect(chip.getAttribute('role')).toBe('button');
    expect(chip.getAttribute('aria-pressed')).toBe('false');
  });
});
