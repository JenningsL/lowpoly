'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var React = require('react/addons');
var PureRenderMixin = React.addons.PureRenderMixin;
var StylePropable = require('../mixins/style-propable');
var AutoPrefix = require('../styles/auto-prefix');
var Transitions = require('../styles/transitions');
var Colors = require('../styles/colors');

var CircleRipple = React.createClass({
  displayName: 'CircleRipple',

  mixins: [PureRenderMixin, StylePropable],

  propTypes: {
    color: React.PropTypes.string,
    opacity: React.PropTypes.number
  },

  getDefaultProps: function getDefaultProps() {
    return {
      color: Colors.darkBlack,
      opacity: 0.16
    };
  },

  componentDidEnter: function componentDidEnter() {
    var style = React.findDOMNode(this).style;
    AutoPrefix.set(style, 'transform', 'scale(1)');
  },

  componentWillEnter: function componentWillEnter(callback) {
    var style = React.findDOMNode(this).style;
    style.opacity = this.props.opacity;
    AutoPrefix.set(style, 'transform', 'scale(0)');
    setTimeout(callback, 0);
  },

  componentWillLeave: function componentWillLeave(callback) {
    var _this = this;

    var style = React.findDOMNode(this).style;
    style.opacity = 0;
    setTimeout((function () {
      if (_this.isMounted()) callback();
    }).bind(this), 2000);
  },

  render: function render() {
    var _props = this.props;
    var color = _props.color;
    var opacity = _props.opacity;
    var style = _props.style;

    var other = _objectWithoutProperties(_props, ['color', 'opacity', 'style']);

    var mergedStyles = this.mergeAndPrefix({
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      borderRadius: '50%',
      backgroundColor: color,
      transition: Transitions.easeOut('2s', 'opacity') + ',' + Transitions.easeOut('1s', 'transform')
    }, style);

    return React.createElement('div', _extends({}, other, { style: mergedStyles }));
  }

});

module.exports = CircleRipple;