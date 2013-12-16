define([
  'src/enum/errorcode',
  'src/core/route',
  'src/core/router'
], function (ErrorCode, Route, Router) {

  describe('Router', function () {
    var router;

    before(function () {
      router = new Router();
      router
        .add('^/foo/bar$', 'foobar')
        .add('^/foo/bar/baz$', 'foobarbaz');
    });

    it('is a constructor', function () {
      expect(router).to.be.instanceof(Router);
    });

    describe('#add()', function () {
      it('is accessible', function () {
        expect(router.add).to.exist;
      });

      it('is a function', function () {
        expect(router.add).to.be.a('function');
      });

      it('adds a route object', function () {
        var router = new Router();
        expect(router.routes_).to.be.empty;
        router.add('^/foo$', 'foo');
        expect(router.routes_).to.not.be.empty;
        expect(router.routes_[0]).to.be.instanceof(Route);
      });

      it('adds a target', function () {
        var router = new Router();
        expect(router.targets_).to.be.empty;
        router.add('^/foo$', 'foo');
        expect(router.targets_).to.not.be.empty;
        expect(router.targets_[0]).to.equal('foo');
      });

      it('throws an error for duplicate paths', function () {
        function addDuplicate() {
          router.add('^/foo/bar$', 'another foobar');
        }

        expect(addDuplicate).to.throw('duplicate route');
      });

      it('allows chaining', function () {
        var router = new Router();

        function chainAdds() {
          router
            .add('^/foo$', 'foo')
            .add('^/bar$', 'bar');
        }

        expect(router.add('^/baz', 'baz')).to.equal(router);
        expect(chainAdds).to.not.throw();
      });
    });

    describe('#hasRoute()', function () {
      it('is accessible', function () {
        expect(router.hasRoute).to.exist;
      });

      it('is a function', function () {
        expect(router.hasRoute).to.be.a('function');
      });

      it('returns true if the path is already in use by a route', function () {
        expect(router.hasRoute('^/foo/bar$')).to.be.true;
      });

      it('returns false if no route uses the given path', function () {
        expect(router.hasRoute('^/bar/baz$')).to.be.false;
      });
    });

    describe('#getPath()', function () {
      it('is accessible', function () {
        expect(router.getPath).to.exist;
      });

      it('is a function', function () {
        expect(router.getPath).to.be.a('function');
      });

      it('returns the path for a target', function () {
        expect(router.getPath('foobar')).to.equal('/foo/bar');
      });

      it('returns the first viable route if a page has more than one',
        function () {
          var router = new Router();

          router
            // Path that requires data
            .add('^/foo/{bar}$', 'foo')
            // Path that does not
            .add('^/foo/bar$', 'foo');


          // With data should return the first path
          expect(router.getPath('foo', {bar : 'baz'})).to.equal('/foo/baz');

          // Without data should return the second path
          expect(router.getPath('foo')).to.equal('/foo/bar');
        });

      it('throws an error if a route for the target cannot be found',
        function () {
          function unregisteredTarget() {
            router.getPath('baz');
          }

          expect(unregisteredTarget).to.throw(
            'unable to find a route for target'
          );

        });
    });

    describe('#resolve()', function () {
      it('is accessible', function () {
        expect(router.resolve).to.exist;
      });

      it('is a function', function () {
        expect(router.resolve).to.be.a('function');
      });

      it('returns a match object if a route matches the given path',
        function () {
          var match = router.resolve('/foo/bar');
          expect(match).to.be.an('object');
          expect(match).to.have.property('matched');
          expect(match).to.have.property('unmatched');
          expect(match).to.have.property('data');
        });

      it('returns null if none of the routes match the given path',
        function () {
          expect(router.resolve('/undefined-path')).to.be.null;
        });

      it('sets a "target" property to the match object', function () {
        var match;
        
        match = router.resolve('/foo/bar');
        expect(match.target).to.equal('foobar');

        match = router.resolve('/foo/bar/baz');
        expect(match.target).to.equal('foobarbaz');
      });
    });
  });
});
