import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarNegocioComponent } from './agregar-negocio.component';

describe('AgregarNegocioComponent', () => {
  let component: AgregarNegocioComponent;
  let fixture: ComponentFixture<AgregarNegocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarNegocioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarNegocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
