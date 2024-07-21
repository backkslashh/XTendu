const fs = require("fs");

function sanitizeJSFiles(fileList) {
  return fileList.filter((fileName) => fileName.endsWith(".js"));
}

module.exports = {
  sanitizeJSFiles,
};
