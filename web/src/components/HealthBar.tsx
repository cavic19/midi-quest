import { Heart } from "@phosphor-icons/react"
import classNames from "classnames"

type HealthBarProps = {
    maxHealth: number
    health: number
}

function HealthBar({ maxHealth, health }: HealthBarProps) {
    return (
        <div className="flex gap-1">
            {new Array(maxHealth).fill(null).map((_, i) => (
                <Heart weight="fill" size={24} className={classNames({ "text-my-pink-200": i < health, "text-my-cyan-500": i >= health })} />
            ))}
        </div>
    )
}

export default HealthBar;