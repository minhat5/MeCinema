// Room Constants
export const ROOM_API = {
  BASE_URL: '/api/rooms',
  CREATE: '/api/rooms',
  GET_LIST: '/api/rooms',
  GET_BY_ID: '/api/rooms/:id',
  UPDATE: '/api/rooms/:id',
  DELETE: '/api/rooms/:id',
};

export const ROOM_QUERY_KEYS = {
  ALL: ['rooms'] as const,
  BY_CINEMA: (cinemaId: number | string) => [...ROOM_QUERY_KEYS.ALL, 'cinema', cinemaId] as const,
  BY_ID: (id: number | string) => [...ROOM_QUERY_KEYS.ALL, id] as const,
};

export const DEFAULT_ROOM_LIMITS = {
  MIN_ROWS: 1,
  MAX_ROWS: 26,
  MIN_COLS: 1,
  MAX_COLS: 40,
};

