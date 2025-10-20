export default function TaskCard({ task, allStatus }: { task: { title: string; subtasks?: any[], description: string, status: string }, allStatus: string[] }) {
    const subtasksCount = Array.isArray(task.subtasks) ? task.subtasks.length : 0;
    const completed = 0; // Placeholder for completed subtasks count
    const allStatuses = allStatus;
    //Remove duplicate
    for (let i = 0; i < allStatuses.length; i++) {
        for (let j = 0; j < allStatuses.length; j++) {
            if (i !== j && allStatuses[i] === allStatuses[j]) {
                allStatuses.splice(j, 1);
                j--;
            }
        }

    }
    const infoTask = () => {
        console.log(allStatuses);
    }
    return (
        <div className="bg-white dark:bg-dark-grey rounded-lg px-4 py-5 mb-3 cursor-pointer hover:shadow transition" onClick={infoTask}>
            <h4 className="text-black font-semibold mb-1 dark:text-white">{task.title}</h4>
            <p className="text-sm text-medium-grey font-medium">
                {subtasksCount === 0
                    ? "0 of 0 tasks completed"
                    : `${completed} of ${subtasksCount} tasks completed`}
            </p>
        </div>
    );
}