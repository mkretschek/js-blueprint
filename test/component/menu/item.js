define([
  'src/core/statefull_object',

  'src/component/menu',
  'src/component/menu/item'
], function (StatefullObject, Menu, MenuItem) {
  describe('MenuItem', function () {
    var item, menu;

    beforeEach(function () {
      item = new MenuItem('foo');
      menu = new Menu();
    });

    it('is a constructor', function () {
      expect(item instanceof MenuItem).to.be.true;
    });

    it('is a statefull object', function () {
      expect(item instanceof StatefullObject).to.be.true;
    });

    it('sets a target property', function () {
      expect(item).to.have.property('target');
      expect(item.target).to.equal('foo');
    });

    describe('#setParent()', function () {
      it('is accessible', function () {
        expect(item.setParent).to.exist;
      });

      it('is a function', function () {
        expect(item.setParent).to.be.a('function');
      });

      it('sets the "parent" property', function () {
        expect(item.parent).to.be.null;
        item.setParent(menu);
        expect(item.parent).to.equal(menu);
      });
    });

    describe('#setSubmenu()', function () {
      it('is accessible', function () {
        expect(item.setSubmenu).to.exist;
      });

      it('is a function', function () {
        expect(item.setSubmenu).to.be.a('function');
      });

      it('sets the "submenu" property', function () {
        expect(item.submenu).to.be.null;
        item.setSubmenu(menu);
        expect(item.submenu).to.equal(menu);
      });
    });

    // XXX: not sure if this should be in MenuItem()
    describe('#setActive()', function () {
      it('is accessible');
      it('is a function');
      it('sets the ACTIVE state');
    });

    // XXX: not sure if this should be in MenuItem()
    describe('#setEnabled()', function () {
      it('is accessible');
      it('is a function');
      it('sets the ENABLED state');
    });
  });
});
