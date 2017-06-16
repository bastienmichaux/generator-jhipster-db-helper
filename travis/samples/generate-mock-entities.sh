#!/usr/bin/env bash

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

# --- core ---------------------------------------------------------------
