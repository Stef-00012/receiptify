export interface ReceiptData {
	tracksData: Array<Track>;
	totalTracks: number;
	tracks: number;
	total: ReceiptTotal;
	subTotal: ReceiptTotal;
	year: number;
	period:
		| "overall"
		| "7day"
		| "1month"
		| "3month"
		| "6month"
		| "12month"
		| "spotify";
	dateGenerated: string;
	orderNumber: number;
	username: string;
	cardHolder: string;
	authCode: number;
	thanks: string;
}

export interface Track {
	name: string;
	artist: TrackArtist;
	artists?: Array<TrackArtist>;
	url: string;
	duration: string;
	durationSeconds: number;
	totalDuration: string;
	totalDurationSeconds: number;
	playCount: number | string;
}

export interface TrackArtist {
	url: string;
	name: string;
}

export interface ReceiptTotal {
	amount: number;
	duration: string;
	timeSeconds: number;
}
