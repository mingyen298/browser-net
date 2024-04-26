import { uuid } from "../utils";
import { ConnectionBase, Connection , ConnectionWebsocket } from "./connection";
// import * as uuid from 'uuid';
export function Dial(): ConnectionBase {

    // const port = chrome.runtime.connect({ name: Math.random().toString(16).substring(2, 16) });
    const port = chrome.runtime.connect({ name: uuid()});
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
