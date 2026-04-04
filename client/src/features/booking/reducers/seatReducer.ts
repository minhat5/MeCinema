import type { SeatSelection } from '@shared/index';

type SeatState = {
  selectedSeats: Map<string, SeatSelection>;
  totalPrice: number;
  maxSeats: number;
};

type SeatAction =
  | { type: 'SELECT_SEAT'; payload: SeatSelection }
  | { type: 'DESELECT_SEAT'; payload: string }
  | { type: 'RESET' }
  | { type: 'SET_MAX_SEATS'; payload: number }
  | { type: 'REMOVE_INVALID_SEATS'; payload: string[] }; // payload: list of seatIds now booked by others

export const initialSeatState: SeatState = {
  selectedSeats: new Map(),
  totalPrice: 0,
  maxSeats: 8,
};

export const seatReducer = (
  state: SeatState,
  action: SeatAction,
): SeatState => {
  switch (action.type) {
    case 'SELECT_SEAT': {
      const seat = action.payload;
      if (state.selectedSeats.size >= state.maxSeats) return state;

      const next = new Map(state.selectedSeats);
      next.set(seat.seatId, seat);

      return {
        ...state,
        selectedSeats: next,
        totalPrice: state.totalPrice + seat.price,
      };
    }
    case 'DESELECT_SEAT': {
      const seatId = action.payload;
      const seat = state.selectedSeats.get(seatId);

      if (!seat) return state;
      const next = new Map(state.selectedSeats);
      next.delete(seatId);

      return {
        ...state,
        selectedSeats: next,
        totalPrice: state.totalPrice - seat.price,
      };
    }

    case 'RESET':
      return { ...state, selectedSeats: new Map(), totalPrice: 0 };

    case 'SET_MAX_SEATS':
      return { ...state, maxSeats: action.payload };

    case 'REMOVE_INVALID_SEATS': {
      const invalidSet = new Set(action.payload);
      const next = new Map(state.selectedSeats);
      let removedPrice = 0;
      for (const seatId of invalidSet) {
        const seat = next.get(seatId);
        if (seat) {
          removedPrice += seat.price;
          next.delete(seatId);
        }
      }
      if (removedPrice === 0) return state; // nothing changed
      return {
        ...state,
        selectedSeats: next,
        totalPrice: Math.max(0, state.totalPrice - removedPrice),
      };
    }

    default:
      return state;
  }
};
