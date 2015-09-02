'use strict';

var React = require('react/addons');
var update = React.addons.update;

module.exports = {

  merge: function merge(obj1, obj2) {
    if (!obj1) return obj2;
    if (!obj2) return obj1;
    return update(obj1, { $merge: obj2 });
  },

  mergeItem: function mergeItem(obj, key, newValueObject) {
    var command = {};
    command[key] = { $merge: newValueObject };
    return update(obj, command);
  },

  push: function push(array, obj) {
    var newObj = Array.isArray(obj) ? obj : [obj];
    return update(array, { $push: newObj });
  },

  shift: function shift(array) {
    return update(array, { $splice: [[0, 1]] });
  }

};