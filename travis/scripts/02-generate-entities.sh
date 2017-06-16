#!/usr/bin/env bash
set -ev
# Generate several sets of entities and launch tests after each cases

gen=`pwd`/"travis/samples/generate-entities-from-travis-case.sh"

cd minimalist-app

$gen 000-only-table-name
$gen 001-table-and-fields

# samples to rename names from entities involved in a relationship
cp -t .jhipster "$JHIPSTER_SAMPLES/.jhipster/OTO_Slave.json" "$JHIPSTER_SAMPLES/.jhipster/OTO_Owner.json"
cp -t .jhipster "$JHIPSTER_SAMPLES/.jhipster/OTM_One.json" "$JHIPSTER_SAMPLES/.jhipster/OTM_Many.json"
cp -t .jhipster "$JHIPSTER_SAMPLES/.jhipster/MTM_Slave.json" "$JHIPSTER_SAMPLES/.jhipster/MTM_Owner.json"

# test if generated application works
mvn test
