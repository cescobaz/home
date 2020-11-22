#!/bin/sh

DESTINATION=${1:-'/tmp/webthing-camera-media'}
mkdir -p "$DESTINATION"
raspivid -n -t 0 -w 960 -h 540 -fps 25 -o - | ffmpeg -i - -vcodec copy -an -f dash "$DESTINATION/playlist.mpd"
