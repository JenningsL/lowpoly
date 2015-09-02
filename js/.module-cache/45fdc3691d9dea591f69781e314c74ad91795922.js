'use strict';

var React = require('react');
var AutoPrefix = require('../styles/auto-prefix');
var ImmutabilityHelper = require('../utils/immutability-helper');

/**
 *	@params:
 *	styles = Current styles.
 *  props = New style properties that will override the current style.
 */
module.exports = {

  propTypes: {
    style: React.PropTypes.object
  },

  mergeStyles: function mergeStyles() {

    var args = Array.prototype.slice.call(arguments, 0);
    var base = args[0];

    for (var i = 1; i < args.length; i++) {
      if (args[i]) {
        base = ImmutabilityHelper.merge(base, args[i]);
      }
    }

    return base;
  },

  /**
   * loops through all properties defined in the first argument, so overrides
   * of undefined properties will not take place.
   */
  mergeAndPrefix: function mergeAndPrefix() {
    var mergedStyles = this.mergeStyles.apply(this, arguments);
    return AutoPrefix.all(mergedStyles);
  }
};