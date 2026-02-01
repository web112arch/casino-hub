const path = require("path");

const resolveSrc = (dir) => path.resolve(__dirname, "src", dir);

module.exports = {
  webpack: {
    alias: {
      "@": resolveSrc(""),
      "@components": resolveSrc("components"),
      "@pages": resolveSrc("pages"),
      "@games": resolveSrc("games"),
      "@hooks": resolveSrc("hooks"),
      "@utils": resolveSrc("utils"),
      "@context": resolveSrc("context"),
      "@assets": resolveSrc("assets"),
    },
  },
};
