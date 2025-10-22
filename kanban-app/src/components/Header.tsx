import React, { useEffect, useState } from 'react';
import { useBoardStore } from '../zustand/boardStore';
import PopupTask from './ui/popuptask';

export default function Header() {
    const activeBoard = useBoardStore((state) => state.activeBoard);
    const deleteBoard = useBoardStore((state) => state.deleteBoard);
    const currentSheet = useBoardStore((state) => state.currentSheet);
    const updateBoard = useBoardStore((state) => state.updateBoard);

    const [popupVisible, setPopupVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);

    // lokalni state za formu edit modala
    const [editName, setEditName] = useState<string>('');
    const [columns, setColumns] = useState<string[]>([]);

    // inicijalizuj formu kada se otvori edit modal ili kad se promeni activeBoard/currentSheet
    useEffect(() => {
        if (editVisible) {
            const sheet = currentSheet?.[activeBoard || ''];
            setEditName(activeBoard || '');
            setColumns(Array.isArray(sheet?.columns) ? [...sheet.columns] : []);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editVisible, activeBoard, currentSheet]);

    const showNav = () => {
        const nav = document.getElementById('navbar');
        nav?.classList.remove('hidden');
        nav?.classList.add('animate-fade-right');
    };

    const showPopupTask = () => setPopupVisible(true);
    const closePopup = () => setPopupVisible(false);

    const BoardOptions = () => {
        const boardOptions = document.getElementById('board-options');
        boardOptions?.classList.toggle('hidden');
        boardOptions?.classList.add('animate-fade-down');
    };

    const openDeleteBoard = () => {
        const boardOptions = document.getElementById('board-options');
        boardOptions?.classList.add('hidden');
        setDeleteVisible(true);
    };

    const openEditBoard = () => {
        const boardOptions = document.getElementById('board-options');
        boardOptions?.classList.add('hidden');
        setEditVisible(true);
    };

    const closeDeleteBoard = () => setDeleteVisible(false);
    const closeEditBoard = () => setEditVisible(false);

    // zatvori modale na Esc (zatvara sve modalne flagove)
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (popupVisible) setPopupVisible(false);
                if (deleteVisible) setDeleteVisible(false);
                if (editVisible) setEditVisible(false);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [popupVisible, deleteVisible, editVisible]);

    // handler za overlay click (samo ako je kliknuto na overlay)
    const handleCloseDeleteBoard = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) closeDeleteBoard();
    };

    const handleCloseEditBoard = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) closeEditBoard();
    };

    // --- funkcije za edit formu ---
    const handleColumnChange = (index: number, value: string) => {
        setColumns((prev) => {
            const next = [...prev];
            next[index] = value;
            return next;
        });
    };

    const handleAddColumn = () => {
        setColumns((prev) => [...prev, '']);
    };

    const handleDeleteColumn = (index: number) => {
        setColumns((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSaveChanges = (e?: React.FormEvent) => {
        e?.preventDefault?.();

        // ne pokušavamo da update-ujemo ako nema activeBoard
        if (!activeBoard) {
            setEditVisible(false);
            return;
        }

        const trimmedName = editName.trim() || activeBoard; // fallback na originalno ime
        const trimmedColumns = columns.map((c) => c.trim()).filter((c) => c.length > 0);

        const payload = {
            oldName: activeBoard,
            newName: trimmedName,
            columns: trimmedColumns,
        };

        if (typeof updateBoard === 'function') {
            updateBoard(payload);
        } else {
            // fallback: ako nema update funkcije, samo loguj (možeš promeniti prema potrebi)
            console.log('updateBoard not found in store. Payload:', payload);
        }

        setEditVisible(false);
    };

    return (
        <>
            {/* Blur pozadina za add-task popup */}
            {popupVisible && (
                <div
                    onClick={closePopup}
                    className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
                />
            )}

            {/* Popup Task */}
            {popupVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div
                        onClick={(e) => e.stopPropagation()} // klik unutar popup-a NE zatvara
                        className="pointer-events-auto bg-white dark:bg-dark-grey rounded-lg shadow-lg animate-fade-in scale-up"
                    >
                        <PopupTask />
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="p-4 bg-white dark:bg-dark-grey shadow-md flex items-center justify-between relative z-10">
                <div className="flex items-center">
                    <div>
                        <img src="assets/logo-mobile.svg" alt="mobile" />
                    </div>
                    <div
                        className="flex items-center gap-2 ml-4 cursor-pointer"
                        onClick={showNav}
                        role="button"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        <h1 className="text-black dark:text-white font-bold">{activeBoard || 'No selected'}</h1>
                        <img src="assets/icon-chevron-down.svg" alt="chevron" />
                    </div>
                </div>

                <div className="flex items-center gap-4 relative">
                    <div
                        onClick={activeBoard ? showPopupTask : undefined}
                        className={`bg-main-purple flex justify-center gap-2 cursor-pointer items-center rounded-3xl transition-opacity duration-200
              ${activeBoard ? 'opacity-100 px-4 py-3' : 'opacity-50'}`}
                    >
                        <img src="assets/icon-add-task-mobile.svg" alt="icon-add" className="w-3 h-3" />
                        <p className="text-[15px] mb-0.5">Add new task</p>
                    </div>

                    <div onClick={BoardOptions} className="cursor-pointer px-3" role="button" aria-label="Board options">
                        <img src="assets/icon-vertical-ellipsis.svg" alt="icon-vertical-ellipsis" />
                    </div>

                    <div id="board-options" className="hidden absolute top-16 right-0">
                        <div className="bg-white dark:bg-dark-grey shadow-lg rounded-lg p-4">
                            <ul>
                                <li className="py-2 text-very-dark-grey cursor-pointer text-[12px]" onClick={openEditBoard}>
                                    Edit Board
                                </li>
                                <li className="py-2 text-red cursor-pointer text-[12px]" onClick={openDeleteBoard}>
                                    Delete Board
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>

            {/* Delete confirmation modal (conditionally rendered) */}
            {deleteVisible && (
                <>
                    {/* overlay */}
                    <div
                        onClick={handleCloseDeleteBoard}
                        className="fixed inset-0 bg-black/40 z-50 transition-opacity duration-200"
                    />

                    {/* centered dialog */}
                    <div
                        onClick={handleCloseDeleteBoard}
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-board-title"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-dark-grey rounded-lg p-6 shadow-lg w-[90%] max-w-xs text-center"
                        >
                            <h2 id="delete-board-title" className="text-xl font-bold mb-4 text-red">
                                Delete this board?
                            </h2>
                            <p className="text-very-dark-grey mb-6">
                                Are you sure you want to delete the <span className="font-semibold">{activeBoard}</span> board? This action will remove all
                                columns and tasks and cannot be reversed.
                            </p>

                            <div className="flex justify-center gap-3">
                                <button
                                    className="bg-red text-white rounded-3xl px-8 py-2 cursor-pointer"
                                    onClick={() => {
                                        if (activeBoard && deleteBoard) {
                                            deleteBoard(activeBoard);
                                        }
                                        setDeleteVisible(false);
                                    }}
                                >
                                    Delete
                                </button>

                                <button className="bg-main-purple text-white rounded-3xl px-8 py-2 cursor-pointer" onClick={closeDeleteBoard}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Edit board modal (independent from deleteVisible) */}
            {editVisible && (
                <>
                    {/* overlay */}
                    <div onClick={handleCloseEditBoard} className="fixed inset-0 bg-black/40 z-50 transition-opacity duration-200" />

                    {/* centered dialog */}
                    <div
                        onClick={handleCloseEditBoard}
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-board-title"
                    >
                        <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-dark-grey rounded-lg p-6 shadow-lg w-[90%] max-w-xs text-center">
                            <h2 id="edit-board-title" className="text-xl font-bold mb-4 text-very-dark-grey">
                                Edit Board
                            </h2>

                            <form onSubmit={handleSaveChanges} className="mt-2 text-[13px]">
                                <label className="text-very-dark-grey text-left block mb-1">Board name</label>
                                <input
                                    type="text"
                                    name="nameboard"
                                    id="nameboard"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    placeholder={activeBoard || 'No selected'}
                                    className="w-full px-3 py-2 rounded-md border border-gray-200 mb-3 text-very-dark-grey"
                                />

                                <label className="text-very-dark-grey text-left block mb-1">Board columns</label>

                                <div className="max-h-40 overflow-auto">
                                    {columns.length === 0 && <p className="text-xs text-very-dark-grey">No columns</p>}

                                    {columns.map((col, index) => (
                                        <div key={index} className="mt-2 flex items-center gap-2">
                                            <input
                                                type="text"
                                                name={`column-${index}`}
                                                id={`column-${index}`}
                                                value={col}
                                                onChange={(e) => handleColumnChange(index, e.target.value)}
                                                placeholder={`Column ${index + 1}`}
                                                className="flex-1 px-3 py-2 rounded-md border border-gray-200 text-very-dark-grey"
                                            />
                                            <button
                                                type="button"
                                                aria-label={`Delete column ${index + 1}`}
                                                onClick={() => handleDeleteColumn(index)}
                                                className="p-2"
                                            >
                                                <img src="/assets/icon-cross.svg" alt="Delete column" className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button type="button" onClick={handleAddColumn} className="mt-4 border border-main-purple rounded-3xl px-4 py-2 w-full text-white bg-main-purple-hover">
                                    + Add new column
                                </button>

                                <button type="submit" className="mt-3 bg-main-purple text-white rounded-3xl px-6 py-2 w-full">
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
