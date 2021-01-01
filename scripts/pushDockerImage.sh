#!/usr/bin/env sh

set -e

docker login --username="$DOCKERHUB_USER" --password="$DOCKERHUB_PASSWORD"
docker run --rm --privileged multiarch/qemu-user-static --reset -p yes
buildContainer=$(docker buildx create --use)
docker buildx build --push --platform linux/arm,linux/arm64,linux/amd64 --tag "$DOCKERHUB_USER/dstatsd" .
docker buildx rm $buildContainer

set +e
