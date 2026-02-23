import { Link, router } from "@inertiajs/react";
import {
    PencilIcon,
    TrashIcon,
    EyeIcon,
    DocumentTextIcon,
} from "@heroicons/react/24/solid"

export default function TaskListCard({list, openEdit}) {
    return (
        <div className='p-3 group relative bg-white rounded-xl shadow-sm hover:shadow-md border-l-4 border-gray-200 transition-all duration-200'
            style={{ borderColor: list.color || '#3b82f6' }}>
            <div className='p-4 flex justify-between items-start'>

                <div>
                    <div className='flex items-center gap-3'>
                        <h2 className='text-xl font-semibold' >{list.name}</h2>
                        <span className='text-gray-600 text-sm'>({list.tasks_count} pendentes)</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 flex items-start gap-1">
                        <DocumentTextIcon className="w-4 h-4 mt-0.5 text-gray-400" />
                        <span>{list.description}</span>
                    </p>

                </div>

                <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <Link href={route('tasklists.show', list.id)} className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition '> <EyeIcon className='w-5 h-5' /></Link>

                    <button type='button' onClick={() => openEdit(list)} className='p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition '> <PencilIcon className='w-4 h-4' /> </button>

                    <button className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition'
                        onClick={() => {
                            if (confirm('Excluir lista? ')) {
                                router.delete(route('tasklists.destroy', list.id));
                            }
                        }}>
                        <TrashIcon className='w-4 h-4' />
                    </button>
                </div>
            </div>
        </div>
    )
}