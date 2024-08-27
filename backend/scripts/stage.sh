#!/usr/bin/env bash

# This script is used to create a docker container on gcr then deploy it to cloud run

set -e # exit on error

echo "Building container image"
docker build --platform linux/amd64 -t registry.digitalocean.com/ohmt/python:latest .
echo "Pushing container image"
docker push registry.digitalocean.com/ohmt/python:latest
