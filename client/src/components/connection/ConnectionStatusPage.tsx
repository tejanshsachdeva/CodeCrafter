import { useNavigate } from "react-router-dom"

const ConnectionError = () => {
    const navigate = useNavigate()

    return (
        <>
            <span className="whitespace-break-spaces text-lg font-medium text-slate-300">
                Oops! Something went wrong. Please try again
            </span>
            <div className="flex flex-wrap justify-center gap-4">
                <button
                    className="rounded-md bg-primary px-8 py-2 font-bold text-black"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
                <button
                    className="rounded-md bg-primary px-8 py-2 font-bold text-black"
                    onClick={() => navigate("/")}
                >
                    Go to HomePage
                </button>
            </div>
        </>
    )
}

function ConnectionStatusPage() {
    return (
        <div className="flex h-screen min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
            <ConnectionError />
        </div>
    )
}

export default ConnectionStatusPage