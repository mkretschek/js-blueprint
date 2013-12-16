define([
  'src/support/extend'
], function (extend) {
  describe('extend()', function () {
    var target, extA, extB;

    before(function () {
      extA = {
        foo : 'foo',
        bar : 'bar'
      };

      extB = {
        foo : 'FOO', 
        baz : 'BAZ'
      };
    });

    beforeEach(function () {
      target = {};
    });

    it('is a function', function () {
      expect(extend).to.be.a('function');
    });

    it('updates target object', function () {
      expect(target).to.not.have.property('foo');
      extend(target, extA);
      expect(target).to.have.property('foo');
      expect(target.foo).to.equal(extA.foo);
    });

    it('returns target object', function () {
      expect(extend(target, extA)).to.equal(target);
    });

    it('gets properties from all given objects', function () {
      expect(target).to.not.have.property('foo');
      expect(target).to.not.have.property('bar');
      expect(target).to.not.have.property('baz');

      extend(target, extA, extB);
      expect(target).to.have.property('foo');
      expect(target).to.have.property('bar');
      expect(target).to.have.property('baz');
    });

    it('latest object\'s properties override earlier\'s', function () {
      extend(target, extA, extB);

      expect(target.foo).to.not.equal(extA.foo);
      expect(target.foo).to.equal(extB.foo);
      expect(target.bar).to.equal(extA.bar);
      expect(target.baz).to.equal(extB.baz);
    });
  });
});
