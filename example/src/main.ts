

import { client , router } from "../../build/index";



const c = new client.Client();
c.listenPacket(async(conn,packet)=>{
    console.log(packet);
});

setInterval(()=>{
    c.send(router.ExampleHandler.name , {name:'123'});
},2000);

