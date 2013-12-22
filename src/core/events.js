define([
  'jquery'
], function ($) {
  return {
    listen : function (target, event, handler) {
      $(target).on(event, handler);
    },

    unlisten : function (target, event, handler) {
      $(target).off(event, handler);
    },

    trigger : function (target, event, params) {
      $(target).triggerHandler(event, params);
    }
  };
});
