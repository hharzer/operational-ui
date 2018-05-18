"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fp_1 = require("lodash/fp");
var d3_shape_1 = require("d3-shape");
var series_1 = require("./series/series");
var ChartSeriesManager = /** @class */ (function () {
    function ChartSeriesManager(state, stateWriter, events, el) {
        this.oldSeries = [];
        this.series = [];
        this.state = state;
        this.stateWriter = stateWriter;
        this.events = events;
        this.el = el;
    }
    ChartSeriesManager.prototype.assignData = function () {
        this.key = this.state.current.get("accessors").series.key;
        this.renderAs = this.state.current.get("accessors").series.renderAs;
        this.prepareData();
        this.stateWriter("dataForLegends", this.dataForLegends());
        this.stateWriter("dataForAxes", this.dataForAxes());
        this.stateWriter("barSeries", this.barSeries());
        this.stateWriter("axesWithFlags", this.axesWithFlags());
    };
    ChartSeriesManager.prototype.prepareData = function () {
        var _this = this;
        var isHidden = this.state.current.get("accessors").series.hide;
        var data = fp_1.flow(fp_1.omitBy(isHidden), this.computeBarIndices.bind(this), this.handleGroupedSeries("stacked", this.computeStack.bind(this)), this.handleGroupedSeries("range", this.computeRange.bind(this)))(this.state.current.get("accessors").data.series(this.state.current.get("data")));
        var currentKeys = fp_1.map(function (datum) { return _this.key(datum); })(data);
        this.removeAllExcept(currentKeys);
        fp_1.forEach(function (options) {
            var series = _this.get(_this.key(options));
            series ? series.update(options) : _this.create(options);
        })(data);
        // Remove hidden series
        var visibleSeriesKeys = fp_1.flow(fp_1.filter(function (series) { return !series.hide(); }), fp_1.map(function (series) { return _this.key(series.options); }))(this.series);
        this.removeAllExcept(visibleSeriesKeys);
    };
    ChartSeriesManager.prototype.computeBarIndices = function (data) {
        var _this = this;
        var i = 0;
        var barIndices = {};
        fp_1.forEach(function (series) {
            var hasBars = !!fp_1.find(function (renderOptions) { return renderOptions.type === "bars"; })(_this.renderAs(series));
            var stackedRenderer = fp_1.find(function (renderOptions) { return renderOptions.type === "stacked"; })(_this.renderAs(series));
            var hasStackedBars = !!stackedRenderer &&
                !!fp_1.find(function (renderOptions) { return renderOptions.type === "bars"; })(_this.renderAs(stackedRenderer));
            if (!hasBars && !hasStackedBars) {
                return;
            }
            if (hasBars) {
                barIndices[_this.key(series)] = i;
            }
            if (hasStackedBars) {
                fp_1.forEach(function (stackedSeries) {
                    barIndices[_this.key(stackedSeries)] = i;
                })(series.series);
            }
            i = i + 1;
        })(data);
        this.stateWriter("barIndices", barIndices);
        return data;
    };
    ChartSeriesManager.prototype.handleGroupedSeries = function (type, compute) {
        var _this = this;
        return function (data) {
            var groups = fp_1.filter(function (options) {
                var rendererTypes = fp_1.map(fp_1.get("type"))(_this.renderAs(options));
                var isGrouped = fp_1.includes(type)(rendererTypes);
                if (isGrouped && rendererTypes.length > 1) {
                    throw new Error("Renderer of type " + type + " cannot be combined with other renderers");
                }
                return isGrouped;
            })(data);
            if (groups.length === 0) {
                return data;
            }
            fp_1.forEach.convert({ cap: false })(compute)(groups);
            var ungroupedSeries = fp_1.filter(function (options) {
                var rendererTypes = fp_1.map(fp_1.get("type"))(_this.renderAs(options));
                return !fp_1.includes(type)(rendererTypes);
            })(data);
            fp_1.forEach(function (group) {
                fp_1.forEach(function (series) {
                    series.renderAs = _this.renderAs(_this.renderAs(group)[0]);
                    ungroupedSeries = ungroupedSeries.concat(series);
                })(group.series);
            })(groups);
            return ungroupedSeries;
        };
    };
    ChartSeriesManager.prototype.computeRange = function (range, index) {
        if (range.series.length !== 2) {
            throw new Error("Range renderer must have exactly 2 series.");
        }
        fp_1.forEach.convert({ cap: false })(function (series, i) {
            series.clipData = range.series[1 - i].data;
        })(range.series);
    };
    ChartSeriesManager.prototype.computeStack = function (stack, index) {
        var _this = this;
        // By default, stacks are vertical
        var stackAxis = this.renderAs(stack)[0].stackAxis || "y";
        var baseAxis = stackAxis === "y" ? "x" : "y";
        var value = function (series, axis) {
            var seriesAccessors = _this.state.current.get("accessors").series;
            var attribute = (axis === "x" ? seriesAccessors.xAttribute : seriesAccessors.yAttribute)(series);
            return fp_1.get(attribute);
        };
        // Transform data into suitable structure for d3 stack
        var seriesAccessors = this.state.current.get("accessors").series;
        var baseValues = fp_1.reduce(function (memo, series) {
            return memo.concat(fp_1.map(value(series, baseAxis))(series.data));
        }, [])(stack.series);
        var dataToStack = fp_1.flow(fp_1.uniqBy(String), fp_1.map(function (baseValue) {
            return _a = {}, _a[baseAxis] = baseValue, _a;
            var _a;
        }), fp_1.sortBy(baseAxis))(baseValues);
        fp_1.forEach(function (series) {
            fp_1.forEach(function (datum) {
                var newDatum = fp_1.find(function (d) { return String(d[baseAxis]) === String(value(series, baseAxis)(datum)); })(dataToStack);
                newDatum[series.key] = value(series, stackAxis)(datum);
            })(series.data);
        })(stack.series);
        var seriesKeys = fp_1.map(this.key)(stack.series);
        // Stack data
        var stackedData = d3_shape_1.stack()
            .value(function (d, key) { return d[key] || 0; })
            .keys(seriesKeys)(dataToStack);
        // Return to series data structure
        // @TODO typings
        fp_1.forEach(function (series) {
            var originalSeries = fp_1.find({ key: series.key })(stack.series);
            // @TODO typing
            var xAttribute = _this.state.current.get("accessors").series.xAttribute(originalSeries);
            var yAttribute = _this.state.current.get("accessors").series.yAttribute(originalSeries);
            originalSeries.data = fp_1.map(function (datum) {
                return _a = {},
                    _a[baseAxis] = datum.data[baseAxis],
                    _a[stackAxis] = datum.data[series.key],
                    _a["" + stackAxis + 0] = datum[0],
                    _a["" + stackAxis + 1] = datum[1],
                    _a;
                var _a;
            })(series);
            originalSeries.stacked = true;
            originalSeries.stackIndex = index + 1;
            originalSeries.xAttribute = "x";
            originalSeries.yAttribute = "y";
        })(stackedData);
    };
    ChartSeriesManager.prototype.get = function (key) {
        var _this = this;
        return fp_1.find(function (series) { return _this.key(series.options) === key; })(this.series);
    };
    ChartSeriesManager.prototype.remove = function (key) {
        var _this = this;
        var series = this.get(key);
        if (!series) {
            return;
        }
        this.oldSeries.push(series);
        fp_1.remove(function (series) { return _this.key(series.options) === key; })(this.series);
    };
    ChartSeriesManager.prototype.removeAllExcept = function (keys) {
        var _this = this;
        fp_1.flow(fp_1.filter(function (series) { return !fp_1.includes(_this.key(series.options))(keys); }), fp_1.map(function (series) { return _this.key(series.options); }), fp_1.forEach(this.remove.bind(this)))(this.series);
    };
    ChartSeriesManager.prototype.dataForLegends = function () {
        var data = {
            top: {
                left: [],
                right: [],
            },
            bottom: {
                left: [],
            },
        };
        fp_1.forEach(function (series) {
            if (series.hideInLegend()) {
                return;
            }
            data[series.legendPosition()][series.legendFloat()].push(series.dataForLegend());
        })(this.series);
        return data;
    };
    ChartSeriesManager.prototype.dataForAxes = function () {
        var data = { x1: [], x2: [], y1: [], y2: [] };
        fp_1.forEach(function (series) {
            var xAxis = series.xAxis();
            var yAxis = series.yAxis();
            data[xAxis] = fp_1.uniqBy(String)(data[xAxis].concat(series.dataForAxis("x")));
            data[yAxis] = fp_1.uniqBy(String)(data[yAxis].concat(series.dataForAxis("y")));
        })(this.series);
        return data;
    };
    ChartSeriesManager.prototype.barSeries = function () {
        return fp_1.reduce(function (memo, series) {
            var barsInfo = series.getBarsInfo();
            if (!barsInfo) {
                return memo;
            }
            memo[series.key()] = barsInfo;
            return memo;
        }, {})(this.series);
    };
    ChartSeriesManager.prototype.axesWithFlags = function () {
        return fp_1.reduce(function (axes, series) {
            if (series.hasFlags()) {
                var flag = series.get("flag");
                axes[flag.axis] = axes[flag.axis] || { axisPadding: 0 };
                axes[flag.axis].axisPadding = Math.max(axes[flag.axis].axisPadding, flag.axisPadding);
            }
            return axes;
        }, {})(this.series);
    };
    ChartSeriesManager.prototype.create = function (options) {
        this.series.push(new series_1.default(this.state, this.events, this.el, options));
    };
    ChartSeriesManager.prototype.draw = function () {
        fp_1.forEach(fp_1.invoke("close"))(this.oldSeries);
        this.oldSeries = [];
        fp_1.forEach(fp_1.invoke("draw"))(this.series);
    };
    return ChartSeriesManager;
}());
exports.default = ChartSeriesManager;
//# sourceMappingURL=series_manager.js.map