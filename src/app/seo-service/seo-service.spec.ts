import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeoService } from './seo-service';

describe('SeoService', () => {
  let component: SeoService;
  let fixture: ComponentFixture<SeoService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeoService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeoService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
