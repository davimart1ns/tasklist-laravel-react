import { Link, router } from "@inertiajs/react"
import {
    ChevronLeftIcon,
    PlusIcon
} from "@heroicons/react/24/solid"

export default function TaskHeaderStats({tasklist, openCreate, stats}) {
    return (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center gap-3 mb-2 ">
                <Link
                    href={route('tasklists.index')}
                    className="inline-flex items-center gap-1 text-yellow-600 hover:text-yellow-800 transition">
                    <ChevronLeftIcon className="w-5 h-5" />
                </Link>
                <div className="w-8 h-8 rounded-lg"
                    style={{ backgroundColor: tasklist.color }} />
                <h1 className="text-3xl font-bold text-gray-800">{tasklist.name}</h1>

                <button onClick={openCreate}
                    className="ml-auto inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600  bg-green-600 text-white px-5 py-3 rounded-lg shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium ">
                    <PlusIcon className="w-5 h-5" /> Nova tarefa
                </button>
            </div>

            {tasklist.description && (
                <p className="text-gray-600 mb-4 pl-11">{tasklist.description}</p>
            )}

            <div className="flex flex-wrap gap-3 mt-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
                    Total: {stats.total}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded">
                    Concluídas: {stats.completed}
                </span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded">
                    Pendentes: {stats.pending}
                </span>

            </div>
        </div>
    )
}