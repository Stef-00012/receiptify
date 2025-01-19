import { generateState } from "@/scripts/spotify";
import type { TrackArtist } from "@/types/receipt";
import Link from "next/link";

interface Params {
	artistsData: Array<TrackArtist> | TrackArtist;
}

export default function ArtistDisplay({ artistsData }: Params) {
	artistsData = Array.isArray(artistsData) ? artistsData : [artistsData];

	return (
		<>
			{artistsData.map((artist, index) => {
				const key = `${artist.name}_${generateState(3)}`;

				return (
					<span key={key}>
						<Link href={artist.url} className="text-[black] no-underline hover:underline">
							{artist.name}
						</Link>
						{index < artistsData.length - 1 && " & "}
					</span>
				);
			})}
		</>
	);
}
