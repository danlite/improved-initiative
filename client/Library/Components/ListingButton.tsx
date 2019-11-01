import * as React from "react";

export interface CommonListingButtonProps {
  text?: string;
  buttonClass: string;
  faClass?: string;
  title?: string;
  children?: React.ReactNode;
}

interface ListingButtonProps extends CommonListingButtonProps {
  onClick: React.MouseEventHandler<HTMLSpanElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLSpanElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLSpanElement>;
}

export class ListingButton extends React.Component<ListingButtonProps> {
  public render() {
    const text = this.props.text || "";

    const cssClasses = [
      `c-listing-button`,
      `c-listing-${this.props.buttonClass}`
    ];
    if (this.props.faClass) {
      cssClasses.push("fas", `fa-${this.props.faClass}`);
    }

    return (
      <span
        className={cssClasses.join(" ")}
        onClick={this.props.onClick}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
        title={this.props.title}
      >
        {text} {this.props.children}
      </span>
    );
  }
}
