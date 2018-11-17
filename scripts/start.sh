#!/bin/bash

set -ex

docker run \
	--rm \
	-it \
	-d \
	-v $PWD/data:/opt/src/data \
	--restart=on-failure \
	--name ruliweb-deals \
	ruliweb-deals
