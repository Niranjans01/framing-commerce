const {
  NotFoundException, BadRequestException, ForbiddenAccessException
} = require("../requests/exceptions");

const admin = require("../firebase/admin");
const { userRepo } = require("../db/repo_instances");
const {
  GetUserByIdRequest
} = require("../db/user_repo");


async function verifyIdToken(idToken) {
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  const uid = decodedToken.uid;
  const { user } = await userRepo.get(new GetUserByIdRequest(uid));
  return {
    user: {
      id: user.id,
      isAdmin: user.isAdmin,
    }
  }
}

function extractRequestContext(req, res, next) {
  const idToken = req.get("masterframing-x-auth-token");
  if (idToken) {
    // verify id token
    verifyIdToken(idToken).then(ctx => {
      console.log("Context extracted: ", ctx);
      req.ctx = ctx;
      return next();
    }).catch(err => {
      console.log(err);
      next(new ForbiddenAccessException(`Failed to verify auth-token: ${idToken}`));
    })
    return;
  } else if (process.env.FUNCTIONS_EMULATOR) {
    req.ctx = {
      user: {
        id: null,
        isAdmin: true,
      }
    };
  } else {
    // anonymous user
    req.ctx = {
      user: null,
    };
  }
  next();
}

function enhanceContext(req, res, next) {
  req.ctx.isAdmin = () => {
    return req.ctx && req.ctx.user && req.ctx.user.isAdmin;
  };

  next();
}

function checkAdmin(req, res, next) {
  const ctx = req.ctx;
  if (!ctx || !ctx.user || !ctx.user.isAdmin) {
    next(new ForbiddenAccessException("Admin access only!"));
    return;
  }
  next();
}

function checkLoggedIn(req, res, next) {
  const ctx = req.ctx;
  if (!ctx || !ctx.user) {
    next(new ForbiddenAccessException("Must be logged in!"));
    return;
  }
  next();
}

module.exports = {
  enhanceContext,
  extractRequestContext,
  checkAdmin,
  checkLoggedIn,
}
