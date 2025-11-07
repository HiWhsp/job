let logjson = function (text, data) {
  if (typeof data == "object") {
    data = JSON.parse(JSON.stringify(data));
  }
  console.warn(text, data);
};

export default {
  logjson,
};
