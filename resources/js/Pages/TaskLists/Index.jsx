import { useEffect, useState } from 'react'
import { Link, router, useForm, usePage } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'


export default function Index({ taskLists, totalTasks, pendingTasks }) {
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
            header={
                <div>
                    <h2 className='text-xl font-semibold leading-tight text-gray-800'>
                    Listas
                </h2>
                </div>
            }>
            <Head title='Listas' />
            <div className="p-6 max-w-4xl mx-auto">
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
                <h1 className="text-3xl font-bold mb-4"> Minhas Listas</h1>

                <div className='flex gap-6 mb-6'>
                    <div className='bg-blue-100 text-blue-800 px-4 py-2 rounded-lg'>Total de tarefas : {totalTasks}</div>
                    <div className='bg-red-100 text-red-800 px-4 py-2 rounded-lg
                '>Tarefas pendentes: {pendingTasks}</div>
                </div>

                <button onClick={openCreate}
                    className='inline-block mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition'> Criar lista nova</button>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {taskLists?.data?.map(list => (
                        <div key={list.id} className='bg-white shadow rounded-xl p-4 border-l-4'
                            style={{ borderColor: list.color || '#3b82f6' }}>
                            <h2 className='text-xl font-se' >{list.name}</h2>
                            <p className='text-gray-600'>{' '}({list.tasks_count} pendentes)</p>


                            <div className='flex gap-1 mt-3'>
                                <Link href={route('tasklists.show', list.id)} className='bg-blue-600 text-white px-2 py-1 rounded '> Ver lista </Link>

                                <button type='button' onClick={() => openEdit(list)} className='bg-yellow-600 text-white px-1 py-1 rounded '> Editar lista </button>

                                <button className='bg-red-600 rounded text-white px-2 py-1  '
                                    onClick={() => {
                                        if (confirm('Excluir lista? ')) {
                                            router.delete(route('tasklists.destroy', list.id));
                                        }
                                    }}>
                                    Excluir
                                </button>
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