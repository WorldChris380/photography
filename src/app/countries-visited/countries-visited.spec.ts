import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountriesVisited } from './countries-visited';

describe('CountriesVisited', () => {
  let component: CountriesVisited;
  let fixture: ComponentFixture<CountriesVisited>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountriesVisited]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountriesVisited);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
