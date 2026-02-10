import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function Show({ tasklist, tasks, stats }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold" style={{ color: tasklist.color }}> {tasklist.name}
                    </h2>
                    <p className="texts-sm text-gray-500">
                        {stats.total} tarefas
                    </p>
                </div>
            }>

            <Head title={tasklist.name} />

            <div className="p-6 max-w-4xl mx-auto">
                <Link
                    href={route('tasklists.index')}
                    className="text-blue-600 hover:underline"> ← Voltar </Link>

                <div className="mt-6 space-y-3">
                    {stats.total === 0 && (
                        <p className="text-gray-500">Nenhuma tarefa ainda.</p>
                    )}

                    {tasks.map(task => (
                        <div
                            key={task.id}
                            className="flex items-center justify-between bg-white shadow p-3 rounded border-l-4"
                            style={{ borderColor: tasklist.color }}>

                            <span className={task.completed ? 'line-through text-gray-400' : ''}>
                                {task.title}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => router.post(route('tasks.toggle', task.id))}
                                    className="bg-indigo-600 text-white px-2 py-1 rounded">
                                    {task.completed ? 'Desfazer' : 'Concluir'}
                                </button>
                                <button
                                    onClick={() => router.delete(route('tasks.destroy', task.id))}
                                    className="bg-red-600 text-white px-2 py-1 rounded"
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    )
}