class NotFoundException {
  constructor(message) {
    this.message = message;
  }
}

class BadRequestException {
  constructor(message) {
    this.message = message;
  }
}

class ForbiddenAccessException{
  constructor(message){
    this.message = message;
  }
}

module.exports = {
  BadRequestException,
  NotFoundException,
  ForbiddenAccessException
};
