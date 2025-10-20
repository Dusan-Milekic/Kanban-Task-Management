import { create } from 'zustand';

type BoardStore = {
  activeBoard: string | null;
  fullboardData: { [key: string]: string[] };
  setActiveBoard: (board: string) => void;
  setFullBoardData: (data: { [key: string]: string[] }) => void;
};

export const useBoardStore = create<BoardStore>((set) => ({
  activeBoard: localStorage.getItem('activeboard'),
  fullboardData: localStorage.getItem('fullboarddata')
    ? JSON.parse(localStorage.getItem('fullboarddata') || '{}')
    : {},

  setActiveBoard: (board: string) => {
    set({ activeBoard: board });
    localStorage.setItem('activeboard', board);
  },

  setFullBoardData: (data: { [key: string]: string[] }) => {
    set({ fullboardData: data });
    localStorage.setItem('fullboarddata', JSON.stringify(data));
  },
}));