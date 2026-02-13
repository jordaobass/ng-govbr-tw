import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrTimelineComponent, BrTimelineItem } from './br-timeline.component';

describe('BrTimelineComponent', () => {
  let component: BrTimelineComponent;
  let fixture: ComponentFixture<BrTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrTimelineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrTimelineComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render timeline items', () => {
    const items: BrTimelineItem[] = [
      { title: 'Step 1', status: 'completed' },
      { title: 'Step 2', status: 'current' },
      { title: 'Step 3', status: 'pending' },
    ];
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();

    const timelineItems = fixture.nativeElement.querySelectorAll('.br-timeline-item');
    expect(timelineItems.length).toBe(3);
  });

  it('should apply completed status class', () => {
    fixture.componentRef.setInput('items', [{ title: 'Done', status: 'completed' }]);
    fixture.detectChanges();

    const item = fixture.nativeElement.querySelector('.br-timeline-item-completed');
    expect(item).toBeTruthy();
  });

  it('should apply current status class', () => {
    fixture.componentRef.setInput('items', [{ title: 'In Progress', status: 'current' }]);
    fixture.detectChanges();

    const item = fixture.nativeElement.querySelector('.br-timeline-item-current');
    expect(item).toBeTruthy();
  });

  it('should apply pending status class by default', () => {
    fixture.componentRef.setInput('items', [{ title: 'Pending' }]);
    fixture.detectChanges();

    const item = fixture.nativeElement.querySelector('.br-timeline-item-pending');
    expect(item).toBeTruthy();
  });

  it('should display date when provided', () => {
    fixture.componentRef.setInput('items', [{ title: 'Event', date: '01/01/2026' }]);
    fixture.detectChanges();

    const date = fixture.nativeElement.querySelector('.br-timeline-date');
    expect(date.textContent).toContain('01/01/2026');
  });

  it('should display description when provided', () => {
    fixture.componentRef.setInput('items', [{ title: 'Event', description: 'Some description' }]);
    fixture.detectChanges();

    const description = fixture.nativeElement.querySelector('.br-timeline-description');
    expect(description.textContent).toContain('Some description');
  });

  it('should apply horizontal orientation class', () => {
    fixture.componentRef.setInput('orientation', 'horizontal');
    fixture.componentRef.setInput('items', [{ title: 'Step' }]);
    fixture.detectChanges();

    const timeline = fixture.nativeElement.querySelector('.br-timeline-horizontal');
    expect(timeline).toBeTruthy();
  });

  it('should have proper accessibility attributes', () => {
    fixture.componentRef.setInput('items', [{ title: 'Step', status: 'current' }]);
    fixture.detectChanges();

    const list = fixture.nativeElement.querySelector('[role="list"]');
    expect(list).toBeTruthy();

    const currentItem = fixture.nativeElement.querySelector('[aria-current="step"]');
    expect(currentItem).toBeTruthy();
  });
});
