define([
  'src/enum/eventtype',
  'src/enum/state',

  'src/core/events',
  'src/core/states',
  
  'sinon'
], function (
  EventType,
  State,
  events,
  states
) {

  describe('states', function () {
    var target;

    beforeEach(function () {
      target = {};
    });

    it('is an object', function () {
      expect(states).to.be.an('object');
    });

    describe('.setState()', function () {
      it('is accessible', function () {
        expect(states.setState).to.exist;
      });

      it('is a function', function () {
        expect(states.setState).to.be.a('function');
      });

      it('throws an error if state is not supported by target', function () {
        function setUnsupportedState() {
          states.setState(target, State.ACTIVE, true);
        }
        expect(setUnsupportedState).to.throw('State not supported');
      });

      it('enables the state on the target if "enable" is true', function () {
        states.setStateSupport(target, State.ACTIVE, true);
        expect(states.hasState(target, State.ACTIVE)).to.be.false;
        states.setState(target, State.ACTIVE, true);
        expect(states.hasState(target, State.ACTIVE)).to.be.true;
      });

      it('disables the state on the target if "enable" is false', function () {
        states.setStateSupport(target, State.ACTIVE, true);
        states.setState(target, State.ACTIVE, true);
        expect(states.hasState(target, State.ACTIVE)).to.be.true;
        states.setState(target, State.ACTIVE, false);
        expect(states.hasState(target, State.ACTIVE)).to.be.false;
      });
    });

    describe('.setStateSupport()', function () {
      it('is accessible', function () {
        expect(states.setStateSupport).to.exist;
      });

      it('is a function', function () {
        expect(states.setStateSupport).to.be.a('function');
      });

      it('disables an active state when its support is removed', function () {
        states.setStateSupport(target, State.ACTIVE, true);
        states.setState(target, State.ACTIVE, true);
        expect(states.hasState(target, State.ACTIVE)).to.be.true;
        states.setStateSupport(target, State.ACTIVE, false);
        expect(states.hasState(target, State.ACTIVE)).to.be.false;
      });

      it('enables a state support if "support" is true', function () {
        expect(states.hasStateSupport(target, State.ACTIVE)).to.be.false;
        states.setStateSupport(target, State.ACTIVE, true);
        expect(states.hasStateSupport(target, State.ACTIVE)).to.be.true;
      });

      it('disables a state support if "support" is false', function () {
        states.setStateSupport(target, State.ACTIVE, true);
        expect(states.hasStateSupport(target, State.ACTIVE)).to.be.true;
        states.setStateSupport(target, State.ACTIVE, false);
        expect(states.hasStateSupport(target, State.ACTIVE)).to.be.false;
      });

      it('works with an array of states', function () {
        expect(states.hasStateSupport(target, State.ACTIVE)).to.be.false;
        expect(states.hasStateSupport(target, State.ENABLED)).to.be.false;

        states.setStateSupport(
          target,
          [State.ACTIVE, State.ENABLED],
          true
        );
        expect(states.hasStateSupport(target, State.ACTIVE)).to.be.true;
        expect(states.hasStateSupport(target, State.ACTIVE)).to.be.true;

        states.setStateSupport(
          target,
          [State.ACTIVE, State.ENABLED],
          false
        );
        expect(states.hasStateSupport(target, State.ACTIVE)).to.be.false;
        expect(states.hasStateSupport(target, State.ACTIVE)).to.be.false;
      });

      it('sets initial states the first time its called on a target',
        function () {
          expect(target).to.not.have.property('states_');
          states.setStateSupport(target, State.ACTIVE, true);
          expect(target).to.have.property('states_');
          expect(target.states_).to.equal(0);
        });
    });


    describe('.hasState()', function () {
      beforeEach(function () {
        states.setStateSupport(target, State.ACTIVE, true);
      });

      it('is accessible', function () {
        expect(states.hasState).to.exist;
      });

      it('is a function', function () {
        expect(states.hasState).to.be.a('function');
      });

      it('returns true when target has the given state', function () {
        states.setState(target, State.ACTIVE, true);
        expect(states.hasState(target, State.ACTIVE)).to.be.true;
      });

      it('returns false when target does not have the given state',
        function () {
          expect(states.hasState(target, State.ACTIVE)).to.be.false;
        });

      it('returns false when state is not supported by target', function () {
        expect(states.hasState(target, State.ENABLED)).to.be.false;
      });
    });


    describe('.hasStateSupport()', function () {
      it('is accessible', function () {
        expect(states.hasStateSupport).to.exist;
      });

      it('is a function', function () {
        expect(states.hasStateSupport).to.be.a('function');
      });

      it('return true when target supports the given state', function () {
        states.setStateSupport(target, State.ACTIVE, true);
        expect(states.hasStateSupport(target, State.ACTIVE)).to.be.true;
      });

      it('returns false when target does not support the given state',
        function () {
          expect(states.hasStateSupport(target, State.ENABLED)).to.be.false;
        });
    });


    describe('event', function () {
      var handler = sinon.spy(function () {});

      beforeEach(function () {
        handler.reset();
      });

      describe(EventType.CHANGE_STATE, function () {
        beforeEach(function () {
          states.setStateSupport(target, State.ACTIVE, true);
          events.listen(target, EventType.CHANGE_STATE, handler);
        });

        it('is triggered when .setState() changes the state of the target',
          function () {
            states.setState(target, State.ACTIVE, true);
            expect(handler).to.have.been.calledOnce;
          });

        it('is not triggered when .setState() does not change the state',
          function () {
            expect(states.hasState(target, State.ACTIVE)).to.be.false;
            states.setState(target, State.ACTIVE, false);
            expect(handler).to.not.have.been.called;
          });

        it('passes the changed state and its new value to the handler',
          function () {
            states.setState(target, State.ACTIVE, true);
            var handlerArgs = handler.args[0];
            expect(handlerArgs).to.have.length(3);
            expect(handlerArgs[1]).to.equal(State.ACTIVE);
            expect(handlerArgs[2]).to.equal(true);
          });
      });

      describe(EventType.CHANGE_STATE_SUPPORT, function () {
        beforeEach(function () {
          events.listen(target, EventType.CHANGE_STATE_SUPPORT, handler);
        });

        it('is triggered when .setStateSupport() changes the state support',
          function () {
            expect(states.hasStateSupport(target, State.ACTIVE)).to.be.false;
            states.setStateSupport(target, State.ACTIVE, true);
            expect(handler).to.have.been.calledOnce;
          });

        it('is not triggered when .setStateSupport() does not change support',
          function () {
            expect(states.hasStateSupport(target, State.ACTIVE)).to.be.false;
            states.setStateSupport(target, State.ACTIVE, false);
            expect(handler).to.not.have.been.called;
          });

        it('passes the state and its new support value to the handler',
          function () {
            states.setStateSupport(target, State.ACTIVE, true);
            var handlerArgs = handler.args[0];
            expect(handlerArgs).to.have.length(3);
            expect(handlerArgs[1]).to.equal(State.ACTIVE);
            expect(handlerArgs[2]).to.equal(true);
          });
      }); // CHANGE_STATE_SUPPORT

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
          var msg;

          msg = enable ?
            'is triggered when object enters ' + stateName + ' state' :
            'is triggered when object leaves ' + stateName + ' state';

          beforeEach(function () {
            states.setStateSupport(target, state, true);
            states.setState(target, state, !enable);
          });

          it(msg, function () {
            events.listen(target, event, handler);
            states.setState(target, state, enable);
            expect(handler).to.have.been.calledOnce;
          });

          it('is not triggered if state does not change', function () {
            states.setState(target, state, enable);
            events.listen(target, event, handler);
            states.setState(target, state, enable);
            expect(handler).to.not.have.been.called;
          });
        });
      }); // .forEach()
    });
  });
});
