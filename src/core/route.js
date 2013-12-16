define([
  'src/enum/eventtype',
  'src/enum/errorcode',
  'src/support/create_object',
  'src/support/error'
], function (EventType, ErrorCode, createObject, BlueprintError) {

  var
    PLACEHOLDER_PATTERN = /\{([\w]+)\}/g,
    PLACEHOLDER_REPLACEMENT = '([\\w-\\+%]+)';

  function getPathRegexp(path) {
    return new RegExp(
      path.replace(PLACEHOLDER_PATTERN, PLACEHOLDER_REPLACEMENT)
    );
  }

  function getPathPlaceholders(path) {
    var
      match = path.match(PLACEHOLDER_PATTERN),
      len,
      i;

    if (match) {
      for (i = 0, len = match.length; i < len; i += 1) {
        match[i] = match[i].slice(1, -1);
      }
    }

    return match;
  }

  function Route(path) {
    path = path || '^$';
    this.path = path;
    this.regexp = getPathRegexp(path);
    this.placeholders = getPathPlaceholders(path);
  }

  Route.prototype = {
    resolve : function (path) {
      var match = this.regexp.exec(path);

      return match ? {
        unmatched : path.slice(match[0].length),
        matched : match.shift(),
        data : this.placeholders ? createObject(this.placeholders, match) : null
      } : null;
    },

    toString : function () {
      return this.path;
    },

    build : function (data) {
      var
        self = this,
        result = this.path,
        placeholder,
        value,
        len,
        i;

      if (data && !this.placeholders) {
        throw(BlueprintError(
          'route does not expect data: ' + this,
          ErrorCode.ROUTE_ERROR
        ));
      }
      
      if (!data && this.placeholders) {
        throw(BlueprintError(
          'route expects data: ' + this,
          ErrorCode.ROUTE_ERROR
        ));
      }

      if (result[0] === '^') { result = result.slice(1); }
      if (result[result.length - 1] === '$') { result = result.slice(0, -1); }

      return result.replace(PLACEHOLDER_PATTERN, function (match, placeholder) {
        var value = data[placeholder];

        if (!value && value !== 0) {
          throw(BlueprintError(
            'missing route data "' + placeholder + '" for route ' + self,
            ErrorCode.ROUTE_ERROR
          ));
        }

        return value;
      });
    }
  };

  return Route;
});

