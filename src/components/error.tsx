interface Params {
    error: string;
}

export default function ReceiptError({
    error
}: Params) {
    return (
        <div className="max-w-[440px] border bg-[#f9f9f9] mx-auto my-3 mb-0 p-5 rounded-[5px] border-solid border-[#ccc]">
            <p>{error}</p>
        </div>
    )
}