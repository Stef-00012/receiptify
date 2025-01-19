import { validPeriods } from "@/data/constants";
import axios, { type AxiosError } from "axios";
import type { UserGetTopTracksReponse } from "@/types/lastFm";
import { Duration } from "luxon";
import { type NextRequest, NextResponse } from "next/server";
import type { ReceiptData } from "@/types/receipt";

export async function GET(request: NextRequest) {
	const query = request.nextUrl.searchParams;

	const method = "user.gettoptracks";
	const user = query.get("user") || "Stef_DP";
	const format = "json";
	const limit = 1000;

	const period = query.get("period") || "1month";
	const tracksLimit = Number.parseInt(query.get("trackCount") || "") || 20;
	const inputPeriod = validPeriods.includes(period as typeof validPeriods[number]) ? period as typeof validPeriods[number] : "1month";

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

	const urlParams = new URLSearchParams({
		method,
		user,
		format,
		limit: String(limit),
		period: inputPeriod,
		api_key: process.env.LASTFM_API_KEY || "",
	});

	const url = `https://ws.audioscrobbler.com/2.0/?${urlParams.toString()}`;

	try {
		const request = await axios.get(url);
		const data = request.data as UserGetTopTracksReponse;

		const tracks = data.toptracks.track;

		const pageData = data.toptracks["@attr"];

		for (let page = 2; page <= Number(pageData.totalPages); page++) {
			try {
				const paginatedUrl = `https://ws.audioscrobbler.com/2.0/?${urlParams}&page=${page}`;

				const paginatedRequest = await axios.get(paginatedUrl);
				const paginatedRequestData =
					paginatedRequest.data as UserGetTopTracksReponse;

				tracks.push(...paginatedRequestData.toptracks.track);
			} catch (e) {
				console.error(e);
			}
		}

		const formattedTracks = tracks.map((track) => ({
			name: track.name,
			artist: {
				url: track.artist.url,
				name: track.artist.name,
			},
			url: track.url,
			duration: convertSecondsToTime(Number.parseInt(track.duration)),
			durationSeconds: Number.parseInt(track.duration),
			totalDuration: convertSecondsToTime(
				Number.parseInt(track.duration) * Number.parseInt(track.playcount),
			),
			totalDurationSeconds:
				Number.parseInt(track.duration) * Number.parseInt(track.playcount),
			playCount: Number.parseInt(track.playcount),
		}));

		const tracksData = formattedTracks.slice(0, tracksLimit);
		const totalTracks = Number.parseInt(pageData.total);

		const totalTimeSeconds = formattedTracks
			.map((track) => track.playCount * track.durationSeconds)
			.reduce((a, b) => a + b, 0);

		const subTotalTracks = formattedTracks.slice(0, tracksLimit);

		const subTotalTimeSeconds = subTotalTracks
			.map((track) => track.playCount * track.durationSeconds)
			.reduce((a, b) => a + b, 0);

		const total = {
			amount: formattedTracks
				.map((track) => track.playCount)
				.reduce((a, b) => a + b, 0),
			duration: convertSecondsToTime(totalTimeSeconds),
			timeSeconds: totalTimeSeconds,
		};

		const subTotal = {
			amount: subTotalTracks
				.map((track) => track.playCount)
				.reduce((a, b) => a + b, 0),
			duration: convertSecondsToTime(subTotalTimeSeconds),
			timeSeconds: subTotalTimeSeconds,
		};

		const year = date.getFullYear();
		const period = inputPeriod;
		const dateGenerated = `${weekdays[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
		const orderNumber =
			Number(query.get("orderNumber")) ||
			Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

		const username = user;
		const cardHolder = query.get("cardHolder") || user;
		const authCode =
			Number(query.get("authCode")) ||
			Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
		const thanks = query.get("thanks") || "Thank you for using stef's website";

		const receiptData: ReceiptData = {
			tracksData,
			totalTracks,
			tracks: tracks.slice(0, tracksLimit).length,
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
		}

		return NextResponse.json(
			receiptData,
			{
				status: 200,
			},
		);
	} catch (err) {
        const error = err as AxiosError;

		const statusCode = error.response?.status || 500;
		let errorMessage: string;

		switch(statusCode) {
			case 404: {
				errorMessage = "User Not Found";

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

function convertSecondsToTime(seconds: number): string {
	const duration = Duration.fromObject({
		seconds,
	});

	const splitDuration = duration.toFormat("yy:MM:dd:hh:mm:ss").split(":");

	while (splitDuration[0] === "00") {
		splitDuration.shift();
	}

	return splitDuration.join(":");
}
