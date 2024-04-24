import { router } from "../../build/index";
const r = new router.Router();
r.addHandler(new router.ExampleHandler())
r.run();