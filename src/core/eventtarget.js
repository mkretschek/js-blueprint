define([
  'jquery'
], function ($) {
  function EventTarget() {
    this.$ = $(this);
  }

  EventTarget.prototype = {
    on : function () {
      $.fn.on.apply(this.$, arguments);
    },

    once : function () {
      $.fn.one.apply(this.$, arguments);
    },

    off : function () {
      $.fn.off.apply(this.$, arguments);
    },

    trigger : function () {
      $.fn.triggerHandler.apply(this.$, arguments);
    }
  };

  return EventTarget;
});
