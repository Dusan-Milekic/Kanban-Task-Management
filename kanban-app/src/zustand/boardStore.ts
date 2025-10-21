import { create } from 'zustand';

export type Task = {
  title: string;
  description: string;
  subtasks: string[];
  status: string;
};

export type BoardStore = {
  activeBoard: string | null;

  boards: { names: string[] ,columns: string[]};
  currentSheet: { [key: string]: { name: string, columns: string[], tasks: Task[] } };
  completedTasks: { [key: string]: number };
  setCompletedTasks: (board: string, count: number) => void;
  setBoards: (board: string, columns: string[]) => void;
  setActiveBoard: (board: string) => void;
  setCurrentSheet: (board: string, columns: string[], tasks: Task[]) => void;
  deleteTask?: (board: string, taskTitle: string) => void;
};

export const useBoardStore = create<BoardStore>((set, get) => ({
  activeBoard: localStorage.getItem('activeboard'),

  boards: {names: localStorage.getItem('boards')
    ? JSON.parse(localStorage.getItem('boards') || '{"names":[],"columns":[]}') .names
    : [],
    columns: localStorage.getItem('columns')
    ? JSON.parse(localStorage.getItem('columns') || '{"names":[],"columns":[]}') .columns
    : []},
    completedTasks: localStorage.getItem('completedtasks')
    ? JSON.parse(localStorage.getItem('completedtasks') || '0')
    : {},
    currentSheet: localStorage.getItem('currentsheet')
    ? JSON.parse(localStorage.getItem('currentsheet') || '{}')
    : {},

    tasks: localStorage.getItem('tasks')
    ? JSON.parse(localStorage.getItem('tasks') || '{}')
    : {},

  setActiveBoard: (board: string) => {
    set({ activeBoard: board });
    localStorage.setItem('activeboard', board);
  },
  setCompletedTasks: (board: string, count: number) => {
    set((state) => ({
      completedTasks: {
        ...state.completedTasks,
        [board]: count,
      },
    }));
    localStorage.setItem('completedtasks', JSON.stringify(get().completedTasks));
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
  setCurrentSheet: (boardName:string, columns:string[],tasks:Task[]) => {
    localStorage.setItem('currentsheet', JSON.stringify({
        ...get().currentSheet,
        [boardName]: { name: boardName, columns: columns, tasks: tasks },
      }))
    set({
      currentSheet: {
        ...get().currentSheet,
        [boardName]: { name: boardName, columns: columns , tasks: tasks},
      
      },
      
    });
  },
  deleteTask: (boardName:string, taskTitle:string) => {
    const boardObj = get().currentSheet?.[boardName];
    if (!boardObj) return;
    const updatedTasks = boardObj.tasks.filter((t) => t.title !== taskTitle);
    get().setCurrentSheet(boardName, boardObj.columns, updatedTasks);
  }

  
}));
