define(function () {
  /** Extends an object with the properties from other objects. */
  return function (target) {
    var
      args = Array.prototype.slice.call(arguments, 1),
      arg,
      key,
      len,
      i;

    for (i = 0, len = args.length; i < len; i += 1) {
      arg = args[i]; 
      if (arg) {
        for (key in arg) {
          if (arg.hasOwnProperty(key)) {
            target[key] = arg[key];
          }
        }
      }
    }

    return target;
  };
});
