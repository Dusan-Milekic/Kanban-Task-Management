import { useBoardStore } from "../zustand/boardStore";
import React from "react";

export default function WorkSpace() {
    const activeBoard = useBoardStore((state) => state.activeBoard);
    const currentSheet = useBoardStore((state) => state.currentSheet);

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
        <div className="h-[80vh] bg-light-grey dark:bg-very-dark-grey flex flex-col p-5 gap-[25px] overflow-x-auto">
            <div className="flex gap-6">
                {columns.map((column, colIndex) => {
                    // tasks that belong to this column
                    const tasksInColumn = (tasks ?? []).filter((task) => task.status === column);

                    return (
                        <div key={colIndex} className="min-w-[250px] bg-white rounded-lg p-4 shadow-md">
                            <div className="flex items-baseline justify-between mb-3">
                                <h3 className="text-black font-bold">{column}</h3>
                                <span className="text-sm text-medium-grey">{tasksInColumn.length}</span>
                            </div>

                            {tasksInColumn.length === 0 ? (
                                <p className="text-sm text-gray-500">No tasks</p>
                            ) : (
                                tasksInColumn.map((task, taskIndex) => {
                                    const subtasksCount = Array.isArray(task.subtasks) ? task.subtasks.length : 0;
                                    // we don't have completion flags, so assume 0 completed
                                    const completed = 0;

                                    return (
                                        <div
                                            key={taskIndex}
                                            className="bg-[#f4f7fd] border border-gray-200 rounded-lg p-3 mb-3 cursor-pointer hover:shadow transition"
                                        >
                                            <h4 className="text-black font-semibold mb-1">{task.title}</h4>

                                            <p className="text-sm text-gray-600">
                                                {subtasksCount === 0
                                                    ? "0 of 0 tasks completed"
                                                    : `${completed} of ${subtasksCount} tasks completed`}
                                            </p>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
