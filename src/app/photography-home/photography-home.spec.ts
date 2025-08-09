import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotographyHome } from './photography-home';

describe('PhotographyHome', () => {
  let component: PhotographyHome;
  let fixture: ComponentFixture<PhotographyHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotographyHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotographyHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
