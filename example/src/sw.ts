import { router } from "../../build/index";

const r = new router.Router();
r.addHandler(new router.ExampleHandler())
r.run();


// const r = new router.ProxyRouter();
// r.addHandler(new router.ProxyExampleHandler())
// r.run();