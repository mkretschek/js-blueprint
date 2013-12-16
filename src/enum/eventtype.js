define(function () {
  return {
    ACTIVATE          : 'activate',
    ADD_ITEM          : 'add_item',
    CHANGE_STATE_SUPPORT : 'changestatesupport',
    CHANGE_STATE      : 'chagnestate',
    CHILD_ADDED       : 'childadded',
    ADD_CHILD         : 'addchild',
    ADD_ROUTE         : 'addroute',
    CLICK             : 'click',
    CLOSE             : 'close',
    DEACTIVATE        : 'deactivate',
    DISABLE           : 'disable',
    DISPOSE           : 'dispose',
    ENABLE            : 'enable',
    ERROR             : 'error',
    HIDE              : 'hide',
    INITIALIZE        : 'initialize',
    LOAD              : 'load',
    OPEN              : 'open',
    REMOVE            : 'remove',
    REMOVE_ITEM       : 'remove_item',
    RENDER            : 'render',
    PARENT_SET        : 'parentset',
    SHOW              : 'show',
    STATE_CHANGE      : 'statechange',
    UNLOAD            : 'unload',
    // TODO: find a better name for this event, since unrender does not exist
    // (couldn't find an antonym for render that doesn't get confused with
    // hide or remove)
    UNRENDER          : 'unrender'
  };
});
