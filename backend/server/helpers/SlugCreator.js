const slug = require('slug');

const createSlug = (name) => {
  const config = {
    replacement: '-',
    symbols: true,
    remove: /[.]/g,
    lower: true,
    charmap: slug.charmap,
    multicharmap: slug.multicharmap,
  };
  return slug(name, config);
};

module.exports = { createSlug };
