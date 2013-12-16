define([
  'src/enum/eventtype',
  'src/enum/state',
  'src/support/extend',
  'src/support/inherit',
  'src/core/eventtarget'
], function (EventType, State, extend, inherit, EventTarget) {

  function getStateChangeEvent(state, enable) {
    switch (state) {
      case State.ACTIVE:
        return enable ? EventType.ACTIVATE : EventType.DEACTIVATE;
      case State.ENABLED:
        return enable ? EventType.ENABLE : EventType.DISABLE;
      case State.VISIBLE:
        return enable ? EventType.SHOW : EventType.HIDE;
      case State.OPEN:
        return enable ? EventType.OPEN : EventType.CLOSE;
      case State.LOADED:
        return enable ? EventType.LOAD : EventType.UNLOAD;
      case State.DISPOSED:
        // Disposed events should not be "undisposed"
        if (enable) { return EventType.DISPOSE; }
      case State.RENDERED:
        // XXX: I couldn't find an antonym for "render" that wouldn't
        // get confused with "hide" or "remove" (as from a list).
        return enable ? EventType.RENDER : EventType.UNRENDER;
    }
  }

  function stateChangeHandler(e, state, enable) {
    var event = getStateChangeEvent(state, enable);
    if (event) {
      e.currentTarget.trigger(event);
    }
  }

  function StatefullObject() {
    EventTarget.call(this);
    this.on(EventType.CHANGE_STATE, stateChangeHandler);
  }

  inherit(StatefullObject, EventTarget);

  extend(StatefullObject.prototype, {
    states_ : 0,
    supportedStates_ : 0,

    setState : function (state, enable) {
      if (!this.hasStateSupport(state)) {
        throw(new Error('State not supported'));
      }

      if (this.hasState(state) !== enable) {
        this.states_ = enable ? this.states_ | state : this.states_ & ~state;
        this.trigger(EventType.CHANGE_STATE, [state, enable]);
      }
    },

    setStateSupport : function (state, support) {
      // Allows to pass an array of supported states
      if (state.length && typeof state !== 'string') {
        var len, i;
        for (i = 0, len = state.length; i < len; i += 1) {
          this.setStateSupport(state[i], support);
        }
        return;
      }

      if (this.hasStateSupport(state) !== support) {
        if (!support && this.hasState(state)) {
          this.setState(state, false);
        }

        this.supportedStates_ = support ?
          this.supportedStates_ | state :
          this.supportedStates_ & ~state;

        this.trigger(EventType.CHANGE_STATE_SUPPORT, [state, support]);
      }
    },

    hasState : function (state) {
      return !!(this.states_ & state);
    },

    hasStateSupport : function (state) {
      return !!(this.supportedStates_ & state);
    }
  });

  return StatefullObject;
});
