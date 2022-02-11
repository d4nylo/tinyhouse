import { server } from "../../lib/api";
import { DeleteListingData, DeleteListingVariables, ListingsData } from "./types";

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
  const fetchListings = async () => {
    const { data } = await server.fetch<ListingsData>({ query: LISTINGS });

    console.log(data);
  };

  const deleteListing = async () => {
    const { data } = await server.fetch<DeleteListingData, DeleteListingVariables>({
      query: DELETE_LISTING,
      variables: {
        id: "62059faab4fc918aa3be40fc",
      },
    });

    console.log(data);
  };

  return (
    <div>
      <h2>{title}</h2>
      <button onClick={fetchListings}>Query Listings!</button>
      <button onClick={deleteListing}>Delete a Listing!</button>
    </div>
  );
};
