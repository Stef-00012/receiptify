import type { Track as ReceiptTrack } from "@/types/receipt";
import ArtistDisplay from "./artistDisplay";
import Link from "next/link";

interface Params {
    track: ReceiptTrack
}

export default function Track({
    track
}: Params) {
    return (
        <tr>
            <td>{track.playCount}</td>
            <td>
                <ArtistDisplay artistsData={track.artists || track.artist} />
                {" - "}
                <Link href={track.url} className="text-[black] no-underline hover:underline">{track.name}</Link>
            </td>
            <td className="align-right">{track.duration}</td>
            <td className="align-right">{track.totalDuration}</td>
        </tr>
    );
}