export default function TaskModal({
    isOpen,
    onClose,
    editingTask,
    data,
    setData,
    submit,
    errors,
    processing,
}) {
    if (!isOpen) return null

    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose} />

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
                        onClick={onClose}
                        className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all font-medium disabled:opacity-50">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    </div>)
}