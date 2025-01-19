import type { Metadata, Viewport } from "next";

import { baseUrl } from "@/data/constants";

import "./globals.css";
import { Suspense } from "react";

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),
	authors: [
		{
			name: "Stefano Del Prete",
		},
	],
	title: "Receiptify",
	description:
		"Converts your top tracks to a receipt. Currently supports Spotify with a limit of 50 tracks and Last.FM with no limit",
	openGraph: {
		title: "Receiptify",
		type: "website",
		url: "https://receiptify.stefdp.com",
		description:
			"Converts your top tracks to a receipt. Currently supports Spotify with a limit of 50 tracks and Last.FM with no limit",
		images: "/images/exampleReceipt.webp",
	},
	keywords: [
		"Stef",
		"Stef_DP",
		"Stefano Del Prete",
		"Del Prete",
		"Receipt",
		"Receiptify",
		"Last.fm",
		"Spotify",
	],
	twitter: {
		title: "Receiptify",
		description:
			"Converts your top tracks to a receipt. Currently supports Spotify with a limit of 50 tracks and Last.FM with no limit",
	},
	icons: null,
};

export const viewport: Viewport = {
	colorScheme: "dark",
	themeColor: "#629D6D",
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const umamiUri = process.env.NEXT_PUBLIC_UMAMI_URI;
	const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

	return (
		<html lang="en">
			<head>
				{
					umamiUri && umamiWebsiteId && (
						<script
					defer
					src={umamiUri}
					data-website-id={umamiWebsiteId}
				/>
					)
				}
			</head>
			<body className="antialiased">
				<Suspense>
					{children}
				</Suspense>
			</body>
		</html>
	);
}
