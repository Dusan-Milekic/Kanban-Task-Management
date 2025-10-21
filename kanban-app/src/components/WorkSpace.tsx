import { useRef, useState } from "react";
import { useBoardStore } from "../zustand/boardStore";
import DetailTaskPopup from "./ui/detailtaskpopup";
import type { Task } from "../zustand/boardStore";
import TaskCard from "./ui/taskcard";
import {
    DragDropContext,
    Droppable,
    Draggable,
    type DropResult,
} from "@hello-pangea/dnd";

export default function WorkSpace() {
    const activeBoard = useBoardStore((state) => state.activeBoard);
    const currentSheet = useBoardStore((state) => state.currentSheet);
    const setCurrentSheet = useBoardStore((state) => state.setCurrentSheet);
    const [taskClicked, setTaskClicked] = useState<Task | undefined>(undefined);
    const [isDragging, setIsDragging] = useState(false);
    const blur_effect = useRef<HTMLDivElement>(null);

    const closePopUp = () => {
        if (isDragging) return;
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

    const handleDragEnd = (result: DropResult) => {
        setIsDragging(false);
        const { source, destination, draggableId } = result;
        if (!destination) return;

        const draggedTask = tasks.find((t) => t.title === draggableId);
        if (!draggedTask) return;

        const updatedTasks = tasks.map((t) =>
            t.title === draggableId ? { ...t, status: columns[destination.droppableId] } : t
        );

        setCurrentSheet(activeBoard, columns, updatedTasks);
    };

    return (
        <>
            <div
                id="blur"
                ref={blur_effect}
                onClick={closePopUp}
                className="w-dvw h-dvh fixed inset-0 bg-dark-grey opacity-50 brightness-30 z-40 hidden"
            />
            <div
                id="viewTask"
                className="absolute top-1/2 -translate-y-1/2 left-1/2 transform -translate-x-1/2 z-50 m-4 hidden"
            >
                <DetailTaskPopup
                    task={taskClicked}
                    allStatus={columns}
                    setIsDragging={setIsDragging}
                />
            </div>

            <DragDropContext
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
            >
                <div className="h-[80vh] bg-light-grey dark:bg-very-dark-grey flex flex-col p-5 gap-[25px] overflow-x-auto">
                    <div className="flex gap-6">
                        {columns.map((column, colIndex) => {
                            const tasksInColumn = tasks.filter((task) => task.status === column);

                            return (
                                <Droppable droppableId={String(colIndex)} key={colIndex}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className="min-w-[250px] bg-light-grey dark:bg-very-dark-grey rounded-lg"
                                        >
                                            <div className="flex items-baseline justify-between mb-3">
                                                <h3 className="text-black dark:text-medium-grey font-bold">
                                                    {column} ({tasksInColumn.length})
                                                </h3>
                                            </div>

                                            {tasksInColumn.length === 0 ? (
                                                <p className="text-sm text-gray-500">No tasks</p>
                                            ) : (
                                                tasksInColumn.map((task, taskIndex) => (
                                                    <Draggable
                                                        key={task.title}
                                                        draggableId={task.title}
                                                        index={taskIndex}
                                                    >
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={{
                                                                    ...provided.draggableProps.style,
                                                                    userSelect: "none",
                                                                }}
                                                            >
                                                                <TaskCard
                                                                    task={task}
                                                                    allStatus={tasks.map((t) => t.status)}
                                                                    setTaskClicked={(task) => {
                                                                        setTaskClicked(task);
                                                                        blur_effect.current?.classList.remove("hidden");
                                                                        document
                                                                            .getElementById("viewTask")
                                                                            ?.classList.remove("hidden");
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            );
                        })}
                    </div>
                </div>
            </DragDropContext>
        </>
    );
}
