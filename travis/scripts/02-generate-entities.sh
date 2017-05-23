#!/usr/bin/env bash
set -ev
# Generate several sets of entities and launch tests after each cases

cd minimalist-app
cp -t .jhipster "$JHIPSTER_SAMPLES/.jhipster/NakedTable.json" "$JHIPSTER_SAMPLES/.jhipster/DressedTable.json" "$JHIPSTER_SAMPLES/.jhipster/OTO_Slave.json" "$JHIPSTER_SAMPLES/.jhipster/OTO_Owner.json"

yo jhipster:entity NakedTable --force
yo jhipster:entity DressedTable --force
yo jhipster:entity OTO_Slave --force
yo jhipster:entity OTO_Owner --force

mvn test

# 2 entities without fields, OTM, jhipster values
# 2 entities without fields, OTM, stress values

# 2 entities without fields, MTM, jhipster values
# 2 entities without fields, MTM, stress values

# 2 entities with fields, OTM, jhipster values
# 2 entities with fields, OTM, stress values

# 2 entities with fields, MTM, jhipster values
# 2 entities with fields, MTM, stress values

# 1 set with real cases
