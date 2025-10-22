import { create } from 'zustand';

export type Task = {
  title: string;
  description: string;
  subtasks: string[];
  status: string;
};

export type BoardStore = {
  activeBoard: string | null;

  boards: { names: string[]; columns: string[] };
  currentSheet: { [key: string]: { name: string; columns: string[]; tasks: Task[] } };
  completedTasks: { [key: string]: number };
  setCompletedTasks: (board: string, count: number) => void;
  setBoards: (board: string, columns: string[]) => void;
  setActiveBoard: (board: string) => void;
  setCurrentSheet: (board: string, columns: string[], tasks: Task[]) => void;
  deleteTask?: (board: string, taskTitle: string) => void;
  deleteBoard?: (board: string) => void;
  updateBoard?: (payload: { oldName: string; newName: string; columns: string[] }) => void;
};

export const useBoardStore = create<BoardStore>((set, get) => ({
  activeBoard: localStorage.getItem('activeboard'),

  boards: {
    names: localStorage.getItem('boards')
      ? JSON.parse(localStorage.getItem('boards') || '{"names":[],"columns":[]}').names
      : [],
    columns: localStorage.getItem('columns')
      ? JSON.parse(localStorage.getItem('columns') || '{"names":[],"columns":[]}').columns
      : [],
  },
  completedTasks: localStorage.getItem('completedtasks')
    ? JSON.parse(localStorage.getItem('completedtasks') || '{}')
    : {},
  currentSheet: localStorage.getItem('currentsheet') ? JSON.parse(localStorage.getItem('currentsheet') || '{}') : {},

  tasks: localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks') || '{}') : {},

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

  setBoards: (boardName: string, columns: string[]) => {
    const updatedNames = [...get().boards.names, boardName];
    const updatedColumns = [...get().boards.columns, ...columns];

    localStorage.setItem('boards', JSON.stringify({ names: updatedNames, columns: updatedColumns }));
    localStorage.setItem('columns', JSON.stringify({ columns: updatedColumns }));

    set({ boards: { names: updatedNames, columns: updatedColumns } });
  },

  setCurrentSheet: (boardName: string, columns: string[], tasks: Task[]) => {
    const newSheet = {
      ...get().currentSheet,
      [boardName]: { name: boardName, columns: columns, tasks: tasks },
    };
    localStorage.setItem('currentsheet', JSON.stringify(newSheet));
    set({ currentSheet: newSheet });
  },

  deleteTask: (boardName: string, taskTitle: string) => {
    const boardObj = get().currentSheet?.[boardName];
    if (!boardObj) return;
    const updatedTasks = boardObj.tasks.filter((t) => t.title !== taskTitle);
    get().setCurrentSheet(boardName, boardObj.columns, updatedTasks);
  },

  deleteBoard: (boardName: string) => {
    const { [boardName]: _, ...restSheets } = get().currentSheet;
    const updatedBoardNames = get().boards.names.filter((name) => name !== boardName);

    // recompute columns from remaining sheets to keep consistency
    const recomputedColumns = Object.values(restSheets).flatMap((s) => s.columns);

    localStorage.setItem('currentsheet', JSON.stringify(restSheets));
    localStorage.setItem('boards', JSON.stringify({ names: updatedBoardNames, columns: recomputedColumns }));
    localStorage.setItem('columns', JSON.stringify({ columns: recomputedColumns }));

    set({ currentSheet: restSheets, boards: { names: updatedBoardNames, columns: recomputedColumns } });
  },

  // IMPROVED updateBoard: preimenuje sheet, postavlja kolone i sinhronizuje boards.names + boards.columns
 updateBoard: (payload: { oldName: string; newName: string; columns: string[] }) => {
  const { oldName, newName, columns } = payload;
  const boardObj = get().currentSheet?.[oldName];
  if (!boardObj) return;

  // copy existing sheets and remove old
  const updatedSheets = { ...get().currentSheet };
  delete updatedSheets[oldName];

  // create new sheet with updated name and columns (keep tasks)
  updatedSheets[newName] = {
    ...boardObj,
    name: newName,
    columns: columns,
  };

  // recompute boards.names (replace oldName with newName)
  const existingNames = get().boards.names || [];
  const updatedNames = existingNames.map((n) => (n === oldName ? newName : n));
  if (!updatedNames.includes(newName)) {
    updatedNames.push(newName);
  }

  // recompute all columns from all sheets to keep consistency
  const recomputedColumns = Object.values(updatedSheets).flatMap((s) => s.columns);

  // persist to localStorage
  localStorage.setItem('currentsheet', JSON.stringify(updatedSheets));
  localStorage.setItem('boards', JSON.stringify({ names: updatedNames, columns: recomputedColumns }));
  localStorage.setItem('columns', JSON.stringify({ columns: recomputedColumns }));

  // update state
  set({ currentSheet: updatedSheets, boards: { names: updatedNames, columns: recomputedColumns } });

  // If activeBoard was the oldName, update activeBoard as well
  if (get().activeBoard === oldName) {
    set({ activeBoard: newName });
    localStorage.setItem('activeboard', newName);
  }
},

}));
