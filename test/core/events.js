define([
  'jquery',

  'src/core/events',

  'sinon'
], function ($, events) {
  describe('events', function () {
    var
      target,
      handler = sinon.spy(function () {});


    beforeEach(function () {
      target = {};
      handler.reset();
    });

    it('is an object', function () {
      expect(events).to.be.an('object');
    });

    describe('.listen()', function () {
      it('is accessible', function () {
        expect(events.listen).to.exist;
      });

      it('is a function', function () {
        expect(events.listen).to.be.a('function');
      });

      it('adds the handler to the given target', function () {
        expect($._data(target, 'events')).to.be.undefined;
        events.listen(target, 'foo', handler);

        var handlers = $._data(target, 'events')['foo'];
        expect(handlers[0].handler).to.equal(handler);
      });

      it('listens to the given event', function () {
        events.listen(target, 'foo', handler);
        events.trigger(target, 'foo');
        expect(handler).to.have.been.calledOnce;
      });
    });

    describe('.unlisten()', function () {
      beforeEach(function () {
        events.listen(target, 'foo', handler);
      });

      it('is accessible', function () {
        expect(events.unlisten).to.exist;
      });

      it('is a function', function () {
        expect(events.unlisten).to.be.a('function');
      });

      it('removes the handler from the given target', function () {
        expect($._data(target, 'events')['foo']).to.have.length(1);
        events.unlisten(target, 'foo', handler);
        expect($._data(target, 'events')).to.be.undefined;
      });

      it('removes all handlers for the given event if no handler is given',
        function () {
          var handler2 = sinon.spy(function () {});
          events.listen(target, 'foo', handler2);

          expect($._data(target, 'events')['foo']).to.have.length(2);
          events.unlisten(target, 'foo');
          expect($._data(target, 'events')).to.be.undefined;
        });

      it('removes all handlers from target if no event and handler are given',
        function () {
          events.listen(target, 'bar', handler);
          expect($._data(target, 'events')['foo']).to.have.length(1);
          expect($._data(target, 'events')['bar']).to.have.length(1);

          events.unlisten(target);
          expect($._data(target, 'events')).to.be.undefined;
        });
    });

    describe('.trigger()', function () {
      it('is accessible', function () {
        expect(events.trigger).to.exist;
      });

      it('is a function', function () {
        expect(events.trigger).to.be.a('function');
      });

      it('triggers all handlers for the given event on the target',
        function () {
          events.listen(target, 'foo', handler);
          events.trigger(target, 'foo');
          expect(handler).to.have.been.calledOnce;
        });

      it('passes the given params to the handler', function () {
        var handler = sinon.spy(function (e, param1, param2) {
          expect(param1).to.equal('foo');
          expect(param2).to.equal('bar');
        });
        events.listen(target, 'foo', handler);
        events.trigger(target, 'foo', ['foo', 'bar']);
      });
    });
  });
});
