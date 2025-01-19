export interface UserGetTopTracksReponse {
	toptracks: TopTracks;
}

export interface TopTracks {
	"@attr": ResponseAttributes;
	track: Array<Track>;
}

export interface ResponseAttributes {
	user: string;
	totalPages: string;
	page: string;
	perPage: string;
	total: string;
}

export interface Track {
	streamable: TrackStreamable;
	mbid: string;
	name: string;
	image: Array<TrackImage>;
	artist: TrackArtist;
	url: string;
	duration: string;
	"@attr": TrackAttributes;
	playcount: string;
}

export interface TrackStreamable {
	fulltrack: string;
	"#text": string;
}

export interface TrackImage {
	size: string;
	"#text": string;
}

export interface TrackArtist {
	url: string;
	name: string;
	mbid: string;
}

export interface TrackAttributes {
	rank: string;
}
