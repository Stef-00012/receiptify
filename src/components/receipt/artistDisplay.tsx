import type { TrackArtist } from "@/types/receipt";
import { generateState } from "@/scripts/spotify";
import Link from "next/link";

interface Params {
	artistsData: Array<TrackArtist> | TrackArtist;
	fontSize: number;
}

export default function ArtistDisplay({ artistsData, fontSize }: Params) {
	artistsData = Array.isArray(artistsData) ? artistsData : [artistsData];

	return (
		<>
			{artistsData.map((artist, index) => {
				const key = `${artist.name}_${generateState(3)}`;

				return (
					<span key={key}>
						<Link
							href={artist.url}
							style={{
								fontSize: fontSize,
							}}
							className="text-[black] no-underline hover:underline"
						>
							{artist.name}
						</Link>
						{index < artistsData.length - 1 && " & "}
					</span>
				);
			})}
		</>
	);
}
