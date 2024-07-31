import React, { useCallback, useMemo } from 'react';
import Users from "@/components/common/Users"
import { useAppContext } from "@/context/AppContext"
import { useSocket } from "@/context/SocketContext"
import useResponsive from "@/hooks/useResponsive"
import { USER_STATUS } from "@/types/user"
import toast from "react-hot-toast"
import { GoSignOut } from "react-icons/go"
import { IoShareOutline } from "react-icons/io5"
import { LuCopy } from "react-icons/lu"
import { useNavigate } from "react-router-dom"

const useURLActions = () => {
    const copyURL = useCallback(async () => {
        const url = window.location.href
        try {
            await navigator.clipboard.writeText(url)
            toast.success("URL copied to clipboard")
        } catch (error) {
            toast.error("Unable to copy URL to clipboard")
            console.error(error)
        }
    }, [])

    const shareURL = useCallback(async () => {
        const url = window.location.href
        try {
            await navigator.share({ url })
        } catch (error) {
            toast.error("Unable to share URL")
            console.error(error)
        }
    }, [])

    return { copyURL, shareURL }
}

const UsersView = React.memo(function UsersView() {
    const navigate = useNavigate()
    const { viewHeight } = useResponsive()
    const { setStatus } = useAppContext()
    const { socket } = useSocket()
    const { copyURL, shareURL } = useURLActions()

    const leaveRoom = useCallback(() => {
        socket.disconnect()
        setStatus(USER_STATUS.DISCONNECTED)
        navigate("/", {
            replace: true,
        })
    }, [socket, setStatus, navigate])

    const buttons = useMemo(() => [
        { onClick: shareURL, title: "Share Link", icon: <IoShareOutline size={26} />, className: "bg-white text-black" },
        { onClick: copyURL, title: "Copy Link", icon: <LuCopy size={22} />, className: "bg-white text-black" },
        { onClick: leaveRoom, title: "Leave room", icon: <GoSignOut size={22} />, className: "bg-primary text-black" },
    ], [shareURL, copyURL, leaveRoom])

    return (
        <div className="flex flex-col p-4" style={{ height: viewHeight }}>
            <h1 className="view-title">Users</h1>
            <Users />
            <div className="flex flex-col items-center gap-4 pt-4">
                <div className="flex w-full gap-4">
                    {buttons.map((button, index) => (
                        <button
                            key={index}
                            className={`flex flex-grow items-center justify-center rounded-md p-3 ${button.className}`}
                            onClick={button.onClick}
                            title={button.title}
                        >
                            {button.icon}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
})

export default UsersView