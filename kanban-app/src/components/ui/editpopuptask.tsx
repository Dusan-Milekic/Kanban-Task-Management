import React, { useRef, useState, useEffect } from "react";
import { useBoardStore, type Task } from "../../zustand/boardStore";

export default function EditTaskPopup({ task }: { task: Task | undefined; }) {
    const titleRef = useRef<HTMLInputElement | null>(null);
    const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
    const statusRef = useRef<HTMLSelectElement | null>(null);

    const activeBoard = useBoardStore((s) => s.activeBoard);
    const currentSheet = useBoardStore((s) => s.currentSheet);
    const boards = useBoardStore((s) => s.boards);
    const setCurrentSheet = useBoardStore((s) => s.setCurrentSheet);

    const [existingSubtasks, setExistingSubtasks] = useState<string[]>([]);
    const [newSubtasks, setNewSubtasks] = useState<string[]>([]);

    // Initialize existing subtasks when task changes
    useEffect(() => {
        if (task?.subtasks) {
            setExistingSubtasks([...task.subtasks]);
        } else {
            setExistingSubtasks([]);
        }
        setNewSubtasks([]);
    }, [task]);

    const addNewSubtask = (e?: React.MouseEvent<HTMLButtonElement>) => {
        e?.preventDefault();
        setNewSubtasks((prev) => [...prev, ""]);
    };

    const setExistingSubtask = (index: number, value: string) => {
        setExistingSubtasks((prev) => {
            const copy = [...prev];
            copy[index] = value;
            return copy;
        });
    };

    const setNewSubtask = (index: number, value: string) => {
        setNewSubtasks((prev) => {
            const copy = [...prev];
            copy[index] = value;
            return copy;
        });
    };

    const removeExistingSubtask = (index: number) => {
        setExistingSubtasks((prev) => prev.filter((_, i) => i !== index));
    };

    const removeNewSubtask = (index: number) => {
        setNewSubtasks((prev) => prev.filter((_, i) => i !== index));
    };

    const editTask = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Get all values from input fields
        const title = titleRef.current?.value.trim() ?? "";
        if (!title) return;

        const description = descriptionRef.current?.value ?? "";

        if (!activeBoard) {
            console.warn("No activeBoard selected");
            return;
        }

        const sheet = currentSheet?.[activeBoard];
        const columns = sheet?.columns ?? boards?.columns ?? [];

        // Combine existing and new subtasks, then clean them
        const allSubtasks = [...existingSubtasks, ...newSubtasks];
        const cleanedSubtasks = allSubtasks.map((s) => s.trim()).filter(Boolean);

        const updatedTask: Task = {
            title,
            description,
            subtasks: cleanedSubtasks,
            status: statusRef.current?.value ?? (columns[0] ?? ""),
        };

        if (!sheet) return;

        const tasks = sheet.tasks.map((t) =>
            t.title === task?.title ? updatedTask : t
        );

        setCurrentSheet(activeBoard, sheet.columns, tasks);

        // Close popup
        document.getElementById("editTask")?.classList.add("hidden");
        document.getElementById("blur")?.classList.add("hidden");
    };

    // Options for select
    const selectColumns = (activeBoard && currentSheet?.[activeBoard]?.columns) ?? boards.columns ?? [];

    return (
        <div id="popup-task" className="bg-white w-[300px] h-auto p-6 rounded-lg shadow-lg flex flex-col gap-4">
            <h3 className="text-black font-bold text-lg">Edit Task</h3>
            <form className="flex flex-col text-[13px]" onSubmit={editTask}>
                <label className="text-medium-grey">Title</label>
                <input
                    ref={titleRef}
                    type="text"
                    defaultValue={task?.title}
                    placeholder="Enter task title"
                    className="px-3 py-2 text-black outline-0 border border-gray-300 font-bold"
                />

                <label className="text-medium-grey pt-6">Description</label>
                <textarea
                    ref={descriptionRef}
                    className="resize-none px-3 py-2 h-[112px] text-medium-grey outline-0 border border-gray-300"
                    defaultValue={task?.description}
                    placeholder="Enter task description"
                />

                <label className="text-medium-grey pt-6">Subtasks</label>
                <div className="flex flex-col gap-2">
                    {existingSubtasks.map((s, i) => (
                        <div key={`existing-${i}`} className="flex items-center gap-2">
                            <input
                                value={s}
                                onChange={(ev) => setExistingSubtask(i, ev.target.value)}
                                className="px-3 py-2 text-medium-grey outline-0 border border-gray-300 rounded w-full"
                                placeholder="Enter subtask"
                            />
                            <img
                                src="assets/icon-cross.svg"
                                onClick={() => removeExistingSubtask(i)}
                                className="cursor-pointer rounded text-medium-grey"
                                alt="Remove"
                            />
                        </div>
                    ))}
                    {newSubtasks.map((s, i) => (
                        <div key={`new-${i}`} className="flex items-center gap-2">
                            <input
                                value={s}
                                onChange={(ev) => setNewSubtask(i, ev.target.value)}
                                className="px-3 py-2 text-medium-grey outline-0 border border-gray-300 rounded w-full"
                                placeholder="Enter subtask"
                            />
                            <img
                                src="assets/icon-cross.svg"
                                onClick={() => removeNewSubtask(i)}
                                className="cursor-pointer rounded text-medium-grey"
                                alt="Remove"
                            />
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
                <select
                    ref={statusRef}
                    defaultValue={task?.status}
                    className="px-3 py-2 text-black font-bold outline-0 border border-gray-300"
                >
                    {selectColumns.length === 0 ? <option value="">No columns</option> : null}
                    {selectColumns && selectColumns.map((col: string, i: number) => (
                        <option key={i} value={col}>
                            {col}
                        </option>
                    ))}
                </select>

                <button type="submit" className="bg-main-purple font-medium rounded-3xl mt-5 h-[40px]">
                    Save Changes
                </button>
            </form>
        </div>
    );
}