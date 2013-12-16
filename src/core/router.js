define([
  'jquery',
  'src/support/error',
  'src/enum/errorcode',
  'src/core/route'
], function ($, BlueprintError, ErrorCode, Route) {

  function Router() {
    this.routes_ = [];
    this.targets_ = [];
  };

  Router.prototype = {
    add : function (path, target) {
      if (this.hasRoute(path)) {
        throw(BlueprintError(
          'duplicate route: ' + path,
          ErrorCode.DUPLICATE_ROUTE_ERROR
        ));
      }

      this.routes_.push(new Route(path));
      this.targets_[this.routes_.length - 1] = target;

      // Allow chaining
      return this;
    },

    hasRoute : function (path) {
      var route, len, i;

      for (i = 0, len = this.routes_.length; i < len; i += 1) {
        route = this.routes_[i];
        if (route.path === path) {
          return true;
        }
      }

      return false;
    },

    getPath : function (target, data, skip) {
      skip = skip || 0;

      var route, len, i;
      i = this.targets_.indexOf(target, skip);

      if (~i) {
        route = this.routes_[i];

        try {
          return route.build(data);
        } catch (err) {
          if (err.code === ErrorCode.ROUTE_ERROR) {
            return this.getPath(target, data, i + 1);
          }

          throw(err);
        }
      }

      throw(BlueprintError(
        'unable to find a route for target: ' + target,
        ErrorCode.ROUTE_ERROR
      ));
    },

    resolve : function (path) {
      var match;

      for (i = 0, len = this.routes_.length; i < len; i += 1) {
        match = this.routes_[i].resolve(path);
        if (match) {
          match.target = this.targets_[i];
          return match;
        }
      }

      return null;
    }
  };

  return Router;
});
