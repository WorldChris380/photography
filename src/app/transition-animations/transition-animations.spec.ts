import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionAnimations } from './transition-animations';

describe('TransitionAnimations', () => {
  let component: TransitionAnimations;
  let fixture: ComponentFixture<TransitionAnimations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransitionAnimations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransitionAnimations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
