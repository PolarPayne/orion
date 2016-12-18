#!/usr/bin/env bash
mkdir -p out
rm -f out/node.zip
apack out/node.zip package.json server.js site/
