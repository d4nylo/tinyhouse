import { useState } from "react";
import { server } from "../../lib/api";
import { DeleteListingData, DeleteListingVariables, Listing, ListingsData } from "./types";

const LISTINGS = `
  query Listings {
    listings {
      id,
      title,
      image, 
      address, 
      price, 
      numOfGuests, 
      numOfBeds, 
      rating
    }
  }
`;

const DELETE_LISTING = `
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
      title
    }
  }
`;

interface Props {
  title: string;
}

export const Listings = ({ title }: Props) => {
  const [listings, setListings] = useState<Listing[] | null>(null);

  const fetchListings = async () => {
    const { data } = await server.fetch<ListingsData>({ query: LISTINGS });
    setListings(data.listings);
  };

  const deleteListing = async (id: string) => {
    await server.fetch<DeleteListingData, DeleteListingVariables>({
      query: DELETE_LISTING,
      variables: {
        id: id,
      },
    });

    fetchListings();
  };

  const listingsList = listings ? (
    <ul>
      {listings.map((l) => {
        return (
          <li key={l.id}>
            {l.title}
            <button onClick={() => deleteListing(l.id)}>Delete</button>
          </li>
        );
      })}
    </ul>
  ) : null;

  return (
    <div>
      <h2>{title}</h2>
      <button onClick={fetchListings}>Query Listings!</button>
      {listingsList}
    </div>
  );
};
