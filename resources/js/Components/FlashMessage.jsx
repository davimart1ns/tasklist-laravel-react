export default function FlashMessage({
    showSuccess,
    setShowSuccess,
    successMessage,

}) {
    if (!showSuccess) return null

    return (
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
    )
}