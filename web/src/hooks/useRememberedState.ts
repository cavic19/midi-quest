import { useCallback, useEffect, useState } from "react";

function useRememberedState<S>(key: string, parser: (data: string) => S = JSON.parse): [S | undefined, (_: S | undefined) => void] {
    const [state, setState] =  useState<S>();

    useEffect(() => {
        const maybeItem = localStorage.getItem(key)
        if (maybeItem) {
            return setState(parser(maybeItem));
        } else {
            return setState(undefined);
        }

    }, [key]);

    const setter = useCallback((newValue: S | undefined | null) => {
        if (newValue === undefined || newValue == null) {
            localStorage.removeItem(key);
            setState(undefined);
        } else {
            localStorage.setItem(key, JSON.stringify(newValue));
            setState(newValue);
        }

    }, [key]);

    return [state, setter]
}

export default useRememberedState;