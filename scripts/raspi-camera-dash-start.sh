#!/bin/sh

raspivid -n -t 0 -w 960 -h 540 -fps 25 -o - | ffmpeg -i - -vcodec copy -an -f dash /tmp/hls/playlist.mpd
