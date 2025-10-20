export default function Column({ title, tasks }: { title: string, tasks: string[] }) {
    return (
        <div className="bg-light-grey dark:bg-very-dark-grey w-[280px] min-h-[400px] rounded-lg p-4 flex flex-col gap-4">
            <h3 className="font-bold text-sm text-medium-grey">{title} ({tasks.length})</h3>
            <div className="flex flex-col gap-3">
                {tasks.map((task, index) => (
                    <div key={index} className="bg-white dark:bg-dark-grey p-3 rounded shadow-sm cursor-pointer hover:brightness-90">
                        <p className="text-sm font-medium text-black dark:text-white">{task}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}