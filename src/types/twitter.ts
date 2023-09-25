export interface Rule {
  value: string;
  tag: string;
}

export interface MatchingRule {
  value: string;
  tag: string;
}

export interface User {
  id: string;
  name: string;
  profile_image_url: string;
  username: string;
  verified: boolean;
  protected: boolean;
  created_at: string;
  description: string;
}

export interface Place {
  id: string;
  name: string;
  place_type: string;
  country: string;
  country_code: string;
  full_name: string;
  geo: {
    type: string;
    bbox: number[];
    properties: any;
  };
}

export interface TweetRaw {
  author_id: string;
  created_at: string;
  id: string;
  lang: string;
  possibly_sensitive: boolean;
  reply_settings: string;
  source: string;
  text: string;
}

export interface TweetStream {
  includes: {
    places: Place[];
    users: User[];
    tweets: TweetRaw[];
  };
  matching_rules: MatchingRule[];
}

export interface Geotag {
  id: string;
  name: string;
  place_type: string;
  full_name: string;
  country: string;
  country_code: string;
  coordinates: {
    lat: number;
    long: number;
  };
}

export interface TweetFormatted {
  id: string;
  userId: string; // associate with twitter id in Vendor
  userName: string;
  text: string;
  date: string;
  geo: Geotag;
}
