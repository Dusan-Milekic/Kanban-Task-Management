
import { useBoardStore } from '../zustand/boardStore';
export default function Header() {
    const { activeBoard } = useBoardStore();


    function showNav() {
        const nav = document.getElementById('navbar');
        nav?.classList.remove('hidden');
        nav?.classList.add('animate-fade-right');
    }

    return (
        <header className="p-4  bg-white dark:bg-dark-grey shadow-md flex items-center justify-between">
            <div className="flex items-center">
                <div>
                    <img src="assets/logo-mobile.svg" alt="mobile" />
                </div>
                <div className="flex items-center gap-2 ml-4 cursor-pointer" onClick={showNav}>
                    <h1 className="text-black dark:text-white font-bold">{activeBoard || "No selected"}</h1>
                    <img src="assets/icon-chevron-down.svg" alt="chevron" />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="bg-main-purple w-[48px] h-[32px] flex justify-center items-center rounded-3xl opacity-50">
                    <img src="assets/icon-add-task-mobile.svg" alt="icon-add" className="w-3 h-3" />
                </div>
                <div><img src="assets/icon-vertical-ellipsis.svg" alt="icon-vertical-ellipsis" /></div>
            </div>



        </header>
    )
}