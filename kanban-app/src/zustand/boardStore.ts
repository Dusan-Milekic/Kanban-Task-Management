import { create } from 'zustand';

export type Task = {
  title: string;
  description: string;
  subtasks: string[];
  status: string;
};

type BoardStore = {
  activeBoard: string | null;

  boards: { names: string[] ,columns: string[]};
 
  setBoards: (board: string, columns: string[]) => void;
  setActiveBoard: (board: string) => void;

};

export const useBoardStore = create<BoardStore>((set, get) => ({
  activeBoard: localStorage.getItem('activeboard'),

  boards: {names: localStorage.getItem('boards')
    ? JSON.parse(localStorage.getItem('boards') || '{"names":[],"columns":[]}') .names
    : [],
    columns: localStorage.getItem('columns')
    ? JSON.parse(localStorage.getItem('columns') || '{"names":[],"columns":[]}') .columns
    : []},

  setActiveBoard: (board: string) => {
    set({ activeBoard: board });
    localStorage.setItem('activeboard', board);
  },



  setBoards: (boardName:string,columns: string[]) => {
    localStorage.setItem('boards', JSON.stringify({
      names: [...get().boards.names, boardName]
    }));
    localStorage.setItem('columns', JSON.stringify({
      columns: [...get().boards.columns, ...columns]
    }));

    set({ boards: { names: [...get().boards.names, boardName] , columns: [...get().boards.columns, ...columns] } });
  },
  
}));
