import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

// icones de Heroicons 
import {
    ChevronLeftIcon,
    PlusIcon,
    CalendarIcon,
    DocumentTextIcon,
    PencilIcon,
    TrashIcon,
    CheckCircleIcon
} from '@heroicons/react/24/solid';

export default function Show({ tasklist, tasks, stats }) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null)
    const [showSuccess, setShowSuccess] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    const page = usePage()
    const flash = page?.props.flash || {}

    useEffect(() => {
        if (flash.success) {
            setSuccessMessage(flash.success)
            setShowSuccess(true)

            // esconder a mensagem apos 5 segundos
            const timer = setTimeout(() => {
                setShowSuccess(false)
            }, 5000)

            return () => clearTimeout(timer)
        }
    }, [flash.success])

    const { data, setData, post, put, reset, processing, errors } = useForm(
        {
            title: '',
            description: '',
            due_date: '',
            task_list_id: tasklist.id,
            completed: false
        }
    )

    function openCreate() {
        setEditingTask(null);
        reset();
        setIsOpen(true)
    }

    function openEdit(task) {
        setEditingTask(task);
        setData({
            title: task.title,
            description: task.description || '',
            due_date: task.due_date ? task.due_date.split('T')[0] : '',
            task_list_id: task.task_list_id,
            completed: task.completed,
        })
        setIsOpen(true)
    }

    function submit(e) {
        e.preventDefault()

        if (editingTask) {
            put(route('tasks.update', editingTask.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
                preserveScroll: true,
            })
        } else {
            post(route('tasks.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
                preserveScroll: true,
            })
        }

    }

    function handleToggle(task) {
        // usar patch para atualizar apenas o campo completed
        router.patch(route('tasks.update', task.id), {
            completed: !task.completed,
        }, {
            preserveScroll: true,
        });
    }

    function handleDelete(task) {
        if (confirm(`Excluir a tarefa "${task.title}" ?`)) {
            router.delete(route('tasks.destroy', task.id), {
                preserveScroll: true
            });
        }
    }

    return (
        <AuthenticatedLayout >

            <Head title={tasklist.name} />


            <div className="p-4 max-w-5xl mx-auto">
                {showSuccess && (
                    <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                        <strong className="font-bold">Sucesso! </strong>
                        <span className="inline-block">{successMessage}</span>
                        <button
                            type="button"
                            className="absolute top-0 bottom-0 right-0 px-4 py-2"
                            onClick={() => setShowSuccess(false)}
                        ><span className="text-2xl">&times;</span></button>
                    </div>
                )}


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

                <div className="mt-6 space-y-3">
                    {stats.total === 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            <DocumentTextIcon className='w-16 h-16 text-gray-300 mx-auto mb-4' />
                            <p className="text-gray-500 text-lg">Nenhuma tarefa nesta lista ainda</p>
                            <button onClick={openCreate}
                                className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                                <PlusIcon className="w-5 h-5" />
                                Criar primeira tarefa
                            </button>
                        </div>
                    )}

                    {tasks.map(task => (
                        <div
                            key={task.id}
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
                    ))}
                </div>
                {/* MODAL */}
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)} />

                        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all ">
                            <h1 className="text-2xl font-bold text-gray-800 mb-6">{editingTask ? 'Editar tarefa' : 'Nova tarefa'}</h1>
                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título <span className="text-red-500">*</span></label>
                                    <input
                                        type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        placeholder="Digite o título da tarefa" />
                                    {errors.title && <div className="text-red-600 text-sm">{errors.title}</div>}
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                    <textarea
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        placeholder="Descrição da tarefa" />
                                    {errors.description && <div className="text-red-600 text-sm">{errors.description}</div>}
                                </div>

                                <div>
                                    <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">Data de vencimento</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        value={data.due_date}
                                        onChange={e => setData('due_date', e.target.value)} />
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <button disabled={processing}
                                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50">
                                        {editingTask ? 'Salvar alterações' : 'Criar tarefa'}
                                    </button>

                                    <button type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all font-medium disabled:opacity-50">
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
                }
            </div >
        </AuthenticatedLayout >
    )
}