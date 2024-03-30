import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaIndividualComponent } from './nota-individual.component';

describe('NotaIndividualComponent', () => {
  let component: NotaIndividualComponent;
  let fixture: ComponentFixture<NotaIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaIndividualComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotaIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
