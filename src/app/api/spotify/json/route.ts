import type { ReceiptData } from "@/types/receipt";
import type {
	SpotifyProfileResponse,
	SpotifyTopTracksResponse,
} from "@/types/spotify";
import axios, { type AxiosError } from "axios";
import { Duration } from "luxon";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const query = request.nextUrl.searchParams;

	const accessToken = query.get("accessToken");

	if (!accessToken)
		return NextResponse.json(
			{
				message: "Missing Authorization",
				code: 403,
			},
			{
				status: 403,
			},
		);

	const weekdays = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const date = new Date();

	try {
		const profileRequest = await axios.get("https://api.spotify.com/v1/me", {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		const profileRequestData = profileRequest.data as SpotifyProfileResponse;

		const type = "tracks";
		const timeRange = "long_term";
		const limit = 50;

		const urlParams = new URLSearchParams({
			time_range: timeRange,
			limit: String(limit),
		});

		const topTracksRequest = await axios.get(
			`https://api.spotify.com/v1/me/top/${type}?${urlParams}`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);

		const topTracksData = topTracksRequest.data as SpotifyTopTracksResponse<
			typeof type
		>;

		const spotifyUsername = profileRequestData.display_name ?? "Unknown";

		const spotifyTracksData = topTracksData.items.map((track) => ({
			name: track.name,
			artist: {
				url: track.artists[0].external_urls.spotify,
				name: track.artists[0].name,
			},
			artists: track.artists.map((artist) => ({
				url: artist.external_urls.spotify,
				name: artist.name,
			})),
			url: track.external_urls.spotify,
			duration: convertMsToTime(track.duration_ms),
			durationSeconds: track.duration_ms / 1000,
			totalDuration: convertMsToTime(track.duration_ms),
			totalDurationSeconds: track.duration_ms / 1000,
			playCount: "1",
		}));

		for (const index in spotifyTracksData) {
			const playCount =
				Number.parseInt(index) < 9
					? `0${Number.parseInt(index) + 1}`
					: `${Number.parseInt(index) + 1}`;

			spotifyTracksData[index].playCount = playCount;
		}

		const tracksData = spotifyTracksData;
		const totalTracks = topTracksData.total;

		const total = {
			amount: topTracksData.total,
			duration: convertMsToTime(
				topTracksData.items
					.map((track) => track.duration_ms)
					.reduce((a, b) => a + b, 0),
			),
			timeSeconds: topTracksData.items
				.map((track) => track.duration_ms / 1000)
				.reduce((a, b) => a + b, 0),
		};

		const subTotal = {
			amount: topTracksData.limit,
			duration: convertMsToTime(
				topTracksData.items
					.map((track) => track.duration_ms)
					.reduce((a, b) => a + b, 0),
			),
			timeSeconds: topTracksData.items
				.map((track) => track.duration_ms / 1000)
				.reduce((a, b) => a + b, 0),
		};

		const year = date.getFullYear();
		const period = "spotify";
		const dateGenerated = `${weekdays[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
		const orderNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

		const username = spotifyUsername;
		const cardHolder = spotifyUsername;
		const authCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
		const thanks = "Thank you for using stef's website";

		const receiptData: ReceiptData = {
			tracksData,
			totalTracks,
			tracks: spotifyTracksData.slice(0, 50).length,
			total,
			subTotal,
			year,
			period,
			dateGenerated,
			orderNumber,
			username,
			cardHolder,
			authCode,
			thanks,
		};

		return NextResponse.json(receiptData, {
			status: 200,
		});
	} catch (err) {
		const error = err as AxiosError;

		const statusCode = error.response?.status || 500;
		let errorMessage: string;

		switch (statusCode) {
			case 429: {
				errorMessage = "You are being ratelimited by spotify";

				break;
			}
			default:
				errorMessage = "Something went wrong...";
		}

		return NextResponse.json(
			{
				code: statusCode,
				message: errorMessage,
			},
			{
				status: statusCode,
			},
		);
	}
}

function convertMsToTime(milliseconds: number): string {
	const duration = Duration.fromObject({
		milliseconds,
	});

	const splitDuration = duration.toFormat("yy:MM:dd:hh:mm:ss").split(":");

	while (splitDuration[0] === "00") {
		splitDuration.shift();
	}

	return splitDuration.join(":");
}
