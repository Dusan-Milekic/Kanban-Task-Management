import { useState } from 'react';
import { useBoardStore } from '../zustand/boardStore';
import PopupTask from './ui/popuptask';

export default function Header() {
    const activeBoard = useBoardStore((state) => state.activeBoard);
    const [popupVisible, setPopupVisible] = useState(false);

    const showNav = () => {
        const nav = document.getElementById('navbar');
        nav?.classList.remove('hidden');
        nav?.classList.add('animate-fade-right');
    };

    const showPopupTask = () => setPopupVisible(true);
    const closePopup = () => setPopupVisible(false);

    return (
        <>
            {/* Blur pozadina */}
            {popupVisible && (
                <div
                    onClick={closePopup}
                    className="fixed inset-0 bg-black/40 brightness-50 z-40 transition-opacity duration-300"
                ></div>
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
                        <h1 className="text-black dark:text-white font-bold">{activeBoard || 'No selected'}</h1>
                        <img src="assets/icon-chevron-down.svg" alt="chevron" />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div
                        onClick={activeBoard ? showPopupTask : undefined}
                        className={`bg-main-purple flex justify-center gap-2 cursor-pointer items-center rounded-3xl transition-opacity duration-200
                        ${activeBoard ? 'opacity-100 px-4 py-3' : 'opacity-50'}`}
                    >
                        <img src="assets/icon-add-task-mobile.svg" alt="icon-add" className="w-3 h-3" />
                        <p className="text-[15px] mb-0.5">Add new task</p>
                    </div>
                    <div>
                        <img src="assets/icon-vertical-ellipsis.svg" alt="icon-vertical-ellipsis" />
                    </div>
                </div>
            </header>
        </>
    );
}
