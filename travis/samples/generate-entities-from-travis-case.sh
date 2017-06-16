#!/usr/bin/env bash

# ----------------------------------------------------------------------
# generate-entities-from-travis-case
#
# This script's purpose is to generate all entities in the correct order.
# This supposes said entities respect our conventions
# ----------------------------------------------------------------------

VERSION='v1.0.0'
USAGE='generate-mock-entities entities-directory'


# --- constance ----------------------------------------------------------
TRAVIS_SCRIPT_DIR=`cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd`
TRAVIS_ENTITIES_DIR="$TRAVIS_SCRIPT_DIR"/"entities"

# One argument, anything else is an error.
if [ "$#" -eq 1 ]; then
	paramCaseName="$1"
else
	echo "You must provide one and only one parameter : $USAGE" >&2
	exit 1
fi

CASE_DIR="$TRAVIS_ENTITIES_DIR"/"$paramCaseName"
if [ ! -d "$CASE_DIR" ]; then
    echo "$CASE_DIR doesn't exist" >&2
    exit 1
fi

CASE_CONF_FILE="$CASE_DIR"/"entities.conf"
if [ ! -f "$CASE_CONF_FILE" ]; then
    echo "$CASE_CONF_FILE doesn't exist" >&2
    exit 1
fi

# --- core process -------------------------------------------------------

while read line || [[ -n "$line" ]]; do
    # skip iteration if it's an empty line or comment line
    if [ -z "$line" ] || [[ "$line" =~ \s*#.* ]]; then
        continue
    else
        entity="$line"
    fi

    entityFile="$CASE_DIR"/"$entity".json
    if [ ! -f "$entityFile" ]; then
        echo "$entityFile missing" >&2
        exit 1
    fi

    ### Step 1, copy entity configuration file, if not already done by a previous iteration
    echo "$entityFile --> ""$PWD"/.jhipster
    cp -n "$entityFile" "$PWD"/.jhipster

    ### Step 2, generate the entity
    yo jhipster:entity "$entity" --force

done < "$CASE_CONF_FILE"
