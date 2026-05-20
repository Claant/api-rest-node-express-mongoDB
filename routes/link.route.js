import {Router} from "express";
import { createLink, getLinks } from "../controllers/link. controller.js";
import { requireToken } from "../middlewares/requireToken.js";

const router = Router();


// GET          /api/v1/Links              all Links
// GET          /api/v1/Links/:id          single Link
// POST         /api/v1/Links              create Link
// PATCH/PUT    /api/v1/Links/:id          update Link
// DELETE       /api/v1/Links/:id          remove Link


router.get('/', requireToken, getLinks)

router.post('/', requireToken, createLink)




export default router;