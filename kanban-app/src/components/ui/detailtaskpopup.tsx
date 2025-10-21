import React, { useEffect, useState } from "react";
import { type Task } from "../../zustand/boardStore";
import { useBoardStore } from "../../zustand/boardStore";

export default function DetailTaskPopup({
    task,
    allStatus,
}: {
    task: Task | undefined;
    allStatus: string[];
}) {
    const completedTasks = useBoardStore((s) => s.completedTasks);
    const setCompletedTasks = useBoardStore((s) => s.setCompletedTasks);

    const uniqueStatuses = Array.from(new Set(allStatus));

    // lokalno pratimo koji su subtasks čekirani (index => boolean)
    const [checkedMap, setCheckedMap] = useState<Record<number, boolean>>({});

    // helper: key za localStorage (encode task.title da bude safe)
    const makeLSKey = (title?: string) =>
        `subtasks_checked::${encodeURIComponent(title ?? "unknown-task")}`;

    // Inicijalizuj checkedMap iz localStorage kad se task promeni
    useEffect(() => {
        if (!task) {
            setCheckedMap({});
            return;
        }

        const lsKey = makeLSKey(task.title);
        try {
            const raw = localStorage.getItem(lsKey);
            if (raw) {
                const parsed: Record<number, boolean> = JSON.parse(raw);
                const init: Record<number, boolean> = {};
                task.subtasks.forEach((_, i) => {
                    init[i] = parsed?.[i] ?? false;
                });
                setCheckedMap(init);

                // sinhronizuj broj u store-u (da se slaže sa checkbox state-om)
                const count = Object.values(init).filter(Boolean).length;
                setCompletedTasks(task.title, count);
                return;
            }
        } catch (e) {
            console.warn("Failed to read subtasks from localStorage", e);
        }

        // default: sve false
        const init: Record<number, boolean> = {};
        task.subtasks.forEach((_, i) => (init[i] = false));
        setCheckedMap(init);

        // osiguraj da store ima 0 ako nemamo ništa
        setCompletedTasks(task.title, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [task?.title, task?.subtasks?.length]);

    const showPopup = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        const popup = e.currentTarget.nextElementSibling as HTMLElement;
        popup.classList.toggle("hidden");
    };

    // helper za persist u localStorage i update store-a
    const persistCheckedMap = (title: string, newMap: Record<number, boolean>) => {
        const lsKey = makeLSKey(title);
        try {
            localStorage.setItem(lsKey, JSON.stringify(newMap));
        } catch (e) {
            console.warn("Failed to write subtasks to localStorage", e);
        }
        const count = Object.values(newMap).filter(Boolean).length;
        setCompletedTasks(title, count);
    };

    // handler za promenu statusa (prebacivanje zadatka u drugu kolonu)
    const handleStatusChange = (newStatus: string) => {
        if (!task) return;
        const store = useBoardStore.getState();
        const active = store.activeBoard;
        if (!active) return;

        const boardObj = store.currentSheet?.[active];
        if (!boardObj) return;

        const tasks = (boardObj.tasks || []).map((t) =>
            t.title === task.title ? { ...t, status: newStatus } : t
        );

        // next state for currentSheet


        // update store (tvoja setCurrentSheet bi trebalo da snimi i localStorage)
        store.setCurrentSheet(active, boardObj.columns, tasks);
    };

    return (
        <div
            id="popup-task"
            className="bg-white w-[300px]  h-auto p-6 rounded-lg shadow-lg flex flex-col gap-4 text-dark-grey"
        >
            <div className="flex justify-between">
                <h3 className="font-bold text-lg">{task?.title}</h3>
                <div className="cursor-pointer  relative">
                    <img
                        src="assets/icon-vertical-ellipsis.svg"
                        alt="options"
                        className="w-[5px] h-[20px]"
                        onClick={showPopup}
                    />
                    <div
                        id="actionsPopup"
                        className="absolute -left-12 w-[150px] py-3 space-y-4 bg-white  rounded-lg text-[13px] hidden"
                    >
                        <p className="text-medium-grey">Edit task</p>
                        <p className="text-red">Delete task</p>
                    </div>
                </div>
            </div>

            <p className="text-medium-grey text-[13px]">{task?.description}</p>

            <div>
                {task?.subtasks && task.subtasks.length > 0 ? (
                    <>
                        <p className="text-medium-grey font-bold text-[12px]">
                            Subtasks ({completedTasks[task?.title] || 0} of {task.subtasks.length})
                        </p>
                        <ul className="list-inside text-[12px]">
                            {task.subtasks.map((subtask, index) => (
                                <li
                                    key={`${task.title ?? "task"}-sub-${index}`}
                                    className={`flex items-center px-3 my-2.5 py-1 bg-light-grey ${checkedMap[index] ? "line-through" : ""
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        className="mr-2 accent-main-purple"
                                        checked={!!checkedMap[index]}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            const isChecked = e.target.checked;
                                            setCheckedMap((prev) => {
                                                const next = { ...prev, [index]: isChecked };
                                                if (task?.title) persistCheckedMap(task.title, next);
                                                return next;
                                            });
                                        }}
                                    />
                                    {subtask}
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p>No subtasks</p>
                )}

                <p className="text-[12px]">Current Status</p>
                <select
                    className="px-3 py-2 text-black font-bold outline-0 border border-gray-300 w-full text-[13px]"
                    value={task?.status ?? ""}
                    onChange={(e) => handleStatusChange(e.target.value)}
                >
                    {uniqueStatuses.length === 0 ? <option value="">No columns</option> : null}
                    {uniqueStatuses.map((col: string, i: number) => (
                        <option key={i} value={col}>
                            {col}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
