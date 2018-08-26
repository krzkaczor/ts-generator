#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

echo "Create symlink for ts-generator"
rm -f ../node_modules/ts-generator
ln -s `pwd`/../.. ../node_modules/ts-generator
