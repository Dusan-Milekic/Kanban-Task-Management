import { useBoardStore } from '../zustand/boardStore';

export default function WorkSpace() {
    const { activeBoard } = useBoardStore();
    const { fullboardData } = useBoardStore();
    return (
        <div className="h-[80vh] bg-light-grey dark:bg-very-dark-grey flex flex-col p-5  gap-[25px]">
            {!activeBoard ? (
                <>
                    <p className="text-center font-bold text-lg text-medium-grey">
                        The board is empty. Create a new <br /> column to get started
                    </p>
                    <button className="w-[174px] h-[48px] bg-main-purple text-white rounded-3xl cursor-pointer hover:opacity-90">
                        + Add New Column
                    </button>
                </>
            ) : (
                <div className="">
                    <div className="flex gap-3">
                        {fullboardData[activeBoard].map((task, index) => (
                            <div key={index} className="w-[280px] bg-white dark:bg-dark-grey p-3 rounded shadow-sm cursor-pointer hover:brightness-90">
                                <p className="text-sm font-medium text-black dark:text-white">{task}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}