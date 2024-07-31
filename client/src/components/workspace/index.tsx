import { useAppContext } from "@/context/AppContext"
import useResponsive from "@/hooks/useResponsive"
import { ACTIVITY_STATE } from "@/types/app"
import { lazy, Suspense, useMemo } from 'react'

const DrawingEditor = lazy(() => import("../drawing/DrawingEditor"))
const EditorComponent = lazy(() => import("../editor/EditorComponent"))

function WorkSpace() {
    const { viewHeight } = useResponsive()
    const { activityState } = useAppContext()

    const ActiveComponent = useMemo(() => 
        activityState === ACTIVITY_STATE.DRAWING ? DrawingEditor : EditorComponent,
    [activityState])

    return (
        <div
            className="absolute left-0 top-0 w-full max-w-full flex-grow overflow-x-hidden md:static"
            style={{ height: viewHeight }}
        >
            <Suspense fallback={<div>Loading...</div>}>
                <ActiveComponent />
            </Suspense>
        </div>
    )
}

export default WorkSpace