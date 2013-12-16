define([
  'src/enum/eventtype',
  'src/enum/state',

  'src/core/statefull_object',

  'src/polyfill/array/foreach',
  'sinon'
], function (EventType, State, StatefullObject) {
  describe('StatefullObject', function () {
    var o;
    
    beforeEach(function () {
      o = new StatefullObject();
    });

    it('is a constructor', function () {
      expect(o).to.be.instanceof(StatefullObject);
    });

    describe('#setStateSupport()', function () {
      it('is accessible', function () {
        expect(o.setStateSupport).to.exist;
      });

      it('is a function', function () {
        expect(o.setStateSupport).to.be.a('function');
      });

      it('adds support for the given state if second parameter is "true"',
        function () {
          expect(o.hasStateSupport(State.VISIBLE)).to.be.false;
          o.setStateSupport(State.VISIBLE, true);
          expect(o.hasStateSupport(State.VISIBLE)).to.be.true;
        });

      it('removes support for the given state if second parameter is "false"',
        function () {
          o.setStateSupport(State.VISIBLE, true);
          expect(o.hasStateSupport(State.VISIBLE)).to.be.true;
          o.setStateSupport(State.VISIBLE, false);
          expect(o.hasStateSupport(State.VISIBLE)).to.be.false;
        });

      it('does nothing if state support is already as requested', function () {
        expect(o.hasStateSupport(State.VISIBLE)).to.be.false;
        o.setStateSupport(State.VISIBLE, false);
        expect(o.hasStateSupport(State.VISIBLE)).to.be.false;
      });

      it('accepts an array of states', function () {
        expect(o.hasStateSupport(State.VISIBLE)).to.be.false;
        expect(o.hasStateSupport(State.ACTIVE)).to.be.false;

        o.setStateSupport([State.VISIBLE, State.ACTIVE], true);
        expect(o.hasStateSupport(State.VISIBLE)).to.be.true;
        expect(o.hasStateSupport(State.ACTIVE)).to.be.true;

        o.setStateSupport([State.VISIBLE, State.ACTIVE], false);
        expect(o.hasStateSupport(State.VISIBLE)).to.be.false;
        expect(o.hasStateSupport(State.ACTIVE)).to.be.false;
      });
    });

    describe('#hasStateSupport()', function () {
      it('is accessible', function () {
        expect(o.hasStateSupport).to.exist;
      });

      it('is a function', function () {
        expect(o.hasStateSupport).to.be.a('function');
      });

      it('returns "true" if state is supported', function () {
        o.setStateSupport(State.VISIBLE, true);
        expect(o.hasStateSupport(State.VISIBLE)).to.be.true;
      });

      it('returns "false" if state is not supported', function () {
        expect(o.hasStateSupport(State.VISIBLE)).to.be.false;
      });
    });

    describe('#setState()', function () {
      beforeEach(function () {
        o.setStateSupport(State.VISIBLE, true);
      });

      it('is accessible', function () {
        expect(o.setState).to.exist;
      });

      it('is a function', function () {
        expect(o.setState).to.be.a('function');
      });

      it('adds a state if second parameter is "true"', function () {
        expect(o.hasState(State.VISIBLE)).to.be.false;
        o.setState(State.VISIBLE, true);
        expect(o.hasState(State.VISIBLE)).to.be.true;
      });

      it('removes a state if second parameter is "false"', function () {
        o.setState(State.VISIBLE, true);
        expect(o.hasState(State.VISIBLE)).to.be.true;
        o.setState(State.VISIBLE, false);
        expect(o.hasState(State.VISIBLE)).to.be.false;
      });

      it('does nothing if state is already set as requested', function () {
        expect(o.hasState(State.VISIBLE)).to.be.false;
        o.setState(State.VISIBLE, false);
        expect(o.hasState(State.VISIBLE)).to.be.false;

        o.setState(State.VISIBLE, true);
        expect(o.hasState(State.VISIBLE)).to.be.true;
        o.setState(State.VISIBLE, true);
        expect(o.hasState(State.VISIBLE)).to.be.true;
      });

      it('throws an error if state is not supported by the object',
        function () {
          function setUnsupportedState() {
            o.setState(State.ACTIVE, true);
          }

          expect(o.hasStateSupport(State.ACTIVE)).to.be.false;
          expect(setUnsupportedState).to.throw('State not supported');
        });
    });

    describe('#hasState()', function () {
      beforeEach(function () {
        o.setStateSupport(State.VISIBLE, true);
      });

      it('is accessible', function () {
        expect(o.hasState).to.exist;
      });

      it('is a function', function () {
        expect(o.hasState).to.be.a('function');
      });


      it('returns true if object is in given state', function () {
        o.setState(State.VISIBLE, true);
        expect(o.hasState(State.VISIBLE)).to.be.true;
      });

      it('returns false if object is not in given state', function () {
        expect(o.hasState(State.VISIBLE)).to.be.false;
      });

      it('returns false if state is not supported', function () {
        expect(o.hasStateSupport(State.ACTIVE)).to.be.false;
        expect(o.hasState(State.ACTIVE)).to.be.false;
      });
    });

    describe('events', function () {
      var listener = sinon.spy(function () {});

      beforeEach(function () {
        listener.reset();
      });

      describe('changestatesupport', function () {
        it('is triggered when state support is enabled', function () {
          o.on(EventType.CHANGE_STATE_SUPPORT, listener);
          o.setStateSupport(State.ACTIVE, true);
          expect(listener).to.have.been.calledOnce;
        });

        it('is triggered when state support is disabled', function () {
          o.setStateSupport(State.ACTIVE, true);
          o.on(EventType.CHANGE_STATE_SUPPORT, listener);
          o.setStateSupport(State.ACTIVE, false);
          expect(listener).to.have.been.calledOnce;
        });

        it('is not triggered if state support does not change',
          function () {
            o.on(EventType.CHANGE_STATE_SUPPORT, listener);

            expect(o.hasStateSupport(State.VISIBLE)).to.be.false;
            o.setStateSupport(State.VISIBLE, false);
            expect(listener).to.not.have.been.called;
          });

        it('passes the state and its support value to the listener',
          function () {
            var onStateSupportChange = sinon.spy(function (e, state, support) {
              expect(state).to.equal(State.VISIBLE);
              expect(support).to.equal(o.hasStateSupport(State.VISIBLE));
            });

            o.on(EventType.CHANGE_STATE_SUPPORT, onStateSupportChange);
            o.setStateSupport(State.VISIBLE, true);
            expect(onStateSupportChange).to.have.been.calledOnce;
          });
      });

      describe('changestate', function () {

        beforeEach(function () {
          o.setStateSupport(State.VISIBLE, true);
        });

        it('is triggered when state is enabled', function () {
          o.on(EventType.CHANGE_STATE, listener);
          o.setState(State.VISIBLE, true);
          expect(listener).to.have.been.calledOnce;
        });

        it('is triggered when state is disabled', function () {
          o.setState(State.VISIBLE, true);
          o.on(EventType.CHANGE_STATE, listener);
          o.setState(State.VISIBLE, false);
          expect(listener).to.have.been.calledOnce;
        });

        it('is not triggered if state does not change', function () {
          o.on(EventType.CHANGE_STATE, listener);
          o.setState(State.VISIBLE, false);
          expect(listener).to.not.have.been.called;
        });

        it('passes the state and its value to the listener',
          function () {
            var onStateChange = sinon.spy(function (e, state, enabled) {
              expect(state).to.equal(State.VISIBLE);
              expect(enabled).to.equal(o.hasState(State.VISIBLE));
            });

            o.on(EventType.CHANGE_STATE, onStateChange);
            o.setState(State.VISIBLE, true);
            expect(onStateChange).to.have.been.calledOnce;
          });
      }); // changestate


      [
        ['ACTIVATE', 'ACTIVE', true],
        ['DEACTIVATE', 'ACTIVE', false],
        ['ENABLE', 'ENABLED', true],
        ['DISABLE', 'ENABLED', false],
        ['SHOW', 'VISIBLE', true],
        ['HIDE', 'VISIBLE', false],
        ['OPEN', 'OPEN', true],
        ['CLOSE', 'OPEN', false],
        ['LOAD', 'LOADED', true],
        ['UNLOAD', 'LOADED', false],
        ['DISPOSE', 'DISPOSED', true],
        ['RENDER', 'RENDERED', true],
        ['UNRENDER', 'RENDERED', false]
      ].forEach(function (v) {
        var
          eventName = v[0],
          stateName = v[1],
          enable = v[2],
          event = EventType[eventName],
          state = State[stateName];

        describe(event, function () {
          var o, msg;

          msg = enable ?
            'is triggered when object enters ' + stateName + ' state' :
            'is triggered when object leaves ' + stateName + ' state';

          beforeEach(function () {
            o = new StatefullObject();
            o.setStateSupport(state, true);
            o.setState(state, !enable);
          });

          it(msg, function () {
            o.on(event, listener);
            o.setState(state, enable);
            expect(listener).to.have.been.calledOnce;
          });

          it('is not triggered if state does not change', function () {
            o.setState(state, enable);
            o.on(event, listener);
            o.setState(state, enable);
            expect(listener).to.not.have.been.called;
          });
        });
      });
    }); // event
  }); // StatefullObject

}); // define
