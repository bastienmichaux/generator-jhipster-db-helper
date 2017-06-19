#!/usr/bin/env bash
set -ev
# Generate several sets of entities and launch tests after each cases

gen=`pwd`/"travis/samples/generate-entities-from-travis-case.sh"

cd minimalist-app

$gen 000-only-table-name
$gen 001-table-and-fields
$gen 002-table-and-relationships
$gen 003-non-standard-relationships

# test if generated application works
mvn test
