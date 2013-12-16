define([
  'src/support/inherit'
], function (inherit) {
  describe('inherit()', function () {
    var foo, bar, baz;

    foo = {
      foo : 'foo'
    };

    function Bar() {}
    inherit(Bar, foo);
    Bar.prototype.bar = 'bar';

    function Baz() {
      Bar.call(this);
    }

    inherit(Baz, Bar);
    Baz.prototype.baz = 'baz';

    before(function () {
      bar = new Bar();
      baz = new Baz();
    });

    it('is a function', function () {
      expect(inherit).to.be.a('function');
    });

    it('does not break instanceof operator', function () {
      expect(bar instanceof Bar).to.be.true;
      expect(baz instanceof Baz).to.be.true;
      expect(baz instanceof Bar).to.be.true;
    });

    it('does not break .isPrototypeOf()', function () {
      expect(foo.isPrototypeOf(bar)).to.be.true;
      expect(Bar.prototype.isPrototypeOf(bar)).to.be.true;

      expect(foo.isPrototypeOf(baz)).to.be.true;
      expect(Bar.prototype.isPrototypeOf(baz)).to.be.true;
      expect(Baz.prototype.isPrototypeOf(baz)).to.be.true;
    });

    it('instances of child have the correct constructor property', function () {
      expect(bar.constructor).to.equal(Bar);
      expect(baz.constructor).to.equal(Baz);
    });

    it('works if parent is a constructor', function () {
      var bar, baz;

      function Bar() {}

      function Baz() {
        Bar.call(this);
      }

      function inheritFromConstructor() {
        inherit(Baz, Bar);
      }

      expect(inheritFromConstructor).to.not.throw();

      bar = new Bar();
      baz = new Baz();

      expect(bar instanceof Bar).to.be.true;
      expect(Bar.prototype.isPrototypeOf(bar)).to.be.true;

      expect(baz instanceof Bar).to.be.true;
      expect(baz instanceof Baz).to.be.true;
      expect(Bar.prototype.isPrototypeOf(baz)).to.be.true;
      expect(Baz.prototype.isPrototypeOf(baz)).to.be.true;
    });

    it('works if parent is an object', function () {
      var foo, bar;

      foo = {
        foo : 'foo'
      };

      function Bar() {}

      function inheritFromObject() {
        inherit(Bar, foo);
      }

      expect(inheritFromObject).to.not.throw();

      bar = new Bar();

      expect(bar instanceof Bar).to.be.true;

      expect(Bar.prototype.isPrototypeOf(bar)).to.be.true;
      expect(foo.isPrototypeOf(bar)).to.be.true;
    });

    it('child objects inherit parents properties', function () {
      expect(bar).to.have.property('foo');
      expect(bar.foo).to.equal(foo.foo);

      expect(baz).to.have.property('foo');
      expect(baz).to.have.property('bar');
      expect(baz.foo).to.equal(foo.foo);
      expect(baz.bar).to.equal(bar.bar);
    });
  });
});
