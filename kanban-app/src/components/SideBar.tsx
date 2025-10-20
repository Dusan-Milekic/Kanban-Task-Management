import { useRef, useState } from "react"
import PopupBoard from "./ui/popupboard";
export default function SideBar() {
    const [toggleTheme, setToggleTheme] = useState(false);
    const [boards, setBoards] = useState(["Platform Launch", "Marketing Plan", "Roadmap"])
    const [activeBoard, setActiveBoard] = useState("Platform Launch");
    const popup = useRef<HTMLDivElement>(null);
    const blur_effect = useRef<HTMLDivElement>(null);
    function checkTheme() {
        if (!toggleTheme)
            document.documentElement.classList.remove('dark');
        else
            document.documentElement.classList.add('dark');
    }
    function ChangeTheme() {
        setToggleTheme(!toggleTheme);
        checkTheme();
    }
    function ShowPopUp() {
        popup.current?.classList.remove("hidden");
        blur_effect.current?.classList.remove("hidden");
    }
    function ClosePopUp() {
        popup.current?.classList.add("hidden");
        blur_effect.current?.classList.add("hidden");
    }
    checkTheme();
    return (
        <>
            <div ref={blur_effect} onClick={ClosePopUp} className="w-dvw h-dvh absolute bg-dark-grey  opacity-50 brightness-30  z-40 hidden">
                {/*Blur effect on screen*/}
            </div>
            <div ref={popup} className="absolute top-1/2 -translate-y-1/2 left-1/2 transform -translate-x-1/2 z-50 m-4 hidden">
                <PopupBoard dark={toggleTheme} board={boards} setBoards={setBoards} />
            </div>
            <nav className="bg-white dark:bg-dark-grey w-[261px] h-[100vh] py-4 shadow-md flex flex-col gap-8 justify-between lg:w-[300px]">

                <div className="">
                    <div className="flex items-center gap-2 ml-4 py-1">
                        <img src={toggleTheme ? "assets/logo-light.svg" : "assets/logo-dark.svg"} alt="mobile" />
                    </div>
                    <div className="space-y-5 pt-10">
                        <h3 className="text-medium-grey font-semibold text-[12px] px-5">ALL BOARDS ({boards.length})</h3>
                        <div>
                            {boards.map((board, index) => (
                                <div key={index} className={` relative flex items-center gap-3 mb-3 cursor-pointer hover:bg-main-purple-hover hover:text-white py-2 px-3 rounded-r-lg ${activeBoard === board ? "bg-main-purple text-white" : "text-medium-grey"}`} onClick={() => setActiveBoard(board)}>

                                    <img src="assets/boardpurple.svg" alt="board" className="z-10" />

                                    <p className=" text-[15px] font-bold ">{board}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-3 cursor-pointer py-2 px-3 rounded-r-lg" >
                            <img src="assets/boardpurple.svg" alt="board" />
                            <p className="text-main-purple text-[15px] font-bold" onClick={ShowPopUp}>+ Create New Board</p>

                        </div>
                    </div>


                </div>
                <footer>
                    <div className={`flex justify-center items-center gap-4 ${toggleTheme ? "bg-very-dark-grey" : "bg-light-grey"} w-[235px] h-[48px] mx-auto rounded-[6px]`}>
                        <img src="assets/icon-light-theme.svg" alt="light" />
                        <div onClick={ChangeTheme}>
                            <div className="w-[40px] h-[20px] bg-toggle-bg rounded-full flex items-center p-1 cursor-pointer bg-main-purple">
                                <div className={`w-3 h-3 bg-white rounded-full shadow-md transform translate-x-0 transition-transform ${toggleTheme ? "translate-x-5" : ""}`}></div>
                            </div>
                        </div>
                        <img src="assets/icon-dark-theme.svg" alt="dark" />
                    </div>
                    <div className="mt-5 flex text-medium-grey px-5 items-center gap-4 cursor-pointer text-[15px] font-bold">
                        <img src="assets/icon-hide-sidebar.svg" alt="hide" />
                        <p>Hide Sidebar</p>
                    </div>
                </footer>
            </nav>
        </>

    )
}