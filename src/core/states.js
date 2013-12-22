define([
  '../enum/eventtype',
  '../enum/state',
  './events',
], function (
  EventType,
  State,
  events
) {
  var states = {
    setState : function (target, state, enable) {
      if (!states.hasStateSupport(target, state)) {
        throw(new Error('State not supported'));
      }

      if (states.hasState(target, state) !== enable) {
        target.states_ = enable ?
          target.states_ | state :
          target.states_ & ~state;

        events.trigger(
          target,
          EventType.CHANGE_STATE,
          [state, enable]
        );
      }
    },

    hasState : function (target, state) {
      return !!target.states_ &&
        !!(target.states_ & state);
    },

    setStateSupport : function (target, state, support) {
      // Allows to pass an array of supported states
      if (state.length && typeof state !== 'string') {
        var len, i;
        for (i = 0, len = state.length; i < len; i += 1) {
          states.setStateSupport(target, state[i], support);
        }
        return;
      }

      if (states.hasStateSupport(target, state) !== support) {
        if (!support && states.hasState(target, state)) {
          states.setState(target, state, false);
        }

        target.supportedStates_ = support ?
          target.supportedStates_ | state :
          target.supportedStates_ & ~state;
        
        if (target.states_ === undefined) {
          target.states_ = 0;

          events.listen(
            target,
            EventType.CHANGE_STATE,
            states.changeStateHandler
          );
        }

        events.trigger(
          target,
          EventType.CHANGE_STATE_SUPPORT,
          [state, support]
        );
      }
    },

    hasStateSupport : function (target, state) {
      return !!target.supportedStates_ &&
        !!(target.supportedStates_ & state);
    },

    changeStateHandler : function (e, state, enable) {
      var event = getStateChangeEvent(state, enable);
      if (event) {
        events.trigger(e.currentTarget, event);
      }
    }
  };

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

  return states;
});
