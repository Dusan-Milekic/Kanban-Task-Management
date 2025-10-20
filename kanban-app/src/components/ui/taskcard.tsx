export default function TaskCard({ task }: { task: { title: string; subtasks?: any[] } }) {
    const subtasksCount = Array.isArray(task.subtasks) ? task.subtasks.length : 0;
    const completed = 0; // Placeholder for completed subtasks count
    return (
        <div className="bg-white dark:bg-dark-grey rounded-lg px-4 py-5 mb-3 cursor-pointer hover:shadow transition">
            <h4 className="text-black font-semibold mb-1 dark:text-white">{task.title}</h4>
            <p className="text-sm text-medium-grey font-medium">
                {subtasksCount === 0
                    ? "0 of 0 tasks completed"
                    : `${completed} of ${subtasksCount} tasks completed`}
            </p>
        </div>
    );
}