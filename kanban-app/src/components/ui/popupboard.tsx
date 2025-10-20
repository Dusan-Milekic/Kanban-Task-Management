
import { useState } from 'react';

export default function PopupBoard({ dark, board, setBoards }: { dark: boolean, board: string[], setBoards: React.Dispatch<React.SetStateAction<string[]>> }) {
    const [columns, setColumns] = useState<string[]>(['']);
    const [boardName, setBoardName] = useState('');

    function AddColumn() {
        setColumns([...columns, '']);
    }

    function RemoveColumn(index: number) {
        setColumns(columns.filter((_, i) => i !== index));
    }

    function UpdateColumn(index: number, value: string) {
        const newColumns = [...columns];
        newColumns[index] = value;
        setColumns(newColumns);
    }

    function HandleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (boardName.trim() && columns.some(col => col.trim())) {
            setBoards([...board, boardName]);
            setBoardName('');
            setColumns(['']);
        }
    }

    function CreateBoard() {
        if (boardName.length > 0) setBoards([...board, boardName]);

    }

    return (
        <div className={`${dark ? 'bg-dark-grey text-white' : 'bg-white text-black'} w-[300px] h-auto rounded-lg shadow-lg p-6`}>
            <h2>Add New Board</h2>
            <form onSubmit={HandleSubmit}>
                <label className="block mb-2">Board Name</label>
                <input
                    type="text"
                    placeholder="e.g Web Design"
                    className="text-[13px] w-full p-2 mb-4 border border-medium-grey rounded outline-0"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                />
                <label className="block mb-2">Board Columns</label>
                <div>
                    {columns.map((column, index) => (
                        <div key={index} className="flex items-center gap-3 mb-2">
                            <input
                                type="text"
                                placeholder="e.g Todo"
                                className="text-[13px] w-full p-2 border border-medium-grey rounded outline-0"
                                value={column}
                                onChange={(e) => UpdateColumn(index, e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => RemoveColumn(index)}
                                className="pb-3"
                            >
                                <img src="assets/icon-cross.svg" alt="cross" />
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    className="w-full p-2 mb-4 bg-light-purple text-main-purple rounded"
                    onClick={AddColumn}
                >
                    + Add New Column
                </button>
                <button type="submit" className="w-full p-2 bg-main-purple text-white rounded cursor-pointer" onClick={CreateBoard}>
                    Create Board
                </button>
            </form>
        </div>
    )
}