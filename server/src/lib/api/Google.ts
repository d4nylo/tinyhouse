import { AddressComponent, AddressType, Client, GeocodeRequest } from "@googlemaps/google-maps-services-js";
import { google } from "googleapis";

const auth = new google.auth.OAuth2(
  process.env.G_CLIENT_ID,
  process.env.G_CLIENT_SECRET,
  `${process.env.PUBLIC_URL}/login`
);

const maps = new Client({});

const parseAddress = (addressComponents: AddressComponent[]) => {
  let country = null;
  let admin = null;
  let city = null;

  for (const component of addressComponents) {
    if (component.types.includes(AddressType.country)) {
      country = component.long_name;
    }

    if (component.types.includes(AddressType.administrative_area_level_1)) {
      admin = component.long_name;
    }

    if (component.types.includes(AddressType.locality) || component.types.includes(AddressType.postal_town)) {
      city = component.long_name;
    }
  }

  return { country, admin, city };
};

export const Google = {
  /* Derives the authentication URL from Google's servers where users are directed to on the client to first sign-in with their Google account information. */
  authUrl: auth.generateAuthUrl({
    access_type: "online",
    scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"],
  }),
  /* Function that uses Google's People API to get relevant information (i.e. their emails, names, and photos) for the Google account of a user. */
  logIn: async (code: string) => {
    const { tokens } = await auth.getToken(code);

    auth.setCredentials(tokens);

    const { data } = await google.people({ version: "v1", auth }).people.get({
      resourceName: "people/me",
      personFields: "emailAddresses,names,photos",
    });

    return { user: data };
  },
  geocode: async (address: string) => {
    const req: GeocodeRequest = {
      params: {
        key: `${process.env.G_GEOCODE_KEY}`,
        address: address,
      },
    };

    const res = await maps.geocode(req);

    if (res.status < 200 || res.status > 299) {
      throw new Error("failed to geocode address");
    }

    return parseAddress(res.data.results[0].address_components);
  },
};

// ↓ OAuth 2.0 Scopes for Google APIs ↓
// https://developers.google.com/identity/protocols/oauth2/scopes

// ↓ Method used to get information about a person's Google account ↓
// https://developers.google.com/people/api/rest/v1/people/get

// ↓ Google Maps Geocoding API Documentation ↓
// https://developers.google.com/maps/documentation/geocoding/overview#Types
