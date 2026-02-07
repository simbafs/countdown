import { useEffect } from "react";
import useWebSocket from "react-use-websocket";


export function useWebsocket(url: string, handler: (tag: string, payload: any) => boolean) {
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(url);

    useEffect(() => {
        if (lastJsonMessage) {
            const { tag, payload } = lastJsonMessage as any;
            if (!handler(tag, payload)) {
                console.warn(`Unhandled websocket message: ${tag}: ${JSON.stringify(payload, null, 2)}`);
            }
        }
    }, [lastJsonMessage, handler]);

    return {
        send: sendJsonMessage,
        readyState,
    }

}
