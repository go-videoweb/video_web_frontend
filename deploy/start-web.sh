#!/bin/sh
set -eu
: "${API_UPSTREAM:?API_UPSTREAM must name the reachable Go gateway}"
envsubst '$API_UPSTREAM' < /opt/videoweb/nginx.conf.template > /tmp/videoweb-nginx.conf
exec nginx -c /tmp/videoweb-nginx.conf -g 'daemon off;'
