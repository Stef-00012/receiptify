import axios, { type AxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";

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
