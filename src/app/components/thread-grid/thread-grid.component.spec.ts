import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadGridComponent } from './thread-grid.component';

describe('ThreadGridComponent', () => {
  let component: ThreadGridComponent;
  let fixture: ComponentFixture<ThreadGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreadGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreadGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
