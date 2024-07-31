import React, { useCallback, useMemo, useEffect } from 'react';
import Select from "@/components/common/Select"
import { useSettings } from "@/context/SettingContext"
import useResponsive from "@/hooks/useResponsive"
import { editorFonts } from "@/resources/Fonts"
import { editorThemes } from "@/resources/Themes"
import { langNames } from "@uiw/codemirror-extensions-langs"

const FONT_SIZES = [...Array(13).keys()].map(size => size + 12);

const SettingsView: React.FC = React.memo(() => {
    const {
        theme,
        setTheme,
        language,
        setLanguage,
        fontSize,
        setFontSize,
        fontFamily,
        setFontFamily,
        resetSettings,
    } = useSettings()
    const { viewHeight } = useResponsive()

    const handleFontFamilyChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) =>
        setFontFamily(e.target.value), [setFontFamily])
    
    const handleThemeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) =>
        setTheme(e.target.value), [setTheme])
    
    const handleLanguageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) =>
        setLanguage(e.target.value), [setLanguage])
    
    const handleFontSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) =>
        setFontSize(parseInt(e.target.value)), [setFontSize])

    useEffect(() => {
        const editor = document.querySelector(".cm-editor > .cm-scroller") as HTMLElement
        if (editor) {
            editor.style.fontFamily = `${fontFamily}, monospace`
        }
    }, [fontFamily])

    const selectProps = useMemo(() => [
        { onChange: handleFontFamilyChange, value: fontFamily, options: editorFonts, title: "Font Family" },
        { onChange: handleThemeChange, value: theme, options: Object.keys(editorThemes), title: "Theme" },
        { onChange: handleLanguageChange, value: language, options: langNames, title: "Language" },
    ], [handleFontFamilyChange, fontFamily, handleThemeChange, theme, handleLanguageChange, language])

    return (
        <div className="flex flex-col items-center gap-2 p-4" style={{ height: viewHeight }}>
            <h1 className="view-title">Settings</h1>
            <div className="flex w-full items-end gap-2">
                <Select {...selectProps[0]} />
                <select
                    value={fontSize}
                    onChange={handleFontSizeChange}
                    className="rounded-md border-none bg-darkHover px-4 py-2 text-white outline-none"
                    title="Font Size"
                >
                    {FONT_SIZES.map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>
            <Select {...selectProps[1]} />
            <Select {...selectProps[2]} />
            <button
                className="mt-auto w-full rounded-md border-none bg-darkHover px-4 py-2 text-white outline-none"
                onClick={resetSettings}
            >
                Default Setting
            </button>
        </div>
    )
})

export default SettingsView