import React, { MouseEvent, useEffect, useRef, useState, useCallback, useMemo } from "react"
import { useAppContext } from "@/context/AppContext"
import { useFileSystem } from "@/context/FileContext"
import { useViews } from "@/context/ViewContext"
import { useContextMenu } from "@/hooks/useContextMenu"
import useWindowDimensions from "@/hooks/useWindowDimensions"
import { ACTIVITY_STATE } from "@/types/app"
import { FileSystemItem, Id } from "@/types/file"
import { sortFileSystemItem } from "@/utils/file"
import { getIconClassName } from "@/utils/getIconClassName"
import { Icon } from "@iconify/react"
import cn from "classnames"
import { AiOutlineFolder, AiOutlineFolderOpen } from "react-icons/ai"
import { MdDelete } from "react-icons/md"
import { PiPencilSimpleFill } from "react-icons/pi"
import {
    RiFileAddLine,
    RiFolderAddLine,
    RiFolderUploadLine,
} from "react-icons/ri"
import RenameView from "./RenameView"
import useResponsive from "@/hooks/useResponsive"

function FileStructureView() {
    const { fileStructure, createFile, createDirectory, collapseDirectories } = useFileSystem()
    const explorerRef = useRef<HTMLDivElement | null>(null)
    const [selectedDirId, setSelectedDirId] = useState<Id | null>(null)
    const { minHeightReached } = useResponsive()

    const handleClickOutside = useCallback((e: MouseEvent) => {
        if (explorerRef.current && !explorerRef.current.contains(e.target as Node)) {
            setSelectedDirId(fileStructure.id)
        }
    }, [fileStructure.id])

    const handleCreateFile = useCallback(() => {
        const fileName = prompt("Enter file name")
        if (fileName) {
            const parentDirId: Id = selectedDirId || fileStructure.id
            createFile(parentDirId, fileName)
        }
    }, [selectedDirId, fileStructure.id, createFile])

    const handleCreateDirectory = useCallback(() => {
        const dirName = prompt("Enter directory name")
        if (dirName) {
            const parentDirId: Id = selectedDirId || fileStructure.id
            createDirectory(parentDirId, dirName)
        }
    }, [selectedDirId, fileStructure.id, createDirectory])

    const sortedFileStructure = useMemo(() => sortFileSystemItem(fileStructure), [fileStructure])

    return (
        <div onClick={handleClickOutside} className="flex flex-grow flex-col">
            <div className="view-title flex justify-between">
                <h2>Files</h2>
                <div className="flex gap-2">
                    <button
                        className="rounded-md px-1 hover:bg-darkHover"
                        onClick={handleCreateDirectory}
                        title="Create Folder"
                    >
                        <RiFolderAddLine size={20} />
                    </button>
                    <button
                        className="rounded-md px-1 hover:bg-darkHover"
                        onClick={handleCreateFile}
                        title="Create File"
                    >
                        <RiFileAddLine size={20} />
                    </button>
                    <button
                        className="rounded-md px-1 hover:bg-darkHover"
                        onClick={collapseDirectories}
                        title="Collapse"
                    >
                        <RiFolderUploadLine size={20} />
                    </button>
                </div>
            </div>
            <div
                className={cn(
                    "min-h-[200px] flex-grow overflow-auto pr-2 sm:min-h-0",
                    {
                        "h-[calc(80vh-170px)]": !minHeightReached,
                        "h-[85vh]": minHeightReached,
                    },
                )}
                ref={explorerRef}
            >
                {sortedFileStructure.children &&
                    sortedFileStructure.children.map((item) => (
                        <Directory
                            key={item.id}
                            item={item}
                            setSelectedDirId={setSelectedDirId}
                        />
                    ))}
            </div>
        </div>
    )
}

