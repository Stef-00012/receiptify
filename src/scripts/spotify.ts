import type { Dispatch, SetStateAction } from "react";
import axios, { type AxiosError } from "axios";

export function getHashParams() {
	const params: {
		[key: string]: string;
	} = {};

	let exec: RegExpExecArray | null;
	const regex = /([^&;=]+)=?([^&;]*)/g;
	const hash = window.location.hash.substring(1);

	while ((exec = regex.exec(hash))) {
		const hashParam = exec[1];
		const hashCode = exec[2];
		params[hashParam] = decodeURIComponent(hashCode);
	}

	return params;
}

export function generateState(length = 16) {
	let text = "";
	const possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}

export async function fetchSpotifyUserData(
	accessToken: string,
	setLoading: Dispatch<SetStateAction<boolean>>,
) {
	setLoading(true);

	const urlParams = new URLSearchParams({
		accessToken,
	});

	try {
		const response = await axios.get(`api/spotify/json?${urlParams}`);
		const data = response.data;

		setLoading(false);

		return {
			receiptData: data,
			error: null,
		};
	} catch (e) {
		const error = e as AxiosError;

		setLoading(false);

		const errorData = error.response?.data as {
			code: number;
			message: string;
		};

		return {
			receiptData: null,
			error: errorData.message || "Something went wrong...",
		};
	}
}

export async function fetchSpotifyUserAccessToken(
	code: string,
) {
	const body = {
		code,
		redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
		grant_type: "authorization_code"
	};

	try {
		const response = await axios.post(`https://accounts.spotify.com/api/token`, body, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Basic ${btoa(`${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`)}`
			}
		})

		const data = response.data as {
			access_token: string;
			token_type: string;
			scope: string;
			expires_in: number;
			refresh_token: string;
		}

		return data;
	} catch(e) {
		const error = e as AxiosError;

		const errorData = error.response?.data as {
			code: number;
			message: string;
		};

		if (errorData) console.error("Spotify Access Token Error:", errorData.message);

		return null;
	}
}