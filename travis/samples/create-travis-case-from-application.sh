#!/usr/bin/env bash

# ----------------------------------------------------------------------
# create-travis-case-from-application
#
# This script's purpose is to help you generate mocks for a travis test case
# ----------------------------------------------------------------------

VERSION='v1.1.0'
NAME='create-travis-case-from-application'
USAGE="Usage: $NAME [-t] [-i test-case-id] [-n test-case-name] jhipster-application"
CONCRETE_USAGE="user@host$ ./$NAME.sh -t -i 27 -n  ~/MyJhipsterApplication"
HELP="
$NAME; a script to help you generate mocks for a travis test case
Version: $VERSION

$USAGE
Ex. : $CONCRETE_USAGE

# param : jhipster-application    path to a jhipster application where you generated the entities you want to add as mocks

# -h                              Print this help message
# -t                              Create mocks at supposed destination : 'generator-db-helper/travis/samples/entities'
                                  This won't work if you moved the script
# -i test-case-id                 Set the number to associate with the test case (prefix for directory, suffix for entities)
                                  If not given, counts the directories inside the directory 'entities' relative to this script and add one.
# -n test-case-description        The string that must be used for the directory name containing the mock entities.
                                  If not given, use the basename of the last parameter which is the JHipster application which contains the entities you want to add.
"

# --- local environment information variable -----------------------------
TRAVIS_SCRIPT_DIR=`cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd`
TRAVIS_ENTITIES_DIR="$TRAVIS_SCRIPT_DIR"/"entities"
CASES_NUMBER=`ls -l "$TRAVIS_SCRIPT_DIR/entities" | grep -c ^d`
ENTITIES_DIR_BASENAME=".jhipster"

# --- parameters --------------------------------------------------------
# the unique identifying number associated with the test case
paramTestCaseId=''
testCaseId=''
# the test case description used for the directory name containing the mock entities
paramTestCaseName=''
testCaseName=''
# the path to the application containing the mocks
paramJhipsterApplication=''
jhipsterApplication=''
# if we want to automatically move the created folder to ./entities, default is no (empty value)
paramCreateInTravis=''

# --- Options processing -----------------------------------------------
while getopts "ti:n:h" optname
do
	case "$optname" in
		"h")
			echo "$HELP"
			exit 0;
			;;
		"t")
			paramCreateInTravis='yes'
			;;
		"i")
			paramTestCaseId=$OPTARG
			;;
		"n")
			paramTestCaseName=$OPTARG
			;;
		":")
			echo "Missing option parameter" >&2
			echo "$USAGE"
			exit 1;
			;;
		"?")
			echo "Unknown option" >&2
			echo "$USAGE"
			exit 1;
			;;
		*)
			echo "Unknown error while processing the options" >&2
			echo "$USAGE"
			exit 1;
			;;
	esac
done

shift $(($OPTIND - 1))

# One argument, anything else is an error.
if [ "$#" -eq 1 ]; then
    # This assign the parameter at position one and removes any ending "/" character
	paramJhipsterApplication="$1"
else
	echo "You must provide one and only one parameter (not counting options) : $USAGE" >&2;
	exit 1;
fi

# --- parameter processing functions ------------------------------------
ID_SIZE=3 # Number of digits used by the id
# add leading zeros so it has a total size of $ID_SIZE
# param : $1 the number to transform into an id
idFromNumber() {
    echo `printf %0"$ID_SIZE"d ${1%.*}`
}
nameFromPath() {
    realPath=`realpath "$1"`
    noTrailingSlashName=${realPath%/}
    basename=${noTrailingSlashName##*/}
    echo "$basename"
}

# --- processing parameters ----------------------------------------------
if [ "$paramTestCaseId" ]; then
    testCaseId=`idFromNumber "$paramTestCaseId"`
else
    testCaseId=`idFromNumber "$CASES_NUMBER"`
fi

if [ "$paramTestCaseName" ]; then
    testCaseName="$paramTestCaseName"
else
    testCaseName=`nameFromPath "$paramJhipsterApplication"`
fi
testCaseNameWithId="$testCaseId-$testCaseName"

entitiesDir="$paramJhipsterApplication/$ENTITIES_DIR_BASENAME"
if [ ! -d "$entitiesDir" ]; then
    echo "$entitiesDir doesn't exist !"
    exit 1
fi

# --- script internal functions ------------------------------------------

entityNameFromPath() {
    basename=${1##*/}
    noExtensionName=${basename%.json}
    echo "$noExtensionName"
}

# --- messages -----------------------------------------------------------

EXISTING_DIR_WARNING="
# To ABORT, empty this file, save and quit.
# This configuration will overwrite the previous one
# If a matching mock entity configuration is found, it is KEPT
"

INSTRUCTIONS="
# Everything below this line is ignored, do NOT modify anything below
### INSTRUCTIONS ###
# Empty lines are ignored
# Lines beginning with # are ignored
# Don't use inline comments
# A valid line only contain an entity name (no leading or trailing space)
#
# Reorder entities according the wanted order of generation
#
# The order to obtain a valid JHipster application is such that the owner of a
# relationship is generated before the other end of the relationship
"

# --- mocking entities ---------------------------------------------------
entityListTempFile=`mktemp /tmp/"$NAME"-XXXXX`

mockEntitiesDir="$testCaseNameWithId"
if [ "$paramCreateInTravis" ]; then
    mockEntitiesDir="$TRAVIS_ENTITIES_DIR"/"$mockEntitiesDir"
fi
mocksConfigurationFile="$mockEntitiesDir"/entities.conf

if [ -d "$mockEntitiesDir" ]; then
    echo "# $mockEntitiesDir already exists. $EXISTING_DIR_WARNING" >> "$entityListTempFile"
else
    mkdir "$mockEntitiesDir"
fi

# creating starting configuration from current application
find "$entitiesDir" -maxdepth 1 -type f -regex ".*\.json" | while read file; do entityNameFromPath "$file" >> "$entityListTempFile"; done

echo "$INSTRUCTIONS" >> "$entityListTempFile"

# offering user to tweak the configuration
"${EDITOR:-nano}" "$entityListTempFile"

# creating mocks and final configuration
while read line || [[ -n "$line" ]]; do
    if [ "$line" = '### INSTRUCTIONS ###' ]; then
        break
    # skip iteration if it's an empty line or comment line
    elif [ -z "$line" ] || [[ "$line" =~ \s*#.* ]]; then
        continue
    else
        entity="$line"
    fi

    entityNameWithId="$entity"_"$testCaseId"
    entityFileNameWithId="$mockEntitiesDir"/"$entityNameWithId".json

    if [ ! -f "$entityFileNameWithId" ]; then
        cp "$entitiesDir"/"$entity".json "$entityFileNameWithId"
        # add suffix the entityTableName
        sed -i -e 's/\("entityTableName": ".*\)\(",\)/\1_'"$testCaseId"'\2/g' "$entityFileNameWithId"
    fi

    echo "$entityNameWithId" >> "$mocksConfigurationFile"
done < "$entityListTempFile"

rm "$entityListTempFile"
