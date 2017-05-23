#!/usr/bin/env bash
set -ev
# Generate several sets of entities and launch tests after each cases

cd minimalist-app
cp -t .jhipster "$JHIPSTER_SAMPLES/.jhipster/NakedTable.json" "$JHIPSTER_SAMPLES/.jhipster/DressedTable.json" "$JHIPSTER_SAMPLES/.jhipster/OTO_Slave.json" "$JHIPSTER_SAMPLES/.jhipster/OTO_Owner.json"

# 2 entities without fields, OTO, jhipster values
# 2 entities without fields, OTO, stress values

# 2 entities without fields, OTM, jhipster values
# 2 entities without fields, OTM, stress values

# 2 entities without fields, MTM, jhipster values
# 2 entities without fields, MTM, stress values

# 2 entities with fields, OTO, jhipster values
# 2 entities with fields, OTO, stress values

# 2 entities with fields, OTM, jhipster values
# 2 entities with fields, OTM, stress values

# 2 entities with fields, MTM, jhipster values
# 2 entities with fields, MTM, stress values

# 1 set with real cases
