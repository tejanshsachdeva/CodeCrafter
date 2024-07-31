import { FileSystemItem, Id } from "@/types/file";
import { v4 as uuidv4 } from "uuid";

const initialCode = `const num1 = 5;
const num2 = 3;

// add two numbers
const sum = num1 + num2;

// display the sum
console.log('The sum of ' + num1 + ' and ' + num2 + ' is: ' + sum);`;

export const initialFileStructure: FileSystemItem = {
    name: "root",
    id: uuidv4(),
    type: "directory",
    children: [
        {
            id: uuidv4(),
            type: "file",
            name: "index.js",
            content: initialCode,
        },
    ],
};

export const findParentDirectory = (
    directory: FileSystemItem,
    parentDirId: Id,
): FileSystemItem | null => {
    if (directory.id === parentDirId && directory.type === "directory") {
        return directory;
    }

    if (directory.type === "directory" && directory.children) {
        for (const child of directory.children) {
            const found = findParentDirectory(child, parentDirId);
            if (found) {
                return found;
            }
        }
    }

    return null;
};

export const isFileExist = (parentDir: FileSystemItem, name: string): boolean => {
    return parentDir.children ? parentDir.children.some((file) => file.name === name) : false;
};

export const getFileById = (
    fileStructure: FileSystemItem,
    fileId: Id,
): FileSystemItem | null => {
    const findFile = (directory: FileSystemItem): FileSystemItem | null => {
        if (directory.id === fileId) {
            return directory;
        }
        if (directory.children) {
            for (const child of directory.children) {
                const found = findFile(child);
                if (found) {
                    return found;
                }
            }
        }
        return null;
    };

    return findFile(fileStructure);
};

export const sortFileSystemItem = (item: FileSystemItem): FileSystemItem => {
    if (item.type === "directory" && item.children) {
        const directories = item.children.filter((child) => child.type === "directory").map(sortFileSystemItem);
        const files = item.children.filter((child) => child.type === "file");

        directories.sort((a, b) => a.name.localeCompare(b.name));
        files.sort((a, b) => a.name.localeCompare(b.name));

        item.children = [
            ...directories.filter((dir) => dir.name.startsWith(".")),
            ...directories.filter((dir) => !dir.name.startsWith(".")),
            ...files.filter((file) => file.name.startsWith(".")),
            ...files.filter((file) => !file.name.startsWith(".")),
        ];
    }

    return item;
};
