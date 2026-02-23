import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import FlashMessage from "@/Components/FlashMessage";
import TaskHeaderStats from "@/Components/TaskHeaderStats";
import EmptyState from "@/Components/EmptyState";
import TaskCard from "@/Components/TaskCard";
import TaskModal from "@/Components/TaskModal";

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
                <FlashMessage
                    showSuccess={showSuccess}
                    setShowSuccess={setShowSuccess}
                    successMessage={successMessage} />

                <TaskHeaderStats
                    tasklist={tasklist}
                    openCreate={openCreate}
                    stats={stats} />

                <div className="mt-6 space-y-3">
                    {stats.total === 0 && (<EmptyState openCreate={openCreate} name={"tarefa"} />)}

                    {tasks.map(task => (
                        <TaskCard
                            tasklist={tasklist}
                            task={task}
                            key={task.id}
                            openEdit={openEdit}
                            handleDelete={handleDelete}
                            handleToggle={handleToggle} />
                    ))}
                </div>

                <TaskModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    editingTask={editingTask}
                    submit={submit}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                />
            </div >
        </AuthenticatedLayout >
    )
}