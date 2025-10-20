
import { useRef, useState } from "react";

export default function PopupTask() {

    const tasks = useRef<HTMLDivElement>(null);
    const [columnsSubTasks, setColumnsSubTasks] = useState<HTMLInputElement[]>([]);

    const title = useRef<HTMLInputElement>(null);
    const description = useRef<HTMLTextAreaElement>(null);
    const status = useRef<HTMLSelectElement>(null);


    const AddNewTask = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter task name';
        input.classList.add('px-3', 'py-2', 'text-medium-grey', 'outline-0', 'border', 'border-gray-300', 'rounded', 'mb-2', 'w-full');

        tasks.current?.appendChild(input);
        setColumnsSubTasks([...columnsSubTasks, input]);
    };
    const SubmitTask = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Logic to submit the new task can be added here

    }


    return (
        <div id="popup-task" className="bg-white w-[300px] h-auto p-6 rounded-lg shadow-lg flex flex-col gap-4">
            <h3 className="text-black font-bold text-lg">Add New Task</h3>
            <form className="flex flex-col text-[13px]" onSubmit={SubmitTask}>
                <label className="text-medium-grey">Title</label>
                <input ref={title} type="text" placeholder="e.g. Take coffee break" className="px-3 py-2 text-medium-grey outline-0 border border-gray-300" />
                <label className="text-medium-grey pt-6">Description</label>
                <textarea ref={description} className="resize-none px-3 py-2 h-[112px] text-medium-grey outline-0 border border-gray-300" placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little." />
                <label className="text-medium-grey pt-6">Subtasks</label>
                <div className="flex flex-col" ref={tasks}>
                </div>
                <button type="submit" className="bg-[rgba(99,96,199,0.57)] text-main-purple font-medium rounded-3xl mt-5 h-[40px]" onClick={AddNewTask}>+ Add New Subtask</button>
                <label className="text-medium-grey pt-6">Status</label>
                <select ref={status} className="px-3 py-2 text-black font-bold  outline-0 border border-gray-300">

                </select>
                <button type="submit" className="bg-main-purple font-medium rounded-3xl mt-5 h-[40px]">Create Task</button>
            </form>
        </div>
    )
}
