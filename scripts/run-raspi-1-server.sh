#!/bin/sh

DIR=$(realpath $(dirname $0))

echo 'starting webthings server'
nohup node $DIR/../index.js raspi-1-server &
echo 'done'
