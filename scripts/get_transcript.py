#!/usr/bin/env python3
"""
YouTube transcript fetcher for Avidato.
Called from Node.js via child_process.spawn.

Usage: python3 scripts/get_transcript.py <video_id>
Output: JSON to stdout with transcript data.
Errors: JSON to stderr, exits with code 1.
"""

import sys
import json
from youtube_transcript_api import YouTubeTranscriptApi


def get_transcript(video_id: str) -> None:
    try:
        ytt_api = YouTubeTranscriptApi()
        data = ytt_api.fetch(video_id)

        segments = []
        for snippet in data.snippets:
            segments.append({
                "text": snippet.text,
                "start": snippet.start,
                "duration": snippet.duration,
            })

        full_text = " ".join(s["text"] for s in segments)

        result = {
            "videoId": video_id,
            "language": data.language_code,
            "segments": segments,
            "text": full_text,
        }

        print(json.dumps(result))

    except Exception as e:
        error_msg = str(e)
        print(json.dumps({"error": error_msg}), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing video ID argument"}), file=sys.stderr)
        sys.exit(1)

    get_transcript(sys.argv[1])
