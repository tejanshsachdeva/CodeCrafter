import { useFileSystem } from "@/context/FileContext";
import { getIconClassName } from "@/utils/getIconClassName";
import { Icon } from "@iconify/react";
import { IoClose } from "react-icons/io5";
import cn from "classnames";
import { useEffect, useRef } from "react";
import customMapping from "@/utils/customMapping";
import { useSettings } from "@/context/SettingContext";
import langMap from "lang-map";

function FileTab() {
    const {
        openFiles,
        closeFile,
        activeFile,
        updateFileContent,
        setActiveFile,
    } = useFileSystem();
    const fileTabRef = useRef<HTMLDivElement>(null);
    const { setLanguage } = useSettings();

    const changeActiveFile = (fileId: string) => {
        if (activeFile?.id !== fileId) {
            updateFileContent(activeFile?.id || "", activeFile?.content || "");

            const file = openFiles.find((file) => file.id === fileId);
            if (file) {
                setActiveFile(file);
            }
        }
    };

    useEffect(() => {
        const handleScroll = (e: WheelEvent) => {
            if (fileTabRef.current) {
                fileTabRef.current.scrollLeft += e.deltaY > 0 ? 100 : -100;
            }
        };

        const fileTabNode = fileTabRef.current;
        fileTabNode?.addEventListener("wheel", handleScroll);

        return () => {
            fileTabNode?.removeEventListener("wheel", handleScroll);
        };
    }, []);

    useEffect(() => {
        if (activeFile?.name) {
            const extension = activeFile.name.split(".").pop();
            if (extension) {
                setLanguage(customMapping[extension] || langMap.languages(extension)[0]);
            }
        }
    }, [activeFile?.name, setLanguage]);

    return (
        <div
            className="flex h-[50px] w-full select-none gap-2 overflow-x-auto p-2 pb-0"
            ref={fileTabRef}
        >
            {openFiles.map((file) => (
                <span
                    key={file.id}
                    className={cn(
                        "flex w-fit cursor-pointer items-center rounded-t-md px-2 py-1 text-white",
                        { "bg-darkHover": file.id === activeFile?.id },
                    )}
                    onClick={() => changeActiveFile(file.id)}
                >
                    <Icon
                        icon={getIconClassName(file.name)}
                        fontSize={22}
                        className="mr-2 min-w-fit"
                    />
                    <p
                        className="flex-grow cursor-pointer overflow-hidden truncate"
                        title={file.name}
                    >
                        {file.name}
                    </p>
                    <IoClose
                        className="ml-3 inline rounded-md hover:bg-darkHover"
                        size={20}
                        onClick={(e) => {
                            e.stopPropagation();
                            closeFile(file.id);
                        }}
                    />
                </span>
            ))}
        </div>
    );
}

export default FileTab;
