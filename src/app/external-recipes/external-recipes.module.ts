import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalRecipesComponent } from './external-recipes.component';
import { RouterModule } from '@angular/router';
import { ExternalRecipesService } from './external-recipes.service';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { IngredientsReducer } from '../redux/ingredient.reducers';

@NgModule({
  declarations: [ExternalRecipesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ExternalRecipesComponent }]),
    EffectsModule.forFeature([]),
    StoreModule.forFeature('ingredients', IngredientsReducer),
  ],
  providers: [ExternalRecipesService],
})
export class ExternalRecipesModule {}
