import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Col, Layout, Row } from "antd";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { LISTING } from "../../lib/graphql/queries";
import { Listing as ListingData, ListingVariables } from "../../lib/graphql/queries/Listing/__generated__/Listing";
import { ListingBookings, ListingDetails } from "./components";

const { Content } = Layout;

const PAGE_LIMIT = 3;

export const Listing = () => {
  const [bookingsPage, setBookingsPage] = useState(1);

  const { id } = useParams();

  const { loading, data, error } = useQuery<ListingData, ListingVariables>(LISTING, {
    variables: {
      id: id || "",
      bookingsPage,
      limit: PAGE_LIMIT,
    },
  });

  if (loading) {
    return (
      <Content className="listings">
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="listing">
        <ErrorBanner description="This listing may not exist or we've encountered an error. Please try again soon." />
        <PageSkeleton />
      </Content>
    );
  }

  const listing = data ? data.listing : null;
  const listingBookings = listing ? listing.bookings : null;

  const listingDetailsElement = listing ? <ListingDetails listing={listing} /> : null;

  const listingBookingsElement = listingBookings ? (
    <ListingBookings
      listingBookings={listingBookings}
      bookingsPage={bookingsPage}
      limit={PAGE_LIMIT}
      setBookingsPage={setBookingsPage}
    />
  ) : null;

  return (
    <Content className="listings">
      <Row gutter={24} justify="space-between">
        <Col>
          {listingDetailsElement}
          {listingBookingsElement}
        </Col>
      </Row>
    </Content>
  );
};
