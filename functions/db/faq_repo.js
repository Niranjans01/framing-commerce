const shortid = require("shortid");
const {
    NotFoundException, BadRequestException
} = require("../requests/exceptions");

const Requests = require("../requests/requests");

class Faq {
    constructor(
        id,
        displayName,
        description,
        createdBy,
        createdOn,
        isDeleted,
        lastUpdatedBy,
        lastUpdatedOn
    ) {
        this.id = id;
        this.displayName = displayName;
        this.description = description;
        this.createdBy = createdBy;
        this.createdOn = createdOn;
        this.isDeleted = isDeleted;
        this.lastUpdatedBy = lastUpdatedBy;
        this.lastUpdatedOn = lastUpdatedOn
    }
}

class CreateFaqRequest {
    constructor(
        displayName,
        description,
    ) {
        this.displayName = Requests.checkInstance(displayName, "displayName", "string");
        this.description = Requests.checkInstance(description, "description", "string");

    }
}

class CreateFaqResponse {
    constructor(faq) {
        this.faq = faq;
    }
}

class UpdateFaqRequest {
    constructor(
        id,
        displayName,
        description,
        isDeleted,
    ) {
        this.id = Requests.checkInstance(id, "id", "string");
        this.displayName = Requests.checkInstance(displayName, "displayName", "string");
        this.description = Requests.checkInstance(description, "description", "string");
        this.isDeleted = Requests.checkInstance(isDeleted, "isDeleted", "boolean");
    }
}

class UpdateFaqResponse {
    constructor(faq) {
        this.faq = faq;
    }
}

class GetFaqByIdRequest {
    constructor(id) {
        this.id = Requests.checkInstance(id, "id", "string");
    }
}

class GetFaqByIdResponse {
    constructor(faq) {
        this.faq = faq;
    }
}

class FindFaqRequest {
    constructor() {
    }
}

class FindFaqResponse {
    constructor(faq) {
        this.faq = faq;
    }
}

class FaqRepo {
    constructor(db) {
        this.db = db;
        this.collection = db.collection("faqs");
    }

    async create(ctx, req) {

        return await this.db.runTransaction(async (t) => {

            const id = shortid.generate();
            const docRef = this.collection.doc(id);

            const data = {
                displayName: req.displayName,
                description: req.description,
                createdBy: ctx.user.id || "",
                createdOn: new Date(),
                lastUpdatedOn: new Date(),
                isDeleted: false,
                lastUpdatedBy:ctx.user.id || "",

            };

            t.create(docRef, data);

            return new CreateFaqResponse(
                new Faq(
                    id,
                    data.displayName,
                    data.description,
                    data.createdBy,
                    data.createdOn,
                    data.isDeleted,
                    data.lastUpdatedBy,
                    data.lastUpdatedOn
                ),
            );
        });
    }



    async get(req) {
        const docRef = this.collection.doc(req.id);
        const doc = await docRef.get();
        const data = doc.data();
        if (!data) {
            throw new NotFoundException(`Document with id not found: ${req.id}`);
        }

        return new GetFaqByIdResponse(
            new Faq(
                doc.id,
                data.displayName,
                data.description,
                data.createdBy,
                data.createdOn,
                data.isDeleted,
                data.lastUpdatedBy,
                data.lastUpdatedOn
            ),
        );
    }

    async find(req) {
        const snapshot = await this.collection.get();
        const result = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            result.push(new Faq(
                doc.id,
                data.displayName,
                data.description,
                data.createdBy,
                data.createdOn,
                data.isDeleted,
                data.lastUpdatedBy,
                data.lastUpdatedOn,
            ));
        });

        return new FindFaqResponse(result);
    }

    async update(ctx, req) {


        const docRef = this.collection.doc(req.id);
        return await this.db.runTransaction(async (t) => {
            const doc = await t.get(docRef);
            const data = doc.data();
            if (!data) {
                throw new NotFoundException(`Document with id not found: ${req.id}`);
            }
            let flag = 0;
            if (req.displayName !== undefined) {
                data.displayName = req.displayName;
                flag = 1;
            }
            if (req.description !== undefined) {
                data.description = req.description;
                flag = 1;
            }
            if (req.isDeleted !== undefined) {
                data.isDeleted = req.isDeleted;
                flag = 1;
            }
            if (flag === 1) {
                data.lastUpdatedOn = new Date()
                data.lastUpdatedBy = ctx.user.id || "";
            }
            t.update(docRef, data);
            return new UpdateFaqResponse(
                new Faq(
                    doc.id,
                    data.displayName,
                    data.description,
                    data.createdBy,
                    data.createdOn,
                    data.isDeleted,
                    data.lastUpdatedBy,
                    data.lastUpdatedOn,
                ),
            );
        });

    }
}

module.exports = {
    CreateFaqRequest,
    CreateFaqResponse,
    UpdateFaqRequest,
    UpdateFaqResponse,
    GetFaqByIdRequest,
    GetFaqByIdResponse,
    FindFaqRequest,
    FindFaqResponse,
    FaqRepo,
};
