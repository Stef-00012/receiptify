import useWindowDimensions from "@/hooks/useWindowSize";
// @ts-expect-error The package has no typings
import { useScreenshot } from 'use-react-screenshot';
import type { ReceiptData } from "@/types/receipt";
import Track from "@/components/receipt/track";
import { useEffect, useRef, useState } from "react";

interface Params {
	receiptData: ReceiptData;
}

export default function Receipt({ receiptData }: Params) {
	const windowSize = useWindowDimensions()
	const [fontSize, setFontSize] = useState<number>(16)
	const [headerFontSize, setHeaderFontSize] = useState<number>(32)

	useEffect(() => {
		if (windowSize.width >= 618) {
			setFontSize(16)
			setHeaderFontSize(32)

			return;
		}
		
		setFontSize(16 * (windowSize.width / 618))
		setHeaderFontSize(32 * (windowSize.width / 618))
	}, [windowSize.width])

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
		<div className={`${windowSize.width >= 618 ? "max-w-[618px]" : ""} mx-auto my-0 py-[25px]`}>
			<div ref={receiptElement} className="px-5 bg-[url('/images/receiptBackground.webp')] bg-repeat">
				<h1 style={{
					fontSize: headerFontSize
				}} className="align-center font-bold mb-5">{receiptData.cardHolder}&apos;S RECEIPT</h1>
				<h2 style={{
					fontSize: fontSize
				}} className="align-center font-bold">
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

				<p style={{
					fontSize: fontSize
				}} className="align-center my-0">
					ORDER #{receiptData.orderNumber} FOR {receiptData.username}
				</p>
				<p style={{
					fontSize: fontSize
				}} className="align-center my-0">{receiptData.dateGenerated}</p>
				<br />

				<p style={{
					fontSize: fontSize
				}} className="mt-0 my-0">TOTAL TRACKS: {receiptData.totalTracks}</p>

				<table>
					<thead>
						<tr className="divider">
							<td style={{
								fontSize: fontSize
							}} className="divider align-right text-nowrap" colSpan={4}>
								{createAdaptiveDashes(fontSize, windowSize.width)}
							</td>
						</tr>
						<tr>
							<td style={{
								fontSize: fontSize
							}}>AMT</td>
							<td style={{
								fontSize: fontSize
							}}>TRACK</td>
							<td style={{
								fontSize: fontSize
							}} className="align-right">TIME</td>
							<td style={{
								fontSize: fontSize
							}} className="align-right pl-2.5">TOT TIME</td>
						</tr>
						<tr className="divider">
							<td style={{
								fontSize: fontSize
							}} className="divider align-right text-nowrap" colSpan={4}>
								{createAdaptiveDashes(fontSize, windowSize.width)}
							</td>
						</tr>
					</thead>
					<tbody>
						{receiptData.tracksData.map((track) => (
							<Track key={track.name} fontSize={fontSize} track={track} />
						))}
					</tbody>
				</table>

				<table>
					<tbody>
						<tr className="divider">
							<td style={{
								fontSize: fontSize
							}} />
							<td style={{
								fontSize: fontSize
							}} />
							<td style={{
								fontSize: fontSize
							}}>
								<br />
							</td>
						</tr>
						<tr className="divider">
							<td style={{
								fontSize: fontSize
							}} />
							<td style={{
								fontSize: fontSize
							}} />
							<td style={{
								fontSize: fontSize
							}} className="align-right" colSpan={4}>
								SUBTOTAL:
							</td>
						</tr>
						<tr className="divider">
							<td style={{
								fontSize: fontSize
							}} className="divider align-right text-nowrap" colSpan={4}>
								{createAdaptiveDashes(fontSize, windowSize.width)}
							</td>
						</tr>
						<tr>
							<td style={{
								fontSize: fontSize
							}}>{receiptData.subTotal.amount}</td>
							<td style={{
								fontSize: fontSize
							}} className="align-right" colSpan={3}>
								{receiptData.subTotal.duration}
							</td>
						</tr>
						<tr className="divider">
							<td style={{
								fontSize: fontSize
							}} />
							<td style={{
								fontSize: fontSize
							}} />
							<td style={{
								fontSize: fontSize
							}}>
								<br />
							</td>
						</tr>
						<tr className="divider">
							<td style={{
								fontSize: fontSize
							}} />
							<td style={{
								fontSize: fontSize
							}} />
							<td style={{
								fontSize: fontSize
							}} className="align-right" colSpan={4}>
								TOTAL:
							</td>
						</tr>
						<tr className="divider">
							<td style={{
								fontSize: fontSize
							}} className="divider align-right text-nowrap" colSpan={4}>
								{createAdaptiveDashes(fontSize, windowSize.width)}
							</td>
						</tr>
						<tr>
							<td style={{
								fontSize: fontSize
							}}>{receiptData.total.amount}</td>
							<td style={{
								fontSize: fontSize
							}} />
							<td style={{
								fontSize: fontSize
							}} />
							<td style={{
								fontSize: fontSize
							}} className="align-right">
								{receiptData.total.duration}
							</td>
						</tr>
					</tbody>
				</table>

				<br />
				<br />
				<p style={{
					fontSize: fontSize
				}} className="date my-0">
					CARD #: **** **** **** {receiptData.year}
				</p>
				<p style={{
					fontSize: fontSize
				}} className="date my-0">
					AUTH CODE: {receiptData.authCode}
				</p>
				<p style={{
					fontSize: fontSize
				}} className="date my-0">
					CARDHOLDER: {receiptData.cardHolder}
				</p>
				<br />
				<p style={{
					fontSize: fontSize
				}} className="align-center pb-[30px]">
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



function createAdaptiveDashes(fontSize: number, windowWidth: number) {
    // Base case: 53 dashes when both conditions are met
    if (fontSize >= 16 && windowWidth >= 618) {
        return '-'.repeat(53);
    }
    
    // Calculate adjustment factor based on reduced parameters
    const fontSizeFactor = fontSize >= 16 ? 1 : (16 / fontSize);
    const widthFactor = windowWidth >= 618 ? 1 : (618 / windowWidth);
    
    // Calculate adjusted dash count
    const baseDashes = 53;
    const adjustment = Math.round(baseDashes * (fontSizeFactor + widthFactor) / 2);
    
    // Ensure adjustment doesn't exceed original count
    return '-'.repeat(Math.min(adjustment, baseDashes));
}