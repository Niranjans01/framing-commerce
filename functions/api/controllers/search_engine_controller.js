const express = require("express");
const router = express.Router();
const wrap = require("./async_route_wrapper");
const { searchService } = require("../../search_engine/search_engine_instance")
const { productRepo } = require("../../db/repo_instances");

const validate = require("../../helpers/validate");
const searchEngineSchema = require("../schema/search_engine");

//function for enabling search
router.get("/product", validate(searchEngineSchema), wrap(async (req) => {

    eventsData = await productRepo.find(req.ctx, req);
    let text_search = req.query.text_search;
    if (
        text_search !== "" &&
        text_search !== "null" &&
        text_search !== "undefined" &&
        text_search !== null &&
        text_search !== undefined
    ) {
        if (eventsData.length !== 0) {
            eventsData = searchService.textSearch(eventsData.products, text_search, [
                "category",
                "displayName",
                "fullDescription",
                "shortDescription",
                "tags"
            ]);
        }

    }
    return eventsData

}));

module.exports = router;
