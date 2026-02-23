import {
    DocumentTextIcon, 
    PlusIcon,
} from "@heroicons/react/24/solid"

export default function EmptyStates({openCreate, name})
{
    return (
         <div className='text-center py-14 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200'>
                            <DocumentTextIcon className='w-16 h-16 text-gray-300 mx-auto mb-4' />
                            <p className='text-gray-500 text-lg'>Nenhuma {name} ainda</p>
                            <button onClick={openCreate}
                                className='mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium'>
                                <PlusIcon className='h-5 w-5' />Criar a primeira {name}</button>
                        </div>
    )

}