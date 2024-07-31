import React, { FormEvent, useCallback, useEffect, useRef, useState } from "react"
import { useFileSystem } from "@/context/FileContext"
import toast from "react-hot-toast"

interface RenameViewProps {
    id: string
    preName: string
    type: "file" | "directory"
    setEditing: (isEditing: boolean) => void
}

const RenameView: React.FC<RenameViewProps> = React.memo(({ id, preName, setEditing, type }) => {
    const [name, setName] = useState<string>(preName || "")
    const { renameFile, openFile, renameDirectory } = useFileSystem()
    const formRef = useRef<HTMLFormElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1)

    const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()

        if (name === "") {
            toast.error(`${capitalizedType} name cannot be empty`)
        } else if (name.length > 25) {
            toast.error(`${capitalizedType} name cannot be longer than 25 characters`)
        } else if (name === preName) {
            toast.error(`${capitalizedType} name cannot be the same as before`)
        } else {
            const isRenamed = type === "directory" ? renameDirectory(id, name) : renameFile(id, name)

            if (isRenamed && type === "file") {
                openFile(id)
            }
            if (!isRenamed) {
                toast.error(`${capitalizedType} with same name already exists`)
            } else {
                setEditing(false)
            }
        }
    }, [name, preName, type, capitalizedType, id, renameDirectory, renameFile, openFile, setEditing])

    const handleFormKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "Enter") {
            formRef.current?.requestSubmit()
        } else if (e.key === "Escape") {
            setEditing(false)
        }
    }, [setEditing])

    const handleDocumentEvent = useCallback((e: MouseEvent | KeyboardEvent) => {
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
            setEditing(false)
        }
    }, [setEditing])

    useEffect(() => {
        const formNode = formRef.current
        if (!formNode) return

        formNode.addEventListener("keydown", handleFormKeyDown)
        document.addEventListener("keydown", handleDocumentEvent)
        document.addEventListener("click", handleDocumentEvent)

        inputRef.current?.focus()

        return () => {
            formNode.removeEventListener("keydown", handleFormKeyDown)
            document.removeEventListener("keydown", handleDocumentEvent)
            document.removeEventListener("click", handleDocumentEvent)
        }
    }, [handleFormKeyDown, handleDocumentEvent])

    return (
        <div className="rounded-md">
            <form
                onSubmit={handleSubmit}
                ref={formRef}
                className="flex w-full items-center gap-2 rounded-md"
            >
                <input
                    ref={inputRef}
                    type="text"
                    className="w-full flex-grow rounded-sm bg-dark px-2 text-base text-white outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </form>
        </div>
    )
})

export default RenameView