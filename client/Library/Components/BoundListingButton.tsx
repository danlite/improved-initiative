import * as React from "react";
import { Listable } from "../../../common/Listable";
import { Listing } from "../Listing";
import { CommonListingButtonProps, ListingButton } from "./ListingButton";

interface BoundListingButtonProps<T extends Listable>
  extends CommonListingButtonProps {
  onClick: (listing: Listing<T>, modified: boolean) => void;
  listing: Listing<T>;
}

export class BoundListingButton<T extends Listable> extends React.Component<
  BoundListingButtonProps<T>
> {
  private onClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    this.props.onClick(this.props.listing, event.altKey);
  };

  public render() {
    const { onClick, listing, ...listingButtonProps } = this.props;
    return <ListingButton {...listingButtonProps} onClick={this.onClick} />;
  }
}
