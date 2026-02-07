import { useEffect } from "react";
import useWebSocket from "react-use-websocket";


export function useWebsocket(url: string, handler: (event: string, data: any) => boolean) {
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(url);

    useEffect(() => {
        if (lastJsonMessage) {
            const { tag, payload } = lastJsonMessage as any;
            if (tag === 'runtime-data') {
                for (const [event, data] of Object.entries(payload)) {
                    const handled = handler(event, data);
                    if (!handled) {
                        console.warn(`Unhandled event of ${tag}: ${event}`, data);
                    }
                }
            } else {
                console.info(`Received message with tag: ${tag}`, payload);
            }
        }
    }, [lastJsonMessage, handler]);

    return {
        send: sendJsonMessage,
        readyState,
    }

}
