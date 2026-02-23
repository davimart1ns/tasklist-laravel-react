import {
    CheckCircleIcon,
    DocumentTextIcon,
    CalendarIcon,
    PencilIcon,
    TrashIcon
} from "@heroicons/react/24/solid"

export default function TaskCard({tasklist, task, openEdit, handleDelete, handleToggle}) {
    return (
        <div
            className={`group relative bg-white rounded-xl shadow-sm hover:shadow-md border-l-4 border-gray-200 transition-all duration-200 ${task.completed ? 'opacity-75' : ''}`}
            style={{ borderColor: tasklist.color }}>
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <button
                        onClick={() => handleToggle(task)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-500'
                            }`} >
                        {task.completed && <CheckCircleIcon className="w-4 h-4" />}
                    </button>

                    <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.title}</h3>

                        {task.description && (
                            <p className="text-sm text-gray-600 mt-1 flex items-start gap-1">
                                <DocumentTextIcon className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" />
                                <span>{task.description}</span>
                            </p>
                        )}
                        {task.due_date && (
                            <p className={`text-xs mt-1 flex items-center gap-1 ${new Date(task.due_date) < new Date() && !task.completed
                                ? 'text-red-500'
                                : 'text-gray-500'
                                }`}> <CalendarIcon className="w-4 h-4" />
                                {new Date(task.due_date).toLocaleDateString('pt-BR')}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                            onClick={() => openEdit(task)}
                            title="Editar" ><PencilIcon className="w-4 h-4" /></button>
                        <button className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Deletar"
                            onClick={() => handleDelete(task)}><TrashIcon className="w-4 h-5" /></button>
                    </div>
                </div>
            </div>

        </div>
    )
}