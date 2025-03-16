export default function getButtonStatus() {
	return {
		lastFm: process.env.NEXT_PUBLIC_LASTFM_ENABLED !== "true",
		spotify: process.env.NEXT_PUBLIC_SPOTIFY_ENABLED !== "true",
	};
}
