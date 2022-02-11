import { server } from "../../lib/api";
import { ListingsData } from "./types";

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

interface Props {
  title: string;
}

export const Listings = ({ title }: Props) => {
  const fetchListings = async () => {
    const { data } = await server.fetch<ListingsData>({ query: LISTINGS });
    console.log(data);
  };

  return (
    <div>
      <h2>{title}</h2>
      <button onClick={fetchListings}>Query Listings!</button>
    </div>
  );
};
