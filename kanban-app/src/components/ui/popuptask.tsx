import React, { useRef, useState } from "react";
import { useBoardStore, type Task } from "../../zustand/boardStore";

export default function PopupTask() {
    const titleRef = useRef<HTMLInputElement | null>(null);
    const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
    const statusRef = useRef<HTMLSelectElement | null>(null);

    const activeBoard = useBoardStore((s) => s.activeBoard);
    const currentSheet = useBoardStore((s) => s.currentSheet);
    const boards = useBoardStore((s) => s.boards);
    const setCurrentSheet = useBoardStore((s) => s.setCurrentSheet);

    const [subtasks, setSubtasks] = useState<string[]>([]);

    const addNewSubtask = (e?: React.MouseEvent<HTMLButtonElement>) => {
        e?.preventDefault();
        setSubtasks((prev) => [...prev, ""]);
    };

    const setSubtask = (index: number, value: string) => {
        setSubtasks((prev) => {
            const copy = [...prev];
            copy[index] = value;
            return copy;
        });
    };

    const removeSubtask = (index: number) => {
        setSubtasks((prev) => prev.filter((_, i) => i !== index));
    };

    const submitTask = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const title = titleRef.current?.value.trim() ?? "";
        if (!title) return;

        const description = descriptionRef.current?.value ?? "";
        // determine columns for active board (fallback to global boards.columns)
        if (!activeBoard) {
            console.warn("No activeBoard selected");
            return;
        }
        const sheet = currentSheet?.[activeBoard];
        const columns = sheet?.columns ?? boards?.columns ?? [];

        // Build new Task matching your store's Task type
        const cleanedSubtasks = subtasks.map((s) => s.trim()).filter(Boolean);
        const newTask: Task = {
            title,
            description,
            subtasks: cleanedSubtasks,
            status: statusRef.current?.value ?? (columns[0] ?? ""),
        };

        // prepare updated tasks array (existing sheet tasks or empty)
        const existingTasks: Task[] = Array.isArray(sheet?.tasks) ? [...sheet!.tasks] : [];
        const updatedTasks = [...existingTasks, newTask];

        // call store setter exactly as your store expects
        setCurrentSheet(activeBoard, columns, updatedTasks);

        // clear form
        if (titleRef.current) titleRef.current.value = "";
        if (descriptionRef.current) descriptionRef.current.value = "";
        if (statusRef.current) statusRef.current.selectedIndex = 0;
        setSubtasks([]);
    };

    // options for select
    const selectColumns = (activeBoard && currentSheet?.[activeBoard]?.columns) ?? boards.columns ?? [];

    return (
        <div id="popup-task" className="bg-white w-[300px] h-auto p-6 rounded-lg shadow-lg flex flex-col gap-4">
            <h3 className="text-black font-bold text-lg">Add New Task</h3>
            <form className="flex flex-col text-[13px]" onSubmit={submitTask}>
                <label className="text-medium-grey">Title</label>
                <input
                    ref={titleRef}
                    type="text"
                    placeholder="e.g. Take coffee break"
                    className="px-3 py-2 text-medium-grey outline-0 border border-gray-300"
                />

                <label className="text-medium-grey pt-6">Description</label>
                <textarea
                    ref={descriptionRef}
                    className="resize-none px-3 py-2 h-[112px] text-medium-grey outline-0 border border-gray-300"
                    placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
                />

                <label className="text-medium-grey pt-6">Subtasks</label>
                <div className="flex flex-col gap-2">
                    {subtasks.map((s, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <input
                                value={s}
                                onChange={(ev) => setSubtask(i, ev.target.value)}
                                className="px-3 py-2 text-medium-grey outline-0 border border-gray-300 rounded w-full"
                                placeholder="Enter subtask"
                            />
                            <button type="button" onClick={() => removeSubtask(i)} className="px-2 py-1 border rounded">
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    className="bg-[rgba(99,96,199,0.57)] text-main-purple font-medium rounded-3xl mt-5 h-[40px]"
                    onClick={addNewSubtask}
                >
                    + Add New Subtask
                </button>

                <label className="text-medium-grey pt-6">Status</label>
                <select ref={statusRef} className="px-3 py-2 text-black font-bold outline-0 border border-gray-300">
                    {selectColumns.length === 0 ? <option value="">No columns</option> : null}
                    {selectColumns.map((col, i) => (
                        <option key={i} value={col}>
                            {col}
                        </option>
                    ))}
                </select>

                <button type="submit" className="bg-main-purple font-medium rounded-3xl mt-5 h-[40px]">
                    Create Task
                </button>
            </form>
        </div>
    );
}
