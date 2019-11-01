import _ = require("lodash");
import * as React from "react";
import { Listable } from "../../../common/Listable";
import { linkComponentToObservables } from "../../Combatant/linkComponentToObservables";
import { Listing } from "../Listing";
import { BoundListingButton } from "./BoundListingButton";
import { ListingButton } from "./ListingButton";

export interface ButtonInfo<T extends Listable> {
  title?: string;
  buttonClass: string;
  faClass: string;
  onClick: (listing: Listing<T>, modified?: boolean) => void;
}

export const MakeEditButton: <T extends Listable>(
  onClick: ButtonInfo<T>["onClick"]
) => ButtonInfo<T> = onClick => ({
  title: "Edit",
  buttonClass: "edit",
  faClass: "edit",
  onClick
});

export interface ListingProps<T extends Listable> {
  name: string;
  listing: Listing<T>;
  onAdd: (listing: Listing<T>, modified: boolean) => boolean;
  onPreview?: (
    listing: Listing<T>,
    e: React.MouseEvent<HTMLDivElement>
  ) => void;
  onPreviewOut?: (listing: Listing<T>) => void;
  buttons?: ButtonInfo<T>[];
  showCount?: boolean;
}

interface ListingState {
  count: number;
}

export class ListingRow<T extends Listable> extends React.Component<
  ListingProps<T>,
  ListingState
> {
  private addFn = async (event: React.MouseEvent<HTMLSpanElement>) => {
    const didAdd = this.props.onAdd(this.props.listing, event.altKey);
    if (didAdd && this.props.showCount) {
      const currentCount = (this.state && this.state.count) || 0;
      this.setState({
        count: currentCount + 1
      });
    }
  };
  private previewFn = e => this.props.onPreview(this.props.listing, e);
  private previewOutFn = () => this.props.onPreviewOut(this.props.listing);

  constructor(props) {
    super(props);
    linkComponentToObservables(this);
  }

  public render() {
    const addedCount = this.props.showCount && this.state && this.state.count;
    const countElements = addedCount
      ? _.range(addedCount).map(i => (
          <span className="c-listing__counter" key={i}>
            ●
          </span>
        ))
      : "";
    return (
      <li className="c-listing">
        <ListingButton
          buttonClass="add"
          text={this.props.name}
          onClick={this.addFn}
        >
          {countElements}
        </ListingButton>
        {this.props.buttons &&
          this.props.buttons.map((button, index) => (
            <BoundListingButton
              key={index}
              listing={this.props.listing}
              title={button.title}
              buttonClass={button.buttonClass}
              faClass={button.faClass}
              onClick={button.onClick}
            />
          ))}
        {this.props.onPreview && (
          <ListingButton
            buttonClass="preview"
            faClass="search"
            onClick={this.previewFn}
            onMouseEnter={this.previewFn}
            onMouseLeave={this.previewOutFn}
          />
        )}
      </li>
    );
  }
}
