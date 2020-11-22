#!/bin/sh

raspivid -n -t 0 -w 960 -h 540 -fps 25 -o - | ffmpeg -i - -vcodec copy -an -f hls -g 10 -sc_threshold 0 -hls_time 1 -hls_list_size 4 -hls_delete_threshold 1 -hls_flags delete_segments -hls_start_number_source datetime -hls_wrap 15 -preset superfast -start_number 1 /tmp/hls/playlist.m3u8
