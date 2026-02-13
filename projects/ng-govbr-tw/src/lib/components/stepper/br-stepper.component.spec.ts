import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrStepperComponent, BrStepperStep } from './br-stepper.component';

describe('BrStepperComponent', () => {
  let component: BrStepperComponent;
  let fixture: ComponentFixture<BrStepperComponent>;

  const mockSteps: BrStepperStep[] = [
    { label: 'Step 1', description: 'First step' },
    { label: 'Step 2', description: 'Second step' },
    { label: 'Step 3', description: 'Third step', optional: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrStepperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrStepperComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('steps', mockSteps);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all steps', () => {
    const steps = fixture.nativeElement.querySelectorAll('li');
    expect(steps.length).toBe(3);
  });

  it('should show step labels', () => {
    const labels = fixture.nativeElement.querySelectorAll('button span.font-medium');
    expect(labels[0].textContent).toContain('Step 1');
    expect(labels[1].textContent).toContain('Step 2');
  });

  it('should show optional indicator', () => {
    // `span.text-xs` casava primeiro com a descrição do passo 1.
    // O marcador de opcional é o único com `.ml-1`.
    const optional = fixture.nativeElement.querySelector('span.text-xs.ml-1');
    expect(optional.textContent).toContain('opcional');
  });

  it('should apply completed styles to previous steps', () => {
    fixture.componentRef.setInput('currentStep', 2);
    fixture.detectChanges();

    const completedIndicator = fixture.nativeElement.querySelector('.bg-govbr-success');
    expect(completedIndicator).toBeTruthy();
  });

  it('should apply current styles to active step', () => {
    fixture.componentRef.setInput('currentStep', 1);
    fixture.detectChanges();

    const currentItem = fixture.nativeElement.querySelector('[aria-current="step"]');
    expect(currentItem).toBeTruthy();
  });

  it('should emit stepChange when clicking previous step', () => {
    fixture.componentRef.setInput('clickable', true);
    fixture.componentRef.setInput('currentStep', 2);
    fixture.detectChanges();

    const spy = spyOn(component.stepChange, 'emit');
    component.onStepClick(0);

    expect(spy).toHaveBeenCalledWith(0);
  });

  it('should not emit stepChange when clicking future step', () => {
    fixture.componentRef.setInput('clickable', true);
    fixture.componentRef.setInput('currentStep', 0);
    fixture.detectChanges();

    const spy = spyOn(component.stepChange, 'emit');
    component.onStepClick(2);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should apply vertical orientation class', () => {
    fixture.componentRef.setInput('orientation', 'vertical');
    fixture.detectChanges();

    const stepper = fixture.nativeElement.querySelector('.br-stepper-vertical');
    expect(stepper).toBeTruthy();
  });

  it('should have proper accessibility attributes', () => {
    const nav = fixture.nativeElement.querySelector('nav');
    expect(nav.getAttribute('role')).toBe('navigation');
    expect(nav.getAttribute('aria-label')).toBe('Etapas do processo');
  });
});
