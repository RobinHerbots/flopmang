'use strict';
var _ = require('underscore');
var Arg = require('../lib/arg.js');

// Static helper functions
/**
 * Helper function to test for null values (useful in array.filter)
 * @param [any] val The value to be tested
 * @return [boolean] false if the value is null
 */
var isNotNull = function (val) {
    return val !== null;
};

/**
 * Constructor for ArgUtil prototype
 * @param [function] gruntTask The current grunt task
 * (usually `this` in the context of a grunt task, or `grunt.task.current`
 * @param [array] configs an array of Argument configuration objects
 */
var ArgUtil = function (gruntTask, configs) {
    var self = this;
    this.args = configs.map(function createArg(config) {
        return new Arg(config);
    });
    var defaultOptions = this.generateDefaultOptions(self.args);

    this.options = gruntTask.options.call(gruntTask, defaultOptions);

    this.setArgValuesFromOptions();
};

/**
 * Generate an object containing the option and default value for each arg
 * in this.args
 * @return [object] and object containing `object: defaultValue` pairs
 */
ArgUtil.prototype.generateDefaultOptions = function () {
    return this.args.reduce(function createDefOpt(options, arg) {
        options[arg.option] = arg.defaultValue;
        return options;
    }, {});
};

/**
 * Set the value of each arg in this.args from the options
 * @param [options] options An object containing option:value pairs
 * @return [object] this ArgUtil object
 */
ArgUtil.prototype.setArgValuesFromOptions = function () {
    var self = this;
    this.args = this.args.map(function callSetValue(arg) {
        return arg.setValueFromOptions(self.options);
    });
    return this;
};

/**
 * Get array of flags for all args
 * @return [array] An array of flags generated by each arg in this.args
 */
ArgUtil.prototype.getArgFlags = function () {
    return _.flatten(this.args.map(function callGetFlags(arg) {
        return [
            arg.getFlag(),
            arg.getValue()
        ];
    })).filter(isNotNull);
};

module.exports = ArgUtil;
