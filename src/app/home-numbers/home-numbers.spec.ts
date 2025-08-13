import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeNumbers } from './home-numbers';

describe('HomeNumbers', () => {
  let component: HomeNumbers;
  let fixture: ComponentFixture<HomeNumbers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeNumbers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeNumbers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
