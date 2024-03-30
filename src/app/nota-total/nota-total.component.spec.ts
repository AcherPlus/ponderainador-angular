import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaTotalComponent } from './nota-total.component';

describe('NotaTotalComponent', () => {
  let component: NotaTotalComponent;
  let fixture: ComponentFixture<NotaTotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaTotalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotaTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
