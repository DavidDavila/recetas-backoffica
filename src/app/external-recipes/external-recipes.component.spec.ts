import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalRecipesComponent } from './external-recipes.component';

describe('ExternalRecipesComponent', () => {
  let component: ExternalRecipesComponent;
  let fixture: ComponentFixture<ExternalRecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalRecipesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
