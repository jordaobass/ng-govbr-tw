import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrDividerComponent } from './br-divider.component';

describe('BrDividerComponent', () => {
  let component: BrDividerComponent;
  let fixture: ComponentFixture<BrDividerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrDividerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrDividerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // `div > div` contava qualquer div aninhada, incluindo o container.
  // O que importa é quantas LINHAS o container tem como filhas diretas.
  function contarLinhas(): number {
    const container = fixture.nativeElement.querySelector('div');
    return Array.from(container.children).filter(
      (el) => (el as HTMLElement).tagName === 'DIV'
    ).length;
  }

  it('should render simple divider without text', () => {
    expect(contarLinhas()).toBe(1);
  });

  it('should render text when provided', () => {
    component.text = 'OR';
    fixture.detectChanges();

    const text = fixture.nativeElement.querySelector('span');
    expect(text.textContent).toContain('OR');
  });

  it('should render two lines when text is provided', () => {
    component.text = 'OR';
    fixture.detectChanges();

    expect(contarLinhas()).toBe(2);
  });

  it('should apply spacing classes', () => {
    component.spacing = 'large';
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('div');
    expect(container.classList.contains('my-6')).toBe(true);
  });

  it('should apply vertical orientation', () => {
    component.orientation = 'vertical';
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('div');
    expect(container.classList.contains('flex-col')).toBe(true);
  });

  it('should have proper role when text is present', () => {
    component.text = 'OR';
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('div');
    expect(container.getAttribute('role')).toBe('separator');
  });

  it('should have presentation role when no text', () => {
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('div');
    expect(container.getAttribute('role')).toBe('presentation');
  });
});
