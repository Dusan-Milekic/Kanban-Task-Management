


import { useBoardStore } from '../zustand/boardStore';

export default function WorkSpace() {
    // koristimo selektore da bismo izbegli re-subscribe celog state-a
    const activeBoard = useBoardStore((state) => state.activeBoard);
    const board = useBoardStore((state) => state.boards);



    return (
        <div className="h-[80vh] bg-light-grey dark:bg-very-dark-grey flex flex-col  p-5  gap-[25px]">
            {!activeBoard ? (
                <>
                    <p className="text-center font-bold text-lg text-medium-grey">
                        The board is empty. Create a new <br /> board to get started
                    </p>

                </>
            ) : (
                <div className="flex gap-6 overflow-x-auto pb-4">
                    {board.columns.map((column) => (
                        <div key={column} className="flex-shrink-0">
                            <div>
                                <h2 className="font-bold text-md mb-4 text-black dark:text-white">{column}</h2>
                            </div>
                            <div className="space-y-4">
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
