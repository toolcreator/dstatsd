#!/usr/bin/env sh

set -e

version=$(git describe --abbrev=0)
imageName="$DOCKERHUB_USER/dstatsd"
platforms="linux/arm,linux/arm64,linux/amd64"

docker run --rm --privileged multiarch/qemu-user-static --reset -p yes
buildContainer=$(docker buildx create --use)
docker login --username="$DOCKERHUB_USER" --password="$DOCKERHUB_PASSWORD"
docker buildx build --push --platform "$platforms" --tag "$imageName:latest" --tag "$imageName:$version" .
docker logout
docker buildx rm $buildContainer

set +e
