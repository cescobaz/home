#!/bin/sh

DIR=$(realpath $(dirname $0))

echo 'starting webthings server'
node $DIR/../index.js raspi-1-server
