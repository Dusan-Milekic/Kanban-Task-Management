import { useRef, useState } from "react";
import { useBoardStore } from "../zustand/boardStore";
import DetailTaskPopup from "./ui/detailtaskpopup";
import type { Task } from "../zustand/boardStore";

import TaskCard from "./ui/taskcard";

export default function WorkSpace() {
    const activeBoard = useBoardStore((state) => state.activeBoard);
    const currentSheet = useBoardStore((state) => state.currentSheet);
    const [taskClicked, setTaskClicked] = useState<Task | undefined>(undefined);
    const blur_effect = useRef<HTMLDivElement>(null);
    const closePopUp = () => {
        blur_effect.current?.classList.add("hidden");
        document.getElementById("viewTask")?.classList.add("hidden");
        document.getElementById("actionsPopup")?.classList.add("hidden");
    };
    if (!activeBoard || !currentSheet?.[activeBoard]) {
        return (
            <div className="h-[80vh] bg-light-grey dark:bg-very-dark-grey flex items-center justify-center p-5">
                <p className="text-center font-bold text-lg text-medium-grey">
                    The board is empty. Create a new <br /> board to get started.
                </p>
            </div>
        );
    }

    const { columns, tasks } = currentSheet[activeBoard];

    return (
        <>
            <div
                id="blur"
                ref={blur_effect}
                onClick={closePopUp}
                className="w-dvw h-dvh fixed inset-0 bg-dark-grey opacity-50 brightness-30 z-40 hidden"
            >
                {/* Blur effect on screen */}
            </div>
            <div id="viewTask" className="absolute top-1/2 -translate-y-1/2 left-1/2 transform -translate-x-1/2 z-50 m-4 hidden">
                <DetailTaskPopup task={taskClicked} allStatus={columns} />
            </div>
            <div className="h-[80vh] bg-light-grey dark:bg-very-dark-grey flex flex-col p-5 gap-[25px] overflow-x-auto">
                <div className="flex gap-6">
                    {columns.map((column, colIndex) => {
                        // tasks that belong to this column
                        const tasksInColumn = (tasks ?? []).filter((task) => task.status === column);

                        return (
                            <div key={colIndex} className="min-w-[250px] bg-light-grey dark:bg-very-dark-grey rounded-lg ">
                                <div className="flex items-baseline justify-between mb-3">
                                    <h3 className="text-black dark:text-medium-grey font-bold">{column} ({tasksInColumn.length})</h3>
                                </div>

                                {tasksInColumn.length === 0 ? (
                                    <p className="text-sm text-gray-500">No tasks</p>
                                ) : (
                                    tasksInColumn.map((task, taskIndex) => {
                                        return (<TaskCard key={taskIndex} task={task} allStatus={tasks.map(t => t.status)} setTaskClicked={setTaskClicked} />);
                                    })
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
