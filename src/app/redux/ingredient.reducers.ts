import { createReducer, on } from '@ngrx/store';
import { ingredients } from './ingredients';
import { IngredientsActions } from './ingredients.actions';

export const initialState: string[] = ingredients;

export const IngredientsReducer = createReducer<any>(
  initialState,
  on(
    IngredientsActions.setIngredients,
    (state: string[], payload: string[]) => payload
  ),
  on(IngredientsActions.addIngredient, (state: string[], payload: string) => [
    ...state,
    payload,
  ])
);
