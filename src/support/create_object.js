define(function () {
  /**
   * Creates an object from arrays of keys and values.
   */
  return function (keys, values) {
    if (!keys) {
      return {};
    }

    var
      result = {},
      len,
      i;

    for (i = 0, len = keys.length; i < len; i += 1) {
      result[keys[i]] = values && values[i];
    }

    return result;
  };
});
