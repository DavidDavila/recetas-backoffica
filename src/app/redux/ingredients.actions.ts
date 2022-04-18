import { createAction, props } from '@ngrx/store';

const actionSetIngredients = createAction(
  '[Ingredients] SET ALL',
  props<any>()
);

const actionaddIngredient = createAction(
  '[Ingredients] add PROVINCE',
  props<any>()
);

export const IngredientsActions = {
  setIngredients: actionSetIngredients,
  addIngredient: actionaddIngredient,
};
