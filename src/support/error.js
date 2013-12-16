define([
  './extend'
], function (extend) {
  /** Throws a blueprint error. */
  return function (message, code, data) {
    return {
      name : 'BlueprintError',
      code : code || '',
      message : message || '',
      data : data
    };
  };
});
