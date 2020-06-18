#!/usr/bin/env bash

# This makes this script fails the Travis build when it itself fails (otherwise it is an evergreen test)
set -ev

cd "$JHIPSTER_TRAVIS"/test-case

yarn global add generator-jhipster@"$JHIPSTER_VERSION"
yarn link generator-jhipster-db-helper

jhipster --force --no-insight
jhipster-db-helper --force

jhipster:entity EntityA --force
jhipster:entity EntityB --force
jhipster:entity EntityC --force
jhipster:entity EntityD --force
jhipster:entity EntityE --force
jhipster:entity EntityF --force
jhipster:entity EntityG --force
jhipster:entity EntityH --force

mvn test
