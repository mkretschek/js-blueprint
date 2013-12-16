define([
  'src/core/route'
], function (Route) {
  describe('Route', function () {
    var route;

    before(function () {
      route = new Route('^/foo/{bar}/{baz}');
    });

    it('is a constructor', function () {
      expect(Route).to.be.a('function');
      expect(route).to.be.instanceof(Route);
    });

    describe('.path', function () {
      it('is accessible', function () {
        expect(route).to.have.property('path');
      });

      it('is a string', function () {
        expect(route.path).to.be.a('string');
      });

      it('defaults to a pattern that matches an empty string', function () {
        var route = new Route();
        expect(route.path).to.exist;
        expect(route.path).to.equal('^$');
        expect('').to.match(new RegExp(route.path));
      });
    });

    describe('.regexp', function () {
      it('is accessible', function () {
        expect(route.regexp).to.exist;
      });

      it('is a RegExp', function () {
        expect(route.regexp).to.be.instanceof(RegExp);
      });

      it('has placeholders replaced by pattern', function () {
        expect(route.regexp.toString()).to.equal('/^/foo/([\\w-\\+%]+)/([\\w-\\+%]+)/');
      });

      it('placeholders patterns keep a reference to the matched value',
        function () {
          var match = route.regexp.exec('/foo/test/matches');
          expect(match[1]).to.equal('test');
          expect(match[2]).to.equal('matches');
        });
    });

    describe('.placeholders', function () {
      it('is accessible', function () {
        expect(route.placeholders).to.exist;
      });

      it('is an array if there is one or more placeholders in path',
        function () {
          expect(route.placeholders).to.be.an('array');
          expect(route.placeholders).to.have.length(2);
          expect(route.placeholders).to.eql(['bar', 'baz']);
        });

      it('is null if there are no placeholders in path', function () {
        var route = new Route('^/foo/bar/baz');
        expect(route.placeholders).to.be.null;
      });

      it('stores placeholders in the order they are found in the path',
        function () {
          expect(route.placeholders[0]).to.equal('bar');
          expect(route.placeholders[1]).to.equal('baz');
        });
    });

    describe('#resolve()', function () {
      it('is accessible', function () {
        expect(route.resolve).to.exist;
      });

      it('is a function', function () {
        expect(route.resolve).to.be.a('function');
      });

      it('returns an object if the route matches the given path', function () {
        expect(route.resolve('/foo/data1/data2')).to.be.an('object');
      });

      it('returns null if the route does not match the given path',
        function () {
          expect(route.resolve('/foobarbaz')).to.be.null;
        });

      describe('match object', function () {
        var match;

        before(function () {
          match = route.resolve('/foo/data1/data2/unmatched/path');
        });

        describe('.matched', function () {
          it('is accessible', function () {
            expect(match.matched).to.exist;
          });

          it('is a string', function () {
            expect(match.matched).to.be.a('string');
          });

          it('contains the matched part of the path', function () {
            expect(match.matched).to.equal('/foo/data1/data2');
          });
        });

        describe('.unmatched', function () {
          it('is accessible', function () {
            expect(match.unmatched).to.exist;
          });

          it('is a string', function () {
            expect(match.unmatched).to.be.a('string');
          });

          it('contains the part of the path not matched by the regexp',
            function () {
              expect(match.unmatched).to.equal('/unmatched/path');
            });
        });

        describe('.data', function () {
          it('is accessible', function () {
            expect(match.data).to.exist;
          });

          it('is an object if the path contains placeholders', function () {
            expect(match.data).to.be.an('object');
          });

          it('is null if there are no placeholders in the path', function () {
            var
              route = new Route('^/foo/bar$'),
              match = route.resolve('/foo/bar');
            expect(match.data).to.be.null;
          });

          it('maps each placeholder name to its corresponding value from path',
            function () {
              expect(match.data).to.have.property('bar');
              expect(match.data.bar).to.equal('data1');
              expect(match.data).to.have.property('baz');
              expect(match.data.baz).to.equal('data2');
            });
        });
      });
    }); // #resolve()

    describe('#build()', function () {
      var route, path;

      before(function () {
        route = new Route('^/foo/{bar}/{baz}$');
        path = route.build({
          bar : 'dataBar',
          baz : 'dataBaz'
        });
      });

      it('is accessible', function () {
        expect(route.build).to.exist;
      });

      it('is a function', function () {
        expect(route.build).to.be.a('function');
      });

      it('removes "^" from the beggining of the path', function () {
        expect(route.path[0]).to.equal('^');
        expect(path[0]).to.not.equal('^');
      });

      it('removes "$" from the end of the path', function () {
        expect(route.path[route.path.length - 1]).to.equal('$');
        expect(path[path.length - 1]).to.not.equal('$');
      });

      it('replaces placeholders with data', function () {
        expect(path).to.equal('/foo/dataBar/dataBaz');
      });

      it('throws an error if data is given and the path has no placeholders',
        function () {
          function missingPlaceholders() {
            var route = new Route('^/foo/bar/baz');

            route.build({
              bar : 'dataBar',
              baz : 'dataBaz'
            });
          }

          expect(missingPlaceholders).to.throw('route does not expect data');
        });

      it('throws an error if no data is given while the path expects it',
        function () {
          function missingData() {
            route.build();
          }

          expect(missingData).to.throw('route expects data');
        });

      it('throws an error if data for a placeholder is missing', function () {
        function missingBaz() {
          route.build({
            bar : 'dataBar'
          });
        }

        expect(missingBaz).to.throw('missing route data "baz"');
      });
    }); // #build()
  });
});
