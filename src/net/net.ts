import { ConnectionBase, Connection , ConnectionWebsocket } from "./connection";


export function Dial(): ConnectionBase {

    const port = chrome.runtime.connect({ name: Math.random().toString(16).substring(2, 16) });
    return new Connection(port);
}


export function Listen(callback: (conn: ConnectionBase) => void) {
    function processConnection(port: chrome.runtime.Port) {
        callback(new Connection(port));
    }
    chrome.runtime.onUserScriptConnect.addListener(processConnection);
    chrome.runtime.onConnect.addListener(processConnection);

}

export {ConnectionBase, Connection , ConnectionWebsocket}
