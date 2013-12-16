define(function () {
  //# polyfill: Array.prototype.indexOf
  //# target: ie < 9
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
      if (!this) {
        throw(new TypeError());
      }

      var
        len = this.length,
        i = fromIndex || 0;

      // Starting point is after the last element
      if (i >= len) {
        return -1;
      }

      // Negative starting point
      if (i < 0) {
        i = len + i;

        // If the negative index persists, limit it to 0 to avoid unecessary
        // iterations while searching for the element.
        if (i < 0) { i = 0; }
      }

      for (i; i < len; i += 1) {
        if (this[i] === searchElement) {
          return i;
        }
      }

      return -1;
    }
  }
});
