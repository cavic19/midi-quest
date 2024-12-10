import { useMemo } from "react"
import HasClassname from "../types/HasClassname"
import classNames from "classnames"

type TimerBarProps = {
    // In seconds
    maxTime: number
    time: number
} & HasClassname

function TimerBar({ maxTime, time, className }: TimerBarProps) {
    const percentRemaining = useMemo(() => maxTime ? time / maxTime * 100 : 0, [maxTime, time])

    return (
        <div className={classNames("h-3 bg-my-cyan-500 border border-my-cyan-500", className)}>
            <div className="h-full bg-my-cyan-400" style={{ width: `${percentRemaining}%` }} />
        </div>
    )
}

export default TimerBar;