"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var glamorous_1 = require("glamorous");
var Container = glamorous_1.default.div(function (_a) {
    var theme = _a.theme, width = _a.width, padding = _a.padding;
    return ({
        width: width,
        label: "card",
        padding: theme.spacing * 4 / 3,
        boxShadow: theme.shadows.card,
        backgroundColor: theme.colors.cardBackground,
        "& p": {
            lineHeight: "20px"
        },
        "& > img": {
            maxWidth: "100%"
        }
    });
});
var Card = function (props) { return (React.createElement(Container, { key: props.id, css: props.css, width: props.width, className: props.className }, props.children)); };
exports.default = Card;
//# sourceMappingURL=Card.js.map