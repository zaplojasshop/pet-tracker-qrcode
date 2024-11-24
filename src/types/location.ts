export interface Location {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
  timestamp: string;
}

export interface LocationHistory {
  locations: Location[];
}