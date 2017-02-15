module.exports = function (content: Buffer) {
    if (content.toString() === "") {
        return "// Empty Sass file";
    } else {
        return content;
    }
};