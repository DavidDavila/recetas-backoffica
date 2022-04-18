import { TestBed } from '@angular/core/testing';
import { ExternalRecipesService } from './external-recipes.service';

describe('ExternalRecipesService', () => {
  let service: ExternalRecipesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalRecipesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
