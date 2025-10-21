import { useBoardStore, type Task } from "../../zustand/boardStore";
export default function TaskCard({ task, setTaskClicked }: { task: Task, allStatus: string[], setTaskClicked: React.Dispatch<React.SetStateAction<Task | undefined>> },) {
    const subtasksCount = Array.isArray(task.subtasks) ? task.subtasks.length : 0;
    const completedTasks = useBoardStore((s) => s.completedTasks);

    const infoTask = () => {
        document.getElementById("viewTask")?.classList.remove("hidden");
        document.getElementById("blur")?.classList.remove("hidden");
        setTaskClicked(task);
    };
    return (
        <>
            <div className="bg-white dark:bg-dark-grey rounded-lg px-4 py-5 mb-3 cursor-pointer hover:shadow transition" onClick={infoTask}>
                <h4 className="text-black font-semibold mb-1 dark:text-white">{task.title}</h4>
                <p className="text-sm text-medium-grey font-medium">
                    {subtasksCount === 0
                        ? "0 of 0 tasks completed"
                        : `${completedTasks[task?.title] || 0} of ${subtasksCount} tasks completed`}
                </p>
            </div>
        </>
    );
}