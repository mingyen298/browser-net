

import { Client } from "../../build/index";



const client = new Client();
client.listenPacket(async(conn,packet)=>{
    console.log(packet);
});

setInterval(()=>{
    client.send({name:'123'});
},2000);

