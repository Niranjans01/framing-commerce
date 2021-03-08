function selectPresent(a, b) {
  if (a === undefined) {
    if (b === undefined) {
      return null;
    }
    return b;
  } else {
    return a;
  }
}

const getAddressObject = (address = []) => {
  return address.map((addr) => {
    const {
      firstname = "",
      lastname = "",
      email = "",
      street = "",
      company = "",
      suburb = "",
      country = "",
      city = "",
      zip = "",
      phone = "",
      state = "",
      comments=""
    } = addr;
    return {
      firstname,
      lastname,
      email,
      street,
      company,
      suburb,
      country,
      city,
      zip,
      phone,
      state,
      comments
    };
  });
};

module.exports = {
  selectPresent,
  getAddressObject
};
