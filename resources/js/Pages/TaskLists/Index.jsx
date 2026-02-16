import { useEffect, useState } from 'react'
import { Link, router, useForm, usePage } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'

// icones de Heroicons
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    DocumentTextIcon,
    ListBulletIcon,
    EyeIcon
} from '@heroicons/react/24/solid';


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
        '#3b82f6', // blue
        '#ef4444', // red
        '#10b981', // green
        '#f59e0b', // yellow
        '#8b5cf6', // purple
        '#ec4899', // pink
        '#6366f1', // indigo
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
                {showSuccess && (
                    <div className='mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative'>
                        <strong className='font-bold'>Sucesso! </strong>
                        <span className='inline-block'>{successMessage}</span>
                        <button
                            type='button'
                            className='absolute top-0 bottom-0 right-0 px-4 py-2'
                            onClick={() => setShowSuccess(false)}>
                            <span className='text-2xl'>&times;</span>
                        </button>
                    </div>
                )}

                <div className='mb-6 p-4 bg-white rounded-lg shadow-md border border-gray-100'>
                    <div className='flex items-center gap-1 mb-2'>
                        <div> <ListBulletIcon className='w-8 w-8' /></div>
                        <h1 className=' text-3xl font-bold text-gray-800 ml-2'> Minhas listas</h1>

                        <button
                            onClick={openCreate}
                            className="ml-auto inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600  bg-green-600 text-white px-5 py-3 rounded-lg shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium "
                        >
                            <PlusIcon className='w-4 h-4' /> Nova lista
                        </button>
                    </div>
                    <div className='flex flex-wrap gap-3 mt-5'>
                        <span className='px-3 py-2 bg-blue-100 text-blue-800 rounded-lg'>Total de tarefas : {totalTasks}</span>
                        <span className='bg-red-100 text-red-800 px-3 py-2 rounded-lg
                '>Tarefas pendentes: {pendingTasks}</span>
                    </div>

                </div>
                <div>
                    {tasklistTotal === 0 && (
                        <div className='text-center py-14 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200'>
                            <DocumentTextIcon className='w-16 h-16 text-gray-300 mx-auto mb-4' />
                            <p className='text-gray-500 text-lg'>Nenhuma lista ainda</p>
                            <button onClick={openCreate}
                                className='mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium'>
                                <PlusIcon className='h-5 w-5' />Criar a primeira lista</button>
                        </div>
                    )}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 '>
                    {taskLists?.data?.map(list => (
                        <div key={list.id} className='p-3 group relative bg-white rounded-xl shadow-sm hover:shadow-md border-l-4 border-gray-200 transition-all duration-200'
                            style={{ borderColor: list.color || '#3b82f6' }}>
                            <div className='p-4 flex justify-between items-start'>

                                <div>
                                    <div className='flex items-center gap-2'>
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
                    ))}
                </div>

                {/* MODAL */}
                {isOpen && (
                    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>

                        <div className='absolute inset-0 bg-black/50'
                            onClick={() => setIsOpen(false)} />

                        <div className='relative bg-white p-6 rounded-xl shadow-lg w-full max-w-md z-10'>
                            <h1 className='text-2xl font-bold mb-4'> {editingList ? 'Editar lista' : 'Criar lista'}</h1>

                            <form onSubmit={submit} className='space-y-4'>
                                <div>
                                    <label className='block mb-1'> Nome da lista</label>
                                    <input
                                        type='text'
                                        className='border rounded w-full p-2'
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder='Nome da lista'
                                    />
                                    {errors.name && (
                                        <div className='text-red-600 text-sm'>{errors.name}</div>
                                    )}
                                </div>

                                <div>
                                    <label className='block mb-1'>Descrição</label>
                                    <textarea
                                        rows={4}
                                        className='border rounded w-full p-1'
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        placeholder='Descrição da lista'
                                    />
                                    {errors.description && (
                                        <div className='text-red-600 text-sm'>{errors.description}</div>
                                    )}
                                </div>

                                <div>
                                    <label className='block mb-1'>Cor</label>
                                    <div className='flex gap-2 flex-wrap'>
                                        {colors.map(color => (
                                            <button
                                                type='button'
                                                key={color}
                                                onClick={() => setData('color', color)}
                                                className='w-8 h-8 rounded-full border-2'
                                                style={{
                                                    backgroundColor: color,
                                                    borderColor:
                                                        data.color === color ? 'black' : 'transparent'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className='flex gap-2'>
                                    <button disabled={processing}
                                        className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'> {editingList ? 'Salvar alterações' : 'Criar'}</button>

                                    <button
                                        type='button'
                                        onClick={() => setIsOpen(false)}
                                        className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'> Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}