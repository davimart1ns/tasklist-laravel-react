import { useEffect, useState } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import TaskListModal from '@/Components/TaskListModal'
import FlashMessage from '@/Components/FlashMessage'
import TaskListCard from '@/Components/TasklistCard'
import HeaderStats from '@/Components/HeaderStats'
import EmptyStates from '@/Components/EmptyState'


export default function Index({ tasklistTotal, taskLists, totalTasks, pendingTasks }) {
    const [isOpen, setIsOpen] = useState(false)
    const [editingList, setEditingList] = useState(null)
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

    const colors = [
        { value: '#3b82f6', name: 'Azul' },
        { value: '#ef4444', name: 'Vermelho' },
        { value: '#10b981', name: 'Verde' },
        { value: '#f59e0b', name: 'Amarelo' },
        { value: '#8b5cf6', name: 'Roxo' },
        { value: '#ec4899', name: 'Rosa' },
        { value: '#6366f1', name: 'Índigo' },
    ]

    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: '',
        description: '',
        color: '#3b82f6',
    })

    function openCreate() {
        setEditingList(null);
        reset();
        setIsOpen(true);
    }

    function openEdit(list) {
        setEditingList(list)
        setData({
            name: list.name,
            description: list.description || '',
            color: list.color ?? '#3b82f6',
        })
        setIsOpen(true)
    }

    function submit(e) {
        e.preventDefault()

        if (editingList) {
            put(route('tasklists.update', editingList.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
                preserveScroll: true,
            })
        } else {
            post(route('tasklists.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
                preserveScroll: true,
            })
        }
    }
    return (
        <AuthenticatedLayout
        >
            <Head title='Listas' />
            <div className="p-4 max-w-5xl mx-auto">
                <FlashMessage
                    showSuccess={showSuccess}
                    setShowSuccess={setShowSuccess}
                    successMessage={successMessage}
                />

                <HeaderStats
                    openCreate={openCreate}
                    totalTasks={totalTasks}
                    pendingTasks={pendingTasks} />

                {tasklistTotal === 0 && (<EmptyStates openCreate={openCreate} name={"lista"}/>)}


                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 '>
                    {taskLists?.data?.map(list => (
                        <TaskListCard
                            key={list.id}
                            list={list}
                            openEdit={openEdit} />
                    ))}
                </div>

                <TaskListModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    editingList={editingList}
                    data={data}
                    setData={setData}
                    submit={submit}
                    errors={errors}
                    processing={processing}
                    colors={colors}
                />
            </div>
        </AuthenticatedLayout>
    );
}