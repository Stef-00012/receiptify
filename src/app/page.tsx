"use client";

import { fetchSpotifyUserAccessToken, fetchSpotifyUserData, getHashParams } from "@/scripts/spotify";

import type { ReceiptData } from "@/types/receipt";
import { useSearchParams } from "next/navigation";
import fetchLastFmData from "@/scripts/lastFm";
import ReceiptError from "@/components/error";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import Receipt from "@/components/receipt";
import Form from "@/components/form";

export default function Home() {
	const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const searchParams = useSearchParams();

	const user = searchParams.get("user");
	const trackCount = searchParams.get("trackCount");
	const period = searchParams.get("period");
	const orderNumber = searchParams.get("orderNumber");
	const authCode = searchParams.get("authCode");
	const thanks = searchParams.get("thanks");

	const spotifyCode = searchParams.get("code");
	const spotifyState = searchParams.get("state");

	const [hashParams, setHashParams] = useState<{
		[key: string]: string;
	}>({});

	const [accessToken, setAccessToken] = useState<string>();
	const [hashState, setHashState] = useState<string>();

	const [state, setState] = useState<string | null>(null);

	useEffect(() => {
		setHashParams(getHashParams());
	}, []);

	useEffect(() => {
		console.log(hashParams)
		setAccessToken(hashParams.access_token);
		setHashState(hashParams.state);

		setState(localStorage.getItem("spotify_state"));
	}, [hashParams]);

	useEffect(() => {
		if (
			spotifyCode &&
			process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID &&
			process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI &&
			process.env.NEXT_PUBLIC_SPOTIFY_ENABLED === "true" &&
			spotifyState === state
		) {
			(async () => {
				const data = await fetchSpotifyUserAccessToken(spotifyCode);

				if (!data) return setError("Something went wrong...");

				const { receiptData, error } = await fetchSpotifyUserData(
					data.access_token,
					setLoading,
				);

				setReceiptData(receiptData);
				setError(error);
			})();
		}
	}, [spotifyCode, spotifyState, state])

	useEffect(() => {
		if (
			accessToken &&
			process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID &&
			process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI &&
			process.env.NEXT_PUBLIC_SPOTIFY_ENABLED === "true" &&
			state === spotifyCode
		) {
			(async () => {
				const { receiptData, error } = await fetchSpotifyUserData(
					accessToken,
					setLoading,
				);

				setReceiptData(receiptData);
				setError(error);
			})();
		}
	}, [accessToken, hashState, state]);

	useEffect(() => {
		if (user && process.env.NEXT_PUBLIC_LASTFM_ENABLED === "true") {
			fetchLastFmData({
				user,
				trackCount: Number.parseInt(trackCount as string) || 20,
				period: period || undefined,
				orderNumber: Number.parseInt(orderNumber as string) || undefined,
				authCode: Number.parseInt(authCode as string) || undefined,
				thanks: thanks || undefined,
				setLoading,
			})
				.then(({ receiptData, error }) => {
					setReceiptData(receiptData);
					setError(error);
				})
				.catch(() => {
					setReceiptData(null);
					setError("Something went wrong...");
				});
		}
	}, [user, trackCount, period, orderNumber, authCode, thanks]);

	return (
		<>
			{loading ? (
				<Loading />
			) : error ? (
				<ReceiptError error={error} />
			) : receiptData ? (
				<Receipt receiptData={receiptData} />
			) : (
				<Form
					onSubmit={(data, error) => {
						setReceiptData(data);
						setError(error);
					}}
					setLoading={setLoading}
				/>
			)}

			<footer className="text-center">
				<p className="mb-0 p-[15px]">
					© 2024-{new Date().getFullYear()} Stefano Del Prete. All rights
					reserved.
				</p>
			</footer>
		</>
	);
}
