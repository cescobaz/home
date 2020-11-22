#!/bin/sh

HLS_CONF_FILE_NAME="nginx-hls.conf"
HLS_CONF_FILE_PATH="$(realpath $(dirname $0))/$HLS_CONF_FILE_NAME"

sudo cp "$HLS_CONF_FILE_PATH" /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/$HLS_CONF_FILE_NAME /etc/nginx/sites-enabled/$HLS_CONF_FILE_NAME

sudo nginx 
