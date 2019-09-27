#!/usr/bin/env sh
DATE="$(date +%Y_%m_%d)"
FILENAME="balsa.tar.gz"
echo "Releasing ${FILENAME}"
tar -czf ${FILENAME} -X ./.tarignore .
