define(function () {
  return function (child, parent) {
    function tmp() {};

    if (parent.constructor === Function) {
      child.super = parent.prototype;
      tmp.prototype = parent.prototype;
    } else {
      // Parent is an object rather than a constructor
      child.super = parent;
      tmp.prototype = parent;
    }

    child.prototype = new tmp();
    child.prototype.constructor = child;
  };
});
