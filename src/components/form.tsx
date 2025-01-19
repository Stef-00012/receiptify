import getButtonStatus from "@/scripts/buttons";
import fetchLastFmData from "@/scripts/lastFm";
import { generateState } from "@/scripts/spotify";
import validate from "@/scripts/validate";
import type { ReceiptData } from "@/types/receipt";
import { useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

interface Params {
	onSubmit: (receiptData: ReceiptData | null, error: string | null) => void;
	setLoading: Dispatch<SetStateAction<boolean>>;
}

export default function Form({ onSubmit, setLoading }: Params) {
	const [lastFmUsername, setLastFmUsername] = useState<string>("stef_do");
	const [trackCount, setTrackCount] = useState<number>(20);
	const [period, setPeriod] = useState<string>("1month");
	const [cardHolder, setCardHolder] = useState<string>();
	const [orderNumber, setOrderNumber] = useState<number>();
	const [authCode, setAuthCode] = useState<number>();
	const [bottomText, setBottomText] = useState<string>();

	const [spotifyDisabled, setSpotifyDisabled] = useState<boolean>(true);
	const [lastFmDisabled, setLastFmDisabled] = useState<boolean>(true);

	const router = useRouter();

	useEffect(() => {
		const buttonStatus = getButtonStatus();

		setSpotifyDisabled(buttonStatus.spotify);
		setLastFmDisabled(buttonStatus.lastFm);
	}, []);

	return (
		<div className="max-w-[440px] border bg-[#f9f9f9] mx-auto my-3 mb-0 p-5 rounded-[5px] border-solid border-[#ccc]">
			<form
				onSubmit={async (e) => {
					e.preventDefault();

					const { receiptData, error } = await fetchLastFmData({
						user: lastFmUsername,
						trackCount,
						period,
						cardHolder,
						orderNumber,
						authCode,
						thanks: bottomText,
						setLoading,
					});

					return onSubmit(receiptData, error);
				}}
			>
				<label
					className="block font-bold cursor-text mb-[5px]"
					htmlFor="userInput"
				>
					Last.FM Username:
				</label>
				<input
					className="bg-white font-mono font-bold w-full border text-base mb-[15px] p-2.5 rounded-[3px] border-solid border-[#ccc] invalid:bg-[#ffeeee] invalid:text-[#ff0000] invalid:border-[#ff4a4a] [&:not([required])]:bg-[#f0f0f0]"
					type="text"
					name="user"
					id="userInput"
					required
					placeholder="Your Last.FM Username"
					onInput={(e) => {
						const isValid = validate("username", e.currentTarget);

						if (isValid) setLastFmUsername(e.currentTarget.value);
					}}
				/>

				<label
					className="block font-bold cursor-text mb-[5px]"
					htmlFor="trackCountInput"
				>
					Track Count (optional):
				</label>
				<input
					className="bg-white w-full border text-base mb-[15px] p-2.5 rounded-[3px] border-solid border-[#ccc] invalid:bg-[#ffeeee] invalid:text-[#ff0000] invalid:border-[#ff4a4a] [&:not([required])]:bg-[#f0f0f0]"
					type="number"
					name="trackCount"
					id="trackCountInput"
					value={trackCount}
					onInput={(e) => setTrackCount(Number(e.currentTarget.value))}
				/>

				<label
					className="block font-bold cursor-text mb-[5px]"
					htmlFor="period"
				>
					Period (optional):
				</label>
				<select
					className="bg-[#f0f0f0] w-full border text-base mb-[15px] p-2.5 rounded-[3px] border-solid border-[#ccc]"
					name="period"
					id="period"
					defaultValue={"1month"}
					onChange={(e) => setPeriod(e.currentTarget.value)}
				>
					<option value="7day">1 Week</option>
					<option value="1month">1 Month</option>
					<option value="3month">3 Months</option>
					<option value="6month">6 Months</option>
					<option value="12month">1 Year</option>
					<option value="overall">Overall</option>
				</select>

				<label
					className="block font-bold cursor-text mb-[5px]"
					htmlFor="cardHolderInput"
				>
					Card Holder (optional):
				</label>
				<input
					className="bg-white font-mono font-bold w-full border text-base mb-[15px] p-2.5 rounded-[3px] border-solid border-[#ccc] invalid:bg-[#ffeeee] invalid:text-[#ff0000] invalid:border-[#ff4a4a] [&:not([required])]:bg-[#f0f0f0]"
					type="text"
					name="cardHolder"
					id="cardHolderInput"
					placeholder="Name shown on top, next to card holder"
					onInput={(e) => setCardHolder(e.currentTarget.value)}
				/>

				<label
					className="block font-bold cursor-text mb-[5px]"
					htmlFor="orderInput"
				>
					Order Number (optional):
				</label>
				<input
					className="bg-white w-full border text-base mb-[15px] p-2.5 rounded-[3px] border-solid border-[#ccc] invalid:bg-[#ffeeee] invalid:text-[#ff0000] invalid:border-[#ff4a4a] [&:not([required])]:bg-[#f0f0f0]"
					type="number"
					name="order"
					id="orderInput"
					placeholder="4316 (Any 4 digit number)"
					min={1000}
					max={9999}
					onInput={(e) => setOrderNumber(Number(e.currentTarget.value))}
				/>

				<label
					className="block font-bold cursor-text mb-[5px]"
					htmlFor="authCodeInput"
				>
					Auth Code (optional):
				</label>
				<input
					className="bg-white w-full border text-base mb-[15px] p-2.5 rounded-[3px] border-solid border-[#ccc] invalid:bg-[#ffeeee] invalid:text-[#ff0000] invalid:border-[#ff4a4a] [&:not([required])]:bg-[#f0f0f0]"
					type="number"
					name="authCode"
					id="authCodeInput"
					placeholder="702403 (Any 6 digit number)"
					min={100000}
					max={999999}
					onInput={(e) => setAuthCode(Number(e.currentTarget.value))}
				/>

				<label
					className="block font-bold cursor-text mb-[5px]"
					htmlFor="thanksInput"
				>
					Bottom Text (optional):
				</label>
				<input
					className="bg-white font-mono font-bold w-full border text-base mb-[15px] p-2.5 rounded-[3px] border-solid border-[#ccc] invalid:bg-[#ffeeee] invalid:text-[#ff0000] invalid:border-[#ff4a4a] [&:not([required])]:bg-[#f0f0f0]"
					type="text"
					name="thanks"
					id="thanksInput"
					placeholder="Thank you for using stef's website"
					onInput={(e) => setBottomText(e.currentTarget.value)}
				/>

				<button
					className="w-full bg-[#007bff] text-[white] text-base cursor-pointer mt-2.5 p-2.5 rounded-[3px] border-[none] hover:bg-[#0056b3] disabled:bg-[#007bffaa] disabled:cursor-not-allowed"
					type="submit"
					disabled={lastFmDisabled}
				>
					Submit
				</button>
				<button
					type="button"
					className="w-full bg-[#1cc357] text-[white] text-base cursor-pointer mt-[15px] p-2.5 rounded-[3px] border-[none] hover:bg-[#119740] disabled:bg-[#1eab4fa5] disabled:cursor-not-allowed"
					disabled={spotifyDisabled}
					onClick={(e) => {
						const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
						const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

						if (!clientId || !redirectUri) {
							e.currentTarget.disabled = true;
							return;
						}

						const state = generateState();

						localStorage.setItem("spotify_state", state)

						const urlParams = new URLSearchParams({
							response_type: "token",
							client_id: clientId,
							scope: "user-top-read user-read-private",
							redirect_uri: redirectUri,
							state: state,
						});

						const url = `https://accounts.spotify.com/authorize?${urlParams}`;

						router.push(url);
					}}
				>
					Login with spotify
				</button>

				<p className="font-bold mt-2.5 mb-0 pb-0">
					note: spotify login ignores all of the inputs above
				</p>
			</form>
		</div>
	);
}
