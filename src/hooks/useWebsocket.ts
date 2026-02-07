import { useEffect } from "react";
import useWebSocket from "react-use-websocket";


interface WebsocketOptions {
    ignoreOtherTags?: boolean;
    ignoreUnhandledEvents?: boolean;
    onMessage?: (tag: string, payload: any) => void;
}

export function useWebsocket(url: string, handler: (event: string, data: any) => boolean, options: WebsocketOptions = {}) {
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(url);

    useEffect(() => {
        if (lastJsonMessage) {
            const { tag, payload } = lastJsonMessage as any;
            
            // Call the onMessage callback if provided (for debug page)
            if (options.onMessage) {
                options.onMessage(tag, payload);
            }
            
            if (tag === 'runtime-data') {
                for (const [event, data] of Object.entries(payload)) {
                    const handled = handler(event, data);
                    if (!handled && !options.ignoreUnhandledEvents) {
                        console.warn(`Unhandled event of ${tag}: ${event}`, data);
                    }
                }
            } else if (!options.ignoreOtherTags) {
                console.info(`Received message with tag: ${tag}`, payload);
            }
        }
    }, [lastJsonMessage, handler, options.ignoreOtherTags, options.ignoreUnhandledEvents, options.onMessage]);

    return {
        send: sendJsonMessage,
        readyState,
    }

}
