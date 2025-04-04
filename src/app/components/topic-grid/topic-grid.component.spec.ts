import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicGridComponent } from './topic-grid.component';

describe('TopicGridComponent', () => {
  let component: TopicGridComponent;
  let fixture: ComponentFixture<TopicGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
