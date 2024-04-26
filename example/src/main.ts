

import { client , router ,utils} from "../../build/index";



const c = new client.Client();
c.listenPacket(async(packet)=>{
    // console.log(packet);
});

setInterval(async ()=>{
    const packet = await c.send(router.ExampleHandler.name , {name:'123'});
    console.log(packet);
},2000);

// const c = new client.Client();
// c.listenPacket(async(packet)=>{
//     console.log(packet);
// });

// setInterval(()=>{
//     c.shot(router.ProxyExampleHandler.name , {name:'123'});
// },2000);
