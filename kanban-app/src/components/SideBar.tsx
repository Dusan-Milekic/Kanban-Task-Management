import { useRef, useState } from 'react';
import PopupBoard from './ui/popupboard';
import { useBoardStore } from '../zustand/boardStore';

export default function SideBar() {
    const [toggleTheme, setToggleTheme] = useState(false);
    const { activeBoard, setActiveBoard, boards } = useBoardStore();
    const nav = useRef<HTMLElement>(null);
    const popup = useRef<HTMLDivElement>(null);
    const blur_effect = useRef<HTMLDivElement>(null);



    const setTitle = (boardTitle: string) => {
        setActiveBoard(boardTitle);
    }
    const updateTheme = () => {
        const isDark = !toggleTheme;
        setToggleTheme(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const showPopUp = () => {
        popup.current?.classList.remove('hidden');
        blur_effect.current?.classList.remove('hidden');
    };

    const closePopUp = () => {
        popup.current?.classList.add('hidden');
        blur_effect.current?.classList.add('hidden');
    };


    const hideSideBar = () => {
        nav.current?.classList.remove('animate-fade-right');
        nav.current?.classList.add('hidden');


    };

    return (
        <>
            <div
                ref={blur_effect}
                onClick={closePopUp}
                className="w-dvw h-dvh absolute bg-dark-grey opacity-50 brightness-30 z-40 hidden"
            >
                {/* Blur effect on screen */}
            </div>

            <div ref={popup} className="absolute top-1/2 -translate-y-1/2 left-1/2 transform -translate-x-1/2 z-50 m-4 hidden">
                <PopupBoard dark={toggleTheme} />
            </div>

            <nav id="navbar" ref={nav} className="bg-white dark:bg-dark-grey w-[261px] transi h-[100vh] py-4 shadow-md flex flex-col gap-8 justify-between  lg:w-[300px]">
                <div>
                    <div className="flex items-center gap-2 ml-4 py-1">
                        <img
                            src={toggleTheme ? 'assets/logo-light.svg' : 'assets/logo-dark.svg'}
                            alt="logo"
                        />
                    </div>

                    <div className="space-y-5 pt-10">
                        <h3 className="text-medium-grey font-semibold text-[12px] px-5">
                            ALL BOARDS ({boards.names.length})
                        </h3>

                        <div>
                            {boards.names.map((boardName, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-3 cursor-pointer py-2 px-3 rounded-r-lg ${activeBoard === boardName ? 'bg-main-purple' : ''
                                        }`}
                                    onClick={() => setTitle(boardName)}
                                >
                                    <img src="assets/icon-board.svg" alt="board" />
                                    <p className={`text-[15px] font-bold ${activeBoard === boardName ? 'text-white' : 'text-black dark:text-white'
                                        }`}
                                    >
                                        {boardName}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 cursor-pointer py-2 px-3 rounded-r-lg">
                            <img src="assets/boardpurple.svg" alt="board" />
                            <p className="text-main-purple text-[15px] font-bold" onClick={showPopUp}>
                                + Create New Board
                            </p>
                        </div>
                    </div>
                </div>

                <footer>
                    <div
                        className={`flex justify-center items-center gap-4 ${toggleTheme ? 'bg-very-dark-grey' : 'bg-light-grey'
                            } w-[235px] h-[48px] mx-auto rounded-[6px]`}
                    >
                        <img src="assets/icon-light-theme.svg" alt="light" />
                        <div onClick={updateTheme} className="cursor-pointer">
                            <div className="w-[40px] h-[20px] bg-main-purple rounded-full flex items-center p-1">
                                <div
                                    className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${toggleTheme ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                />
                            </div>
                        </div>
                        <img src="assets/icon-dark-theme.svg" alt="dark" />
                    </div>

                    <div className="mt-5 flex text-medium-grey px-5 items-center gap-4 cursor-pointer text-[15px] font-bold" onClick={hideSideBar}>
                        <img src="assets/icon-hide-sidebar.svg" alt="hide" />
                        <p>Hide Sidebar</p>
                    </div>
                </footer>
            </nav>
        </>
    );
}