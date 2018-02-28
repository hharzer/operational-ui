/// <reference types="react" />
import * as React from "react";
export interface IProps {
    css?: {};
    className?: string;
    children?: React.ReactNode;
    controls?: React.ReactNode;
    initiallyExpanded?: boolean;
}
export interface IState {
    isExpanded: boolean;
}
export default class Record extends React.Component<IProps, IState> {
    constructor(props: IProps);
    render(): JSX.Element;
}
