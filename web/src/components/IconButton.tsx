import classNames from "classnames";
import { ReactNode } from "react";

type IconButtonProps = {
    icon: (active: boolean) => ReactNode
    active: boolean
    onClick?: () => void
}

function IconButton({ icon, active, onClick }: IconButtonProps) {
    return (
        <div onClick={onClick} className={classNames('w-min border text-white border-cyan-600 cursor-pointer p-2 rounded-full', { "bg-my-cyan-600": active })}>
            {icon(active)}
        </div>
    );
}

export default IconButton;