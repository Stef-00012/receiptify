import type { ReceiptData } from "@/types/receipt";
import Track from "./receipt/track";
import { useRef } from "react";
// @ts-expect-error The package has no typings
import { useScreenshot } from 'use-react-screenshot'

interface Params {
	receiptData: ReceiptData;
}

export default function Receipt({ receiptData }: Params) {
	const receiptElement = useRef<HTMLDivElement>(null);
	const downloadRef = useRef<HTMLAnchorElement>(null);

	const [image, takeScreenshot] = useScreenshot();

	const periods = {
		"7day": "In the last 7 Days",
		"1month": "In the last month",
		"3month": "In the last 3 months",
		"6month": "In the last 6 months",
		"12month": "In the last year",
		"overall": "Overall",
	}

	return (
		<div className="max-w-[618px] mx-auto my-0 py-[25px]">
			<div ref={receiptElement} className="px-5 bg-[url('/images/receiptBackground.webp')] bg-repeat">
				<h1 className="align-center text-4xl font-bold mb-5">{receiptData.cardHolder}&apos;S RECEIPT</h1>
				<h2 className="align-center font-bold">
					{receiptData.period === "spotify" ? (
						<img
							src={"/images/spotifyLogo.webp"}
							alt="Spotify Logo"
							className="max-h-[50px] mx-auto"
						/>
					) : (
						<>
							{periods[receiptData.period]}
						</>
					)}
				</h2>
				<br />

				<p className="align-center my-0">
					ORDER #{receiptData.orderNumber} FOR {receiptData.username}
				</p>
				<p className="align-center my-0">{receiptData.dateGenerated}</p>
				<br />

				<p className="mt-0 my-0">TOTAL TRACKS: {receiptData.totalTracks}</p>

				<table>
					<thead>
						<tr className="divider">
							<td className="divider align-right" colSpan={4}>
								-----------------------------------------------------
							</td>
						</tr>
						<tr>
							<td>AMT</td>
							<td>TRACK</td>
							<td className="align-right">TIME</td>
							<td className="align-right pl-2.5">TOT TIME</td>
						</tr>
						<tr className="divider">
							<td className="divider align-right" colSpan={4}>
								-----------------------------------------------------
							</td>
						</tr>
					</thead>
					<tbody>
						{receiptData.tracksData.map((track) => (
							<Track key={track.name} track={track} />
						))}
					</tbody>
				</table>

				<table>
					<tbody>
						<tr className="divider">
							<td />
							<td />
							<td>
								<br />
							</td>
						</tr>
						<tr className="divider">
							<td />
							<td />
							<td className="align-right" colSpan={4}>
								SUBTOTAL:
							</td>
						</tr>
						<tr className="divider">
							<td className="divider align-right" colSpan={4}>
								-----------------------------------------------------
							</td>
						</tr>
						<tr>
							<td>{receiptData.subTotal.amount}</td>
							<td className="align-right" colSpan={3}>
								{receiptData.subTotal.duration}
							</td>
						</tr>
						<tr className="divider">
							<td />
							<td />
							<td>
								<br />
							</td>
						</tr>
						<tr className="divider">
							<td />
							<td />
							<td className="align-right" colSpan={4}>
								TOTAL:
							</td>
						</tr>
						<tr className="divider">
							<td className="divider align-right" colSpan={4}>
								-----------------------------------------------------
							</td>
						</tr>
						<tr>
							<td>{receiptData.total.amount}</td>
							<td />
							<td />
							<td className="align-right">
								{receiptData.total.duration}
							</td>
						</tr>
					</tbody>
				</table>

				<br />
				<br />
				<p className="date my-0">
					CARD #: **** **** **** {receiptData.year}
				</p>
				<p className="date my-0">
					AUTH CODE: {receiptData.authCode}
				</p>
				<p className="date my-0">
					CARDHOLDER: {receiptData.cardHolder}
				</p>
				<br />
				<p className="align-center pb-[30px]">
					{receiptData.thanks}
				</p>
			</div>

			<button
				type="button"
				className="w-full bg-[#1cc357] text-[white] text-base cursor-pointer mt-[15px] p-2.5 rounded-[3px] border-[none] hover:bg-[#119740] max-w-[618px] mx-auto my-0"
				onClick={() => {
					if (receiptElement.current) {
						takeScreenshot(receiptElement.current)
						
						if (image && downloadRef.current) {
							downloadRef.current.href = image
							downloadRef.current.download = 'receipt.png'
							downloadRef.current.click()
						}
					}
				}}
			>
				Download
			</button>
			{/* biome-ignore lint/a11y/useAnchorContent: This <a> is only used for the download, no need for the content
				biome-ignore lint/a11y/useValidAnchor: This <a> is only used for the download, no need for the aria stuff */}
			<a ref={downloadRef} className="hidden" />
		</div>
	);
}
