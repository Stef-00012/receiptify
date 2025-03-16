import type { Track as ReceiptTrack } from "@/types/receipt";
import ArtistDisplay from "./artistDisplay";
import Link from "next/link";

interface Params {
	track: ReceiptTrack;
	fontSize: number;
}

export default function Track({ track, fontSize }: Params) {
	return (
		<tr>
			<td
				style={{
					fontSize: fontSize,
				}}
			>
				{track.playCount}
			</td>
			<td
				style={{
					fontSize: fontSize,
				}}
			>
				<ArtistDisplay
					fontSize={fontSize}
					artistsData={track.artists || track.artist}
				/>
				{" - "}
				<Link
					href={track.url}
					className="text-[black] no-underline hover:underline"
				>
					{track.name}
				</Link>
			</td>
			<td
				style={{
					fontSize: fontSize,
				}}
				className="align-right"
			>
				{track.duration}
			</td>
			<td
				style={{
					fontSize: fontSize,
				}}
				className="align-right"
			>
				{track.totalDuration}
			</td>
		</tr>
	);
}
