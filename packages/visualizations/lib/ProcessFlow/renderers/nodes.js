"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var abstract_renderer_1 = require("./abstract_renderer");
var d3 = require("d3-selection");
require("d3-transition");
var d3_shape_1 = require("d3-shape");
var d3_utils_1 = require("../../utils/d3_utils");
var styles = require("./styles");
var nodeLabelOptions = {
    top: {
        dy: "0",
        textAnchor: "middle",
        x: 0,
        y: -1
    },
    bottom: {
        dy: "1em",
        textAnchor: "middle",
        x: 0,
        y: 1
    },
    middle: {
        dy: "0.35em",
        textAnchor: "middle",
        x: 0,
        y: 0
    },
    left: {
        dy: "0.35em",
        textAnchor: "end",
        x: -1,
        y: 0
    },
    right: {
        dy: "0.35em",
        textAnchor: "start",
        x: 1,
        y: 0
    }
};
var nodeShapeOptions = {
    squareDiamond: {
        symbol: d3_shape_1.symbolSquare,
        rotation: 45
    },
    square: {
        symbol: d3_shape_1.symbolSquare,
        rotation: 0
    },
    diamond: {
        symbol: d3_shape_1.symbolDiamond,
        rotation: 0
    },
    circle: {
        symbol: d3_shape_1.symbolCircle,
        rotation: 0
    }
};
var Nodes = /** @class */ (function (_super) {
    __extends(Nodes, _super);
    function Nodes() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "node";
        _this.focusElementAccessor = "path.node." + styles.border;
        return _this;
    }
    Nodes.prototype.updateDraw = function () {
        var nodeGroups = this.el
            .select("g.nodes-group")
            .selectAll("g.node-group")
            .data(this.data, function (node) { return node.id(); });
        this.exit(nodeGroups);
        this.enterAndUpdate(nodeGroups);
    };
    Nodes.prototype.nodeBorderScale = function (scale) {
        var _this = this;
        return function (size) {
            return Math.pow(Math.sqrt(scale(size)) + _this.config.nodeBorderWidth, 2);
        };
    };
    Nodes.prototype.translate = function (d) {
        return "translate(" + d.x + "," + d.y + ")";
    };
    Nodes.prototype.rotate = function (d) {
        return "rotate(" + nodeShapeOptions[d.shape()].rotation + ")";
    };
    Nodes.prototype.enterAndUpdate = function (nodeGroups) {
        var scale = this.sizeScale([this.config.minNodeSize, this.config.maxNodeSize]), borderScale = this.nodeBorderScale(scale);
        var enteringNodeGroups = nodeGroups
            .enter()
            .append("g")
            .attr("class", "node-group")
            .attr("transform", this.translate);
        enteringNodeGroups
            .append("path")
            .attr("class", "node " + styles.border)
            .attr("d", function (d) {
            return d3_shape_1.symbol()
                .type(nodeShapeOptions[d.shape()].symbol)
                .size(borderScale(d.size()))();
        })
            .attr("transform", this.rotate)
            .attr("fill", this.config.borderColor)
            .on("mouseenter", d3_utils_1.withD3Element(this.onMouseOver.bind(this)));
        enteringNodeGroups
            .append("path")
            .attr("class", "node " + styles.element)
            .attr("d", function (d) {
            return d3_shape_1.symbol()
                .type(nodeShapeOptions[d.shape()].symbol)
                .size(scale(d.size()))();
        })
            .attr("transform", this.rotate)
            .attr("fill", function (d) { return d.color(); })
            .attr("stroke", function (d) { return d.stroke(); })
            .attr("opacity", 0);
        enteringNodeGroups.append("text").attr("class", styles.label);
        nodeGroups
            .merge(enteringNodeGroups)
            .transition()
            .duration(this.config.duration)
            .attr("transform", this.translate);
        nodeGroups
            .merge(enteringNodeGroups)
            .selectAll("path.node." + styles.border)
            .transition()
            .duration(this.config.duration)
            .attr("d", function (d) {
            return d3_shape_1.symbol()
                .type(nodeShapeOptions[d.shape()].symbol)
                .size(borderScale(d.size()))();
        })
            .attr("transform", this.rotate);
        nodeGroups
            .merge(enteringNodeGroups)
            .selectAll("path.node." + styles.element)
            .transition()
            .duration(this.config.duration)
            .attr("d", function (d) {
            return d3_shape_1.symbol()
                .type(nodeShapeOptions[d.shape()].symbol)
                .size(scale(d.size()))();
        })
            .attr("transform", this.rotate)
            .attr("fill", function (d) { return d.color(); })
            .attr("stroke", function (d) { return d.stroke(); })
            .attr("opacity", 1)
            .call(d3_utils_1.onTransitionEnd, this.updateNodeLabels.bind(this));
    };
    Nodes.prototype.getNodeBoundingRect = function (el) {
        var node = d3
            .select(el.parentNode)
            .select("path.node." + styles.element)
            .node();
        return node.getBoundingClientRect();
    };
    Nodes.prototype.getLabelPosition = function (d) {
        return d.labelPosition() === "auto" ? this.getAutomaticLabelPosition(d) : d.labelPosition();
    };
    Nodes.prototype.getAutomaticLabelPosition = function (d) {
        var columnSpacing = this.state.current.get("computed").series.horizontalNodeSpacing;
        return (d.x / columnSpacing) % 2 === 1 ? "top" : "bottom";
    };
    Nodes.prototype.getNodeLabelX = function (d, el) {
        var offset = this.getNodeBoundingRect(el).width / 2 + this.config.nodeBorderWidth + this.config.labelOffset;
        return nodeLabelOptions[this.getLabelPosition(d)].x * offset;
    };
    Nodes.prototype.getNodeLabelY = function (d, el) {
        var offset = this.getNodeBoundingRect(el).height / 2 + this.config.nodeBorderWidth + this.config.labelOffset;
        return nodeLabelOptions[this.getLabelPosition(d)].y * offset;
    };
    Nodes.prototype.getLabelText = function (d) {
        // Pixel width of character approx 1/2 of font-size - allow 7px per character
        var desiredPixelWidth = this.state.current.get("computed").series.horizontalNodeSpacing, numberOfCharacters = desiredPixelWidth / 7;
        return d.label().substring(0, numberOfCharacters) + (d.label().length > numberOfCharacters ? "..." : "");
    };
    Nodes.prototype.updateNodeLabels = function () {
        var _this = this;
        var labels = this.el
            .select("g.nodes-group")
            .selectAll("text." + styles.label)
            .data(this.data, function (node) { return node.id(); });
        labels
            .enter()
            .merge(labels)
            .text(function (d) { return _this.getLabelText(d); })
            .attr("x", d3_utils_1.withD3Element(this.getNodeLabelX.bind(this)))
            .attr("y", d3_utils_1.withD3Element(this.getNodeLabelY.bind(this)))
            .attr("dy", function (d) { return nodeLabelOptions[_this.getLabelPosition(d)].dy; })
            .attr("text-anchor", function (d) { return nodeLabelOptions[_this.getLabelPosition(d)].textAnchor; });
    };
    Nodes.prototype.focusPoint = function (element, d) {
        if (d == null)
            return;
        var offset = this.getNodeBoundingRect(element.node()).width / 2;
        return {
            offset: offset,
            type: "node",
            x: d.x,
            y: d.y,
            id: d.id()
        };
    };
    return Nodes;
}(abstract_renderer_1.default));
exports.default = Nodes;
//# sourceMappingURL=nodes.js.map