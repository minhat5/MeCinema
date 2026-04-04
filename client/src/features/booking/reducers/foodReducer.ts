import type { SelectedFood } from '../components/FoodSelection';

export interface FoodState {
  selectedFoods: Map<number, SelectedFood>;
}

export const initialFoodState: FoodState = {
  selectedFoods: new Map(),
};

export type FoodAction =
  | {
      type: 'ADD_FOOD';
      payload: SelectedFood;
    }
  | {
      type: 'REMOVE_FOOD';
      payload: { foodId: number; quantity: number };
    }
  | {
      type: 'CLEAR_FOODS';
    };

export function foodReducer(state: FoodState, action: FoodAction): FoodState {
  switch (action.type) {
    case 'ADD_FOOD': {
      const newFoods = new Map(state.selectedFoods);
      newFoods.set(action.payload.foodId, action.payload);
      return { selectedFoods: newFoods };
    }

    case 'REMOVE_FOOD': {
      const newFoods = new Map(state.selectedFoods);
      const current = newFoods.get(action.payload.foodId);

      if (current) {
        const newQuantity = current.quantity - action.payload.quantity;
        if (newQuantity > 0) {
          newFoods.set(action.payload.foodId, {
            ...current,
            quantity: newQuantity,
          });
        } else {
          newFoods.delete(action.payload.foodId);
        }
      }

      return { selectedFoods: newFoods };
    }

    case 'CLEAR_FOODS': {
      return { selectedFoods: new Map() };
    }

    default:
      return state;
  }
}

