#!/bin/sh

set -ex

DESTINATION=${1:-'/tmp/webthing-camera-media'}
mkdir -p "$DESTINATION"
shift
# keep last X hours so:
HOURS_TO_KEEP=3
SEG_DURATION=3
SECONDS_IN_HOURS=3600
WINDOW_SIZE=$(($HOURS_TO_KEEP * $SECONDS_IN_HOURS / $SEG_DURATION))
FULL_HD_WIDTH=1920
FULL_HD_HEIGHT=1080
HEIGHT=720
WIDTH=$(($HEIGHT * $FULL_HD_WIDTH / $FULL_HD_HEIGHT))
FPS=10
raspivid --nopreview \
	-t 0 \
	--profile baseline \
	--level 4 \
	-fps $FPS \
	--shutter 99900 \
	--drc high \
	--exposure night \
	--width $WIDTH \
	--height $HEIGHT \
	--mode 2 \
	-a 12 \
	$@ \
	-o - | ffmpeg \
	-framerate $FPS \
	-i - -vcodec copy -an \
	-f dash \
	-seg_duration $SEG_DURATION \
	-window_size $WINDOW_SIZE \
	-streaming 1 \
	-framerate $FPS \
	"$DESTINATION/playlist.mpd" &

echo $!