const Directory = React.memo(function Directory({
    item,
    setSelectedDirId,
}: {
    item: FileSystemItem
    setSelectedDirId: (id: Id) => void
}) {
    const [isEditing, setEditing] = useState<boolean>(false)
    const dirRef = useRef<HTMLDivElement | null>(null)
    const { coords, menuOpen, setMenuOpen } = useContextMenu({ ref: dirRef })
    const { deleteDirectory, toggleDirectory } = useFileSystem()

    const handleDirClick = useCallback(() => {
        setSelectedDirId(item.id)
        toggleDirectory(item.id)
    }, [item.id, setSelectedDirId, toggleDirectory])

    const handleRenameDirectory = useCallback((e: MouseEvent) => {
        e.stopPropagation()
        setMenuOpen(false)
        setEditing(true)
    }, [setMenuOpen])

    const handleDeleteDirectory = useCallback((e: MouseEvent) => {
        e.stopPropagation()
        setMenuOpen(false)
        const isConfirmed = confirm(`Are you sure you want to delete directory?`)
        if (isConfirmed) {
            deleteDirectory(item.id)
        }
    }, [deleteDirectory, item.id, setMenuOpen])

    useEffect(() => {
        const dirNode = dirRef.current
        if (!dirNode) return

        dirNode.tabIndex = 0
        const handleF2 = (e: KeyboardEvent) => {
            e.stopPropagation()
            if (e.key === "F2") {
                setEditing(true)
            }
        }
        dirNode.addEventListener("keydown", handleF2)
        return () => {
            dirNode.removeEventListener("keydown", handleF2)
        }
    }, [])

    if (item.type === "file") {
        return <File item={item} setSelectedDirId={setSelectedDirId} />
    }

    return (
        <div className="overflow-x-auto">
            <div
                className="flex w-full items-center rounded-md px-2 py-1 hover:bg-darkHover"
                onClick={handleDirClick}
                ref={dirRef}
            >
                {item.isOpen ? (
                    <AiOutlineFolderOpen size={24} className="mr-2 min-w-fit" />
                ) : (
                    <AiOutlineFolder size={24} className="mr-2 min-w-fit" />
                )}
                {isEditing ? (
                    <RenameView
                        id={item.id}
                        preName={item.name}
                        type="directory"
                        setEditing={setEditing}
                    />
                ) : (
                    <p
                        className="flex-grow cursor-pointer overflow-hidden truncate"
                        title={item.name}
                    >
                        {item.name}
                    </p>
                )}
            </div>
            <div
                className={cn(
                    { hidden: !item.isOpen },
                    { block: item.isOpen },
                    { "pl-4": item.name !== "root" },
                )}
            >
                {item.children &&
                    item.children.map((item) => (
                        <Directory
                            key={item.id}
                            item={item}
                            setSelectedDirId={setSelectedDirId}
                        />
                    ))}
            </div>

            {menuOpen && (
                <ContextMenu
                    handleDelete={handleDeleteDirectory}
                    handleRename={handleRenameDirectory}
                    left={coords.x}
                    top={coords.y}
                />
            )}
        </div>
    )
})

const File = React.memo(function File({
    item,
    setSelectedDirId,
}: {
    item: FileSystemItem
    setSelectedDirId: (id: Id) => void
}) {
    const { deleteFile, openFile } = useFileSystem()
    const [isEditing, setEditing] = useState<boolean>(false)
    const { setIsSidebarOpen } = useViews()
    const { isMobile } = useWindowDimensions()
    const { activityState, setActivityState } = useAppContext()
    const fileRef = useRef<HTMLDivElement | null>(null)
    const { menuOpen, coords, setMenuOpen } = useContextMenu({ ref: fileRef })

    const handleFileClick = useCallback(() => {
        if (isEditing) return
        setSelectedDirId(item.id)
        openFile(item.id)
        if (isMobile) {
            setIsSidebarOpen(false)
        }
        if (activityState === ACTIVITY_STATE.DRAWING) {
            setActivityState(ACTIVITY_STATE.CODING)
        }
    }, [isEditing, setSelectedDirId, item.id, openFile, isMobile, setIsSidebarOpen, activityState, setActivityState])

    const handleRenameFile = useCallback((e: MouseEvent) => {
        e.stopPropagation()
        setEditing(true)
        setMenuOpen(false)
    }, [setMenuOpen])

    const handleDeleteFile = useCallback((e: MouseEvent) => {
        e.stopPropagation()
        setMenuOpen(false)
        const isConfirmed = confirm(`Are you sure you want to delete file?`)
        if (isConfirmed) {
            deleteFile(item.id)
        }
    }, [deleteFile, item.id, setMenuOpen])

    useEffect(() => {
        const fileNode = fileRef.current
        if (!fileNode) return

        fileNode.tabIndex = 0
        const handleF2 = (e: KeyboardEvent) => {
            e.stopPropagation()
            if (e.key === "F2") {
                setEditing(true)
            }
        }
        fileNode.addEventListener("keydown", handleF2)
        return () => {
            fileNode.removeEventListener("keydown", handleF2)
        }
    }, [])

    return (
        <div
            className="flex w-full items-center rounded-md px-2 py-1 hover:bg-darkHover"
            onClick={handleFileClick}
            ref={fileRef}
        >
            <Icon
                icon={getIconClassName(item.name)}
                fontSize={22}
                className="mr-2 min-w-fit"
            />
            {isEditing ? (
                <RenameView
                    id={item.id}
                    preName={item.name}
                    type="file"
                    setEditing={setEditing}
                />
            ) : (
                <p
                    className="flex-grow cursor-pointer overflow-hidden truncate"
                    title={item.name}
                >
                    {item.name}
                </p>
            )}

            {menuOpen && (
                <ContextMenu
                    top={coords.y}
                    left={coords.x}
                    handleRename={handleRenameFile}
                    handleDelete={handleDeleteFile}
                />
            )}
        </div>
    )
})

const ContextMenu = React.memo(function ContextMenu({
    top,
    left,
    handleRename,
    handleDelete,
}: {
    top: number
    left: number
    handleRename: (e: MouseEvent) => void
    handleDelete: (e: MouseEvent) => void
}) {
    return (
        <div
            className="absolute z-10 w-[150px] rounded-md border border-darkHover bg-dark p-1"
            style={{ top, left }}
        >
            <button
                onClick={handleRename}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1 hover:bg-darkHover"
            >
                <PiPencilSimpleFill size={18} />
                Rename
            </button>
            <button
                onClick={handleDelete}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-danger hover:bg-darkHover"
            >
                <MdDelete size={20} />
                Delete
            </button>
        </div>
    )
})

export default FileStructureView