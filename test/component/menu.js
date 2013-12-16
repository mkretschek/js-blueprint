define([
  'src/enum/eventtype',
  'src/core/statefull_object',
  'src/component/menu/item',
  'src/component/menu'
], function (
  EventType,
  StatefullObject,
  MenuItem,
  Menu
) {
  describe('Menu', function () {
    var menu;

    beforeEach(function () {
      menu = new Menu('Test menu');
    });

    it('is a constructor', function () {
      expect(menu).to.be.instanceof(Menu);
    });

    it('is a StatefullObject', function () {
      expect(menu).to.be.instanceof(StatefullObject);
    });

    it('creates a fresh items array', function () {
      var menu2 = new Menu();
      menu.addItem(new MenuItem('foo'));

      expect(menu.items).to.not.be.empty;
      expect(menu2.items).to.be.empty;
      expect(menu.items).to.not.equal(menu2.items);
    });

    it('accepts a title', function () {
      expect(menu).to.have.property('title');
      expect(menu.title).to.equal('Test menu');
    });

    describe('#addItem()', function () {
      it('is accessible', function () {
        expect(menu.addItem).to.exist;
      });

      it('is a function', function () {
        expect(menu.addItem).to.be.a('function');
      });

      it('inserts an item at the end of the items list', function () {
        var
          item1 = new MenuItem(),
          item2 = new MenuItem();

        expect(menu.items).to.be.empty;
        menu.addItem(item1);
        expect(menu.items).to.have.length(1);
        menu.addItem(item2);
        expect(menu.items).to.have.length(2);
        expect(menu.items[0]).to.equal(item1);
        expect(menu.items[1]).to.equal(item2);
      });

      it('throws an error if item is not a MenuItem object', function () {
        function addInvalidItem() {
          menu.addItem('foo');
        }

        expect(addInvalidItem).to.throw('Invalid menu item');
      });

      it('throws an error if item is already in a menu', function () {
        var menu2, item3;

        menu2 = new Menu();
        item3 = new MenuItem();

        menu2.addItem(item3);

        function addTwice() {
          menu.addItem(item3);
        }

        expect(addTwice).to.throw('Item is already in a menu');
      });

      it('sets the item\'s parent', function () {
        var item3 = new MenuItem();
        expect(item3.parent).to.be.null;
        menu.addItem(item3);
        expect(item3.parent).to.equal(menu);
      });
    });

    describe('#removeItem()', function () {
      var item1, item2;

      beforeEach(function () {
        menu = new Menu();
        item1 = new MenuItem();
        item2 = new MenuItem();

        menu.addItem(item1);
        menu.addItem(item2);
      });

      it('is accessible', function () {
        expect(menu.removeItem).to.exist;
      });

      it('is a function', function () {
        expect(menu.removeItem).to.be.a('function');
      });

      it('removes the given item from the items list', function () {
        expect(menu.items).to.have.length(2);
        menu.removeItem(item1);
        expect(menu.items).to.have.length(1);
        expect(menu.items[0]).to.equal(item2);
        expect(menu.items).to.not.contain(item1);
      });

      it('returns the removed item', function () {
        expect(menu.removeItem(item1)).to.equal(item1);
      });

      it('returns undefined if item is not found', function () {
        var item3 = new MenuItem();
        expect(menu.removeItem(item3)).to.be.undefined;
      });

      it('throws an error if item is not a MenuItem', function () {
        function removeInvalidItem() {
          menu.removeItem('foo');
        }

        expect(removeInvalidItem).to.throw('Invalid menu item');
      });

      it('unsets the item\'s parent', function () {
        expect(item1.parent).to.equal(menu);
        menu.removeItem(item1);
        expect(item1.parent).to.be.null;
      });
    }); // #removeItem()

    describe('#removeItemAt()', function () {
      var item1, item2;

      beforeEach(function () {
        menu = new Menu();
        item1 = new MenuItem();
        item2 = new MenuItem();

        menu.addItem(item1);
        menu.addItem(item2);
      });

      it('is accessible', function () {
        expect(menu.removeItemAt).to.exist;
      });

      it('is a function', function () {
        expect(menu.removeItemAt).to.be.a('function');
      });

      it('removes the item at the given index', function () {
        expect(menu.items[0]).to.equal(item1);
        expect(menu.items).to.have.length(2);
        var removed = menu.removeItemAt(0);
        expect(menu.items).to.have.length(1);
        expect(menu.items[0]).to.equal(item2);
        expect(removed).to.equal(item1);
        expect(menu.items).to.not.contain(item1);
      });

      it('accepts negative indexes', function () {
        expect(menu.items[1]).to.equal(item2);
        expect(menu.items).to.have.length(2);
        var removed = menu.removeItemAt(-1);
        expect(menu.items).to.have.length(1);
        expect(removed).to.equal(item2);
        expect(menu.items).to.not.contain(item2);
      });

      it('returns the removed item', function () {
        expect(menu.removeItemAt(0)).to.equal(item1);
      });

      it('returns undefined if there\'s no item at the given index',
        function () {
          expect(menu.removeItemAt(10)).to.be.undefined;
        });

      it('throws an error if index is not a number', function () {
        function removeInvalidIndex() {
          menu.removeItemAt(item1);
        }

        expect(removeInvalidIndex).to.throw('Invalid item index');
      });

      it('unsets the item\'s parent', function () {
        expect(item1.parent).to.equal(menu);
        menu.removeItemAt(0);
        expect(item1.parent).to.be.null;
      });
    });

    describe('event', function () {
      var item1, item2;

      beforeEach(function () {
        menu = new Menu();
        item1 = new MenuItem();
        item2 = new MenuItem();

        menu.addItem(item1);
        menu.addItem(item2);
      });

      describe('additem', function () {
        it('is fired when an item is added to the menu', function () {
          var
            listener = sinon.spy(function () {}),
            item3 = new MenuItem();
          menu.on(EventType.ADD_ITEM, listener);
          menu.addItem(item3);
          expect(listener).to.have.been.calledOnce;
        });

        it('passes the added item and its index to the handler', function () {
          var
            item3 = new MenuItem(),
            listener = sinon.spy(function (e, item, index) {
              expect(item).to.equal(item3);
              expect(index).to.equal(menu.items.length - 1);
            });

          menu.on(EventType.ADD_ITEM, listener);
          menu.addItem(item3);
          expect(listener).to.have.been.calledOnce;
        });
      });

      describe('removeitem', function () {
        var listener = sinon.spy(function () {});

        beforeEach(function () {
          listener.reset();
        });

        it('is fired when an item is removed with #removeItem()', function () {
          menu.on(EventType.REMOVE_ITEM, listener);
          menu.removeItem(item1);
          expect(listener).to.have.been.calledOnce;
        });

        it('is fired when an item is removed with #removeItemAt()',
          function () {
            menu.on(EventType.REMOVE_ITEM, listener);
            menu.removeItemAt(0);
            expect(listener).to.have.been.calledOnce;
          });

        it('passes the removed item and its index to the handler', function () {
          var listener = sinon.spy(function (e, item, index) {
            expect(item instanceof MenuItem).to.be.true;
            expect(index).to.equal(0);
          });

          menu.on(EventType.REMOVE_ITEM, listener);
          menu.removeItem(item1);
          menu.removeItemAt(0);
          expect(listener).to.have.been.calledTwice;
        });
      });
    });
  });
});
