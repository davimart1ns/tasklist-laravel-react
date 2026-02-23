import {
    ListBulletIcon,
    PlusIcon,
}from "@heroicons/react/24/solid"

export default function HeaderStats({openCreate, totalTasks, pendingTasks}) {
    return (
        <div className='mb-6 p-4 bg-white rounded-lg shadow-md border border-gray-100'>
            <div className='flex flex-col md:flex md>items-center md:justify-between gap-4'>
                <div className='flex items-center gap-3'>
                    <div className='p-2 bg-blue-100 rounded-lg'>
                        <ListBulletIcon className='w-7 h-8 text-blue-600' />
                    </div>

                    <div>
                        <h1 className=' text-3xl font-bold text-gray-900 '> Minhas listas</h1>
                        <p className='text-sm text-gray-500'>
                            Gerencie suas listas de forma organizada
                        </p>
                    </div>

                    <button
                        onClick={openCreate}
                        className="ml-auto inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600  bg-green-600 text-white px-5 py-3 rounded-lg shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium"
                    >
                        <PlusIcon className='w-5 h-5' /> Nova lista
                    </button>
                </div>
            </div>


            <div className='flex flex-wrap gap-3 mt-5'>
                <span className='px-3 py-2 bg-blue-100 text-blue-800 rounded-lg'>Total de tarefas : {totalTasks}</span>
                <span className='bg-red-100 text-red-800 px-3 py-2 rounded-lg
                '>Tarefas pendentes: {pendingTasks}</span>
            </div>

        </div>
    )
}