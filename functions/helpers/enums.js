function makeEnum(values) {
  const obj = {};
  values.forEach(v => obj[v] = v);
  return Object.freeze(obj);
}

module.exports = {
  makeEnum,
};
