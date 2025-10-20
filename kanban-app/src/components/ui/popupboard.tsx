import { useState } from 'react';

type BoardData = { [key: string]: string[] };

interface PopupBoardProps {
    dark: boolean;
    board: BoardData;
    setBoards: React.Dispatch<React.SetStateAction<BoardData>>;
}

export default function PopupBoard({ dark, board, setBoards }: PopupBoardProps) {
    const [columns, setColumns] = useState<string[]>(['']);
    const [boardName, setBoardName] = useState('');

    const addColumn = () => setColumns([...columns, '']);

    const removeColumn = (index: number) => {
        setColumns(columns.filter((_, i) => i !== index));
    };

    const updateColumn = (index: number, value: string) => {
        const newColumns = [...columns];
        newColumns[index] = value;
        setColumns(newColumns);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!boardName.trim() || columns.every(col => !col.trim())) return;

        const updatedBoard = { ...board, [boardName]: columns };
        setBoards(updatedBoard);
        localStorage.setItem('fullboarddata', JSON.stringify(updatedBoard));

        setBoardName('');
        setColumns(['']);
    };

    const inputClass = 'text-[13px] w-full p-2 border border-medium-grey rounded outline-0';
    const isDark = dark ? 'bg-dark-grey text-white' : 'bg-white text-black';

    return (
        <div className={`${isDark} w-[300px] h-auto rounded-lg shadow-lg p-6`}>
            <h2 className="font-bold mb-4">Add New Board</h2>

            <form onSubmit={handleSubmit}>
                <label className="block mb-2 text-sm font-semibold">Board Name</label>
                <input
                    type="text"
                    placeholder="e.g Web Design"
                    className={inputClass}
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                />

                <label className="block mb-2 mt-4 text-sm font-semibold">Board Columns</label>
                <div className="space-y-2">
                    {columns.map((column, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <input
                                type="text"
                                placeholder="e.g Todo"
                                className={inputClass}
                                value={column}
                                onChange={(e) => updateColumn(index, e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => removeColumn(index)}
                                className="flex-shrink-0 cursor-pointer hover:opacity-70"
                            >
                                <img src="assets/icon-cross.svg" alt="remove column" />
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    className="w-full p-2 mt-4 bg-light-purple text-main-purple rounded cursor-pointer hover:opacity-80 font-semibold"
                    onClick={addColumn}
                >
                    + Add New Column
                </button>

                <button
                    type="submit"
                    className="w-full p-2 mt-3 bg-main-purple text-white rounded cursor-pointer hover:opacity-90 font-semibold"
                >
                    Create Board
                </button>
            </form>
        </div>
    );
}