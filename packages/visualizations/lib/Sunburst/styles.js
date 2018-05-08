"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var glamor_1 = require("glamor");
var theme_1 = require("@operational/theme");
var arcStyle = {
    strokeWidth: "1",
    stroke: "#fff",
    opacity: 0.8,
    fill: "#eee",
    "&.zoomable": {
        cursor: "zoom-in",
    },
    "&.zoomed": {
        cursor: "zoom-out",
    },
    "&.zoomed.parent": {
        cursor: "default",
    },
    "&.empty": {
        stroke: "#aaa",
        strokeDasharray: "5",
    },
};
var labelStyle = __assign({ fill: "#333", stroke: "none" }, theme_1.operational.typography.small);
var totalStyle = __assign({ fill: "#4c4c4c" }, theme_1.operational.typography.small);
var breadcrumbStyle = {
    width: "100%",
    height: "40px",
    position: "relative",
    overflow: "hidden",
};
var breadcrumbItemStyle = __assign({ float: "left", width: "80px", height: "18px", position: "relative", paddingLeft: "14px", lineHeight: "18px", cursor: "pointer", margin: "5px 0" }, theme_1.operational.typography.small, { "&:first-child": {
        paddingLeft: "8px",
    }, "&.hops": {
        width: "40px",
    }, "& .label": {
        pointerEvents: "none",
        float: "left",
        display: "block",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        width: "65px",
    }, "& .background-arrow": {
        content: "''",
        position: "absolute",
        width: 0,
        height: 0,
        borderLeft: "solid 7px #fff",
        borderTop: "solid 11px transparent",
        borderBottom: "solid 11px transparent",
        top: "50%",
        left: "100%",
        marginTop: "-11px",
        zIndex: "2",
    }, "& .arrow": {
        content: "''",
        position: "absolute",
        width: 0,
        height: 0,
        borderLeft: "solid 5px #fff",
        borderTop: "solid 9px transparent",
        borderBottom: "solid 9px transparent",
        top: "50%",
        left: "100%",
        marginTop: "-9px",
        zIndex: "3",
    } });
var centerCircleStyle = {
    fill: "#fff",
    pointerEvents: "none",
};
var rootLabelStyle = {
    position: "absolute",
    textAlign: "center",
    pointerEvents: "none",
    overflow: "hidden",
    textOverflow: "ellipsis",
    "& .name": __assign({}, theme_1.operational.typography.small)
};
var arrowStyle = {
    fill: "transparent",
    stroke: "#bbb",
    strokeWidth: "1px",
    cursor: "zoom-in",
    "&:hover": {
        stroke: "#aaa",
    },
};
exports.arc = glamor_1.css(arcStyle).toString();
exports.label = glamor_1.css(labelStyle).toString();
exports.total = glamor_1.css(totalStyle).toString();
exports.breadcrumb = glamor_1.css(breadcrumbStyle).toString();
exports.breadcrumbItem = glamor_1.css(breadcrumbItemStyle).toString();
exports.centerCircle = glamor_1.css(centerCircleStyle).toString();
exports.rootLabel = glamor_1.css(rootLabelStyle).toString();
exports.arrow = glamor_1.css(arrowStyle).toString();
//# sourceMappingURL=styles.js.map