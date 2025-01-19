# Receiptify

Receiptify is a website that allows you to convert your top tracks (on [last.fm](https://last.fm) or [Spotify](https://spotify.com)).
It fetches your top tracks and renders them in a way to look like a receipt.

# Installation

1. `git clone https://github.com/Stef-00012/receiptify`.
2. `cd receiptify`.
3. Setup the `.env` file (See [Config](#config)).
4. `docker compose up -d`

# Config

- `LASTFM_API_KEY`: Your last.fm API key.
- `NEXT_PUBLIC_SPOTIFY_REDIRECT_URI`: Your Spotify app redirect URI.
- `NEXT_PUBLIC_SPOTIFY_CLIENT_ID`: Your Spotify app client ID.
- `NEXT_PUBLIC_LASTFM_ENABLED`: Whether allow people to create a receipt with last.fm (requires `LASTFM_API_KEY`).
- `NEXT_PUBLIC_SPOTIFY_ENABLE`: Whether allow people to create a receipt with Spotify (requires `NEXT_PUBLIC_SPOTIFY_REDIRECT_URI` and `NEXT_PUBLIC_SPOTIFY_CLIENT_ID`)
- `NEXT_PUBLIC_UMAMI_URI`: Your [umami](https://umami.is) url (for analyrics)
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID`: Your [umami](https://umami.is) url (for analyrics)