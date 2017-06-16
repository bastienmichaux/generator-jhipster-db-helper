#!/usr/bin/env bash
set -ev
# Generate several sets of entities and launch tests after each cases

cd minimalist-app

# samples to rename table and column names
cp -t .jhipster "$JHIPSTER_SAMPLES/.jhipster/NakedTable.json"
cp -t .jhipster "$JHIPSTER_SAMPLES/.jhipster/DressedTable.json"

# samples to rename names from entities involved in a relationship
cp -t .jhipster "$JHIPSTER_SAMPLES/.jhipster/OTO_Slave.json" "$JHIPSTER_SAMPLES/.jhipster/OTO_Owner.json"
cp -t .jhipster "$JHIPSTER_SAMPLES/.jhipster/OTM_One.json" "$JHIPSTER_SAMPLES/.jhipster/OTM_Many.json"
cp -t .jhipster "$JHIPSTER_SAMPLES/.jhipster/MTM_Slave.json" "$JHIPSTER_SAMPLES/.jhipster/MTM_Owner.json"

# test if generated application works
mvn test
