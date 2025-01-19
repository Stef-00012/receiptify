export interface SpotifyProfileResponse {
    country?: string;
    display_name: string | null;
    email?: string;
    explicitContent?: ExplicitContent;
    external_urls: ExternalUrls;
    followers: Followers;
    href: string;
    id: string;
    images: Array<Image>;
    product?: "premium" | "free" | "open";
    type: "user";
    uri: string;
}

export interface SpotifyTopTracksResponse<type extends "artists" | "tracks"> {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: Array<type extends "artists" ? Artist : Track>;
}

export interface Artist {
    external_urls: ExternalUrls;
    followers: Followers;
    genres: Array<string>;
    href: string;
    id: string;
    images: Array<Image>;
    name: string;
    popularity: number;
    type: "artist",
    uri: string;
}

export interface Track {
    album: Album;
    artists: Array<SimplifiedArtist>;
    avaible_markets: Array<string>;
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: TrackExternalIds;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    is_playable: boolean;
    restrictions: Restrictions;
    name: string;
    popularity: number;
    preview_url?: string | null;
    track_number: number;
    type: "track";
    uri: string;
    is_local: boolean;
}

export interface TrackExternalIds {
    isrc: string;
    ean: string;
    upc: string;
}

export interface Album {
    albuum_type: "album" | "single" | "compilation";
    total_tracks: number;
    avaible_markets: Array<string>;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: Array<Image>;
    name: string;
    release_date: string;
    release_date_precision: "year" | "month" | "day";
    restrictions: Restrictions;
    type: "album";
    uri: string;
    artists: Array<SimplifiedArtist>
}

export interface Restrictions {
    reason: "market" | "product" | "explicit";
}

export interface SimplifiedArtist {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: "atist",
    uri: string;
}

export interface ExplicitContent {
    filter_enabled: boolean;
    filter_locked: boolean;
}

export interface ExternalUrls {
    spotify: string;
}

export interface Followers {
    href: string | null;
    total: number;
}

export interface Image {
    url: string;
    height: number | null;
    width: number | null;
}