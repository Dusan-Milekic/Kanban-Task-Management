import { act, useEffect, useState } from 'react';
import { useBoardStore } from '../zustand/boardStore';
import PopupTask from './ui/popuptask';

export default function Header() {
    const activeBoard = useBoardStore((state) => state.activeBoard);
    const [popupVisible, setPopupVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const deleteBoard = useBoardStore((state) => state.deleteBoard);
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
        // zatvori options i otvori confirm modal
        const boardOptions = document.getElementById('board-options');
        boardOptions?.classList.add('hidden');
        setDeleteVisible(true);
    };

    const closeDeleteBoard = () => setDeleteVisible(false);

    // zatvori modale na Esc
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (popupVisible) setPopupVisible(false);
                if (deleteVisible) setDeleteVisible(false);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [popupVisible, deleteVisible]);

    // handler za overlay click (samo ako je kliknuto na overlay)
    const handleCloseDeleteBoard = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) closeDeleteBoard();
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
                    <div className="flex items-center gap-2 ml-4 cursor-pointer" onClick={showNav}>
                        <h1 className="text-black dark:text-white font-bold">
                            {activeBoard || 'No selected'}
                        </h1>
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

                    <div onClick={BoardOptions} className="cursor-pointer px-3">
                        <img src="assets/icon-vertical-ellipsis.svg" alt="icon-vertical-ellipsis" />
                    </div>

                    <div id="board-options" className="hidden absolute top-16 right-0">
                        <div className="bg-white dark:bg-dark-grey shadow-lg rounded-lg p-4">
                            <ul>
                                <li className="py-2 text-very-dark-grey cursor-pointer text-[12px]">Edit Board</li>
                                <li
                                    className="py-2 text-red cursor-pointer text-[12px]"
                                    onClick={openDeleteBoard}
                                >
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
                        onClick={closeDeleteBoard}
                        className="fixed inset-0 bg-black/40 z-50 transition-opacity duration-200"
                    />

                    {/* centered dialog */}
                    <div
                        onClick={handleCloseDeleteBoard}
                        className="fixed inset-0 z-60 flex items-center justify-center"
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
                                Are you sure you want to delete the <span className="font-semibold">{activeBoard}</span> board?
                                This action will remove all columns and tasks and cannot be reversed.
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

                                <button
                                    className="bg-main-purple text-white rounded-3xl px-8 py-2 cursor-pointer"
                                    onClick={closeDeleteBoard}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
