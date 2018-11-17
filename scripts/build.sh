#!/bin/bash

set -ex

docker build \
	-f ./Dockerfile \
	-t ruliweb-deals \
	.
