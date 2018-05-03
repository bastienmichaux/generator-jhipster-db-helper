#!/usr/bin/env bash

# This makes this script fails the Travis build when it itself fails (otherwise it is an evergreen test)
set -ev

cd "$JHIPSTER_TRAVIS"/test-case

yarn add generator-jhipster@"$JHIPSTER_VERSION"
yarn link generator-jhipster-db-helper

yo jhipster
# yo jhipster-db-helper --force # todo adapt entities to pull-request-52

yo jhipster:entity EntityA --force
yo jhipster:entity EntityB --force
yo jhipster:entity EntityC --force
yo jhipster:entity EntityD --force
yo jhipster:entity EntityE --force
yo jhipster:entity EntityF --force
yo jhipster:entity EntityG --force
yo jhipster:entity EntityH --force
