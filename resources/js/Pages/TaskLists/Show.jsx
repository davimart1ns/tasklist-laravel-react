import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Show({ tasklist, tasks, stats }) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null)

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

            <div className="p-6 max-w-4xl mx-auto">
                <Link
                    href={route('tasklists.index')}
                    className="mb-6 bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-700 transition">
                    ← Voltar para listas
                </Link>

                <div className="mb-6 p-4 bg-white rounded-lg shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: tasklist.color }} />
                        <h1 className="text-2xl font-bold">{tasklist.name}</h1>
                    </div>

                    {tasklist.description && (
                        <p className="text-gray-600 mb-3">{tasklist.description}</p>
                    )}

                    <div className="flex gap-4 text-sm">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
                            Total: {stats.total}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded">
                            Concluídas: {stats.completed}
                        </span>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded">
                            Total: {stats.pending}
                        </span>

                    </div>
                </div>
                <button onClick={openCreate}
                    className="mb-6 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                    +  Criar Tarefa
                </button>

                <div className="mt-6 space-y-3">
                    {stats.total === 0 && (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">Nenhuma tarefa nesta lista ainda</p>
                            <button onClick={openCreate}
                                className="mt-2 text-green-600 hover: text-green-700">
                                Clique aqui para criar a primeira tarefa
                            </button>
                        </div>
                    )}

                    {tasks.map(task => (
                        <div
                            key={task.id}
                            className={`flex items-center justify-between bg-white shadow p-3 rounded border-l-4 ${task.completed ? 'opacity-70' : ''}`}
                            style={{ borderColor: tasklist.color }}>
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => handleToggle(task)}
                                        className="h-5 w-5 text-blue-600 rounded" />

                                    <div>
                                        <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</h3>
                                        {task.description && (
                                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                        )}
                                        {task.due_date && (
                                            <p className={`text-xs mt-1 ${new Date(task.due_date) < new Date() && !task.completed
                                                ? 'text-red-500'
                                                : 'text-gray-500'
                                                }`}>{new Date(task.due_date).toLocaleDateString('pt-BR')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                    onClick={() => openEdit(task)}>Editar</button>
                                <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                    onClick={() => handleDelete(task)}>Deletar</button>
                            </div>

                        </div>
                    ))}
                </div>
                {/* MODAL */}
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/50"
                            onClick={() => setIsOpen(false)} />
                        <div className="relative bg-white p-6 rounded-xl shadow-lg w-full max-w-md z-10">
                            <h1 className="text-2xl font-bold mb-4">{editingTask ? 'Editar tarefa' : 'Criar tarefa'}</h1>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label className="block mb-1">Nome da task</label>
                                    <input
                                        type="text"
                                        className="border rounded w-full p-2"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        placeholder="Nome da lista" />
                                    {errors.title && <div className="text-red-600 text-sm">{errors.title}</div>}
                                </div>

                                <div>
                                    <label>Descrição</label>
                                    <textarea
                                        className="border rounded w-full p-2"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        placeholder="Descrição da tarefa" />
                                    {errors.description && <div className="text-red-600 text-sm">{errors.description}</div>}
                                </div>

                                <div>
                                    <input
                                        type="date"
                                        className="border rounded w-full p-2"
                                        value={data.due_date}
                                        onChange={e => setData('due_date', e.target.value)} />
                                </div>

                                <div className="flex gap-2">
                                    <button disabled={processing}
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                        {editingTask ? 'Editar tarefa' : 'Criar tarefa'}
                                    </button>

                                    <button type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
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