#!/bin/bash
set -ev

#-------------------------------------------------------------------------------
# Generate the project with yo jhipster
#-------------------------------------------------------------------------------
# TODO all arbitrary values should come from build env

mkdir minimalist-app
cd minimalist-app
cp "$JHIPSTER_SAMPLES/minimalist-app/.yo-rc.json" .

yarn link generator-jhipster-db-helper
yo jhipster
yo jhipster-db-helper --force


