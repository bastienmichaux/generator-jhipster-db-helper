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

# samples to rename relationships names
cp -t .jhipster "$JHIPSTER_SAMPLES/.jhipster/MTM_Relation_Slave.json" "$JHIPSTER_SAMPLES/.jhipster/MTM_Relation_Owner.json"
cp -t .jhipster "$JHIPSTER_SAMPLES/.jhipster/OTM_Relation_One.json" "$JHIPSTER_SAMPLES/.jhipster/OTM_Relation_Many.json"

# sample to generate entities with configuration files lacking "dbhRelationship" field.
cp -t .jhipster "$JHIPSTER_SAMPLES/.jhipster/NoDBHRelationSlave.json" "$JHIPSTER_SAMPLES/.jhipster/NoDBHRelationOwner.json"

# sample to rename id column name from entities involved in all possible cases
cp -t .jhipster "$JHIPSTER_SAMPLES/.jhipster/ID_Single.json"
cp -t .jhipster "$JHIPSTER_SAMPLES/.jhipster/ID_OTO_Slave.json" "$JHIPSTER_SAMPLES/.jhipster/ID_OTO_Owner.json"
cp -t .jhipster "$JHIPSTER_SAMPLES/.jhipster/ID_OTM_One.json" "$JHIPSTER_SAMPLES/.jhipster/ID_OTM_Many.json"
cp -t .jhipster "$JHIPSTER_SAMPLES/.jhipster/ID_MTM_Slave.json" "$JHIPSTER_SAMPLES/.jhipster/ID_MTM_Owner.json"

yo jhipster:entity NakedTable --force
yo jhipster:entity DressedTable --force

yo jhipster:entity OTO_Slave --force
yo jhipster:entity OTO_Owner --force
yo jhipster:entity MTM_Slave --force
yo jhipster:entity MTM_Owner --force
yo jhipster:entity OTM_One --force
yo jhipster:entity OTM_Many --force

yo jhipster:entity MTM_Relation_Slave --force
yo jhipster:entity MTM_Relation_Owner --force
yo jhipster:entity OTM_Relation_One --force
yo jhipster:entity OTM_Relation_Many --force

yo jhipster:entity NoDBHRelationSlave --force
yo jhipster:entity NoDBHRelationOwner --force

yo jhipster:entity ID_Single --force
yo jhipster:entity ID_OTO_Slave --force
yo jhipster:entity ID_OTO_Owner --force
yo jhipster:entity ID_OTM_One --force
yo jhipster:entity ID_OTM_Many --force
yo jhipster:entity ID_MTM_Slave --force
yo jhipster:entity ID_MTM_Owner --force

# test if generated application works
mvn test
