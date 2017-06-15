#!/usr/bin/env bash

# ----------------------------------------------------------------------
# import-mock-entities
#
# This script's purpose is to help you generate mocks for a travis test case
# ----------------------------------------------------------------------

VERSION=0.0.0
NAME='import-mock-entities'
USAGE='Usage: import-mock-entities [-i test-case-id] [-d test-case-name] jhipster-application'

# --- local environment variable
SCRIPT_DIR=`cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd`
CASES_NUMBER=`ls -l "$SCRIPT_DIR/entities" | grep -c ^d`
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

# --- Options processing -----------------------------------------------
while getopts "i:n:h" optname
do
	case "$optname" in
		"h")
			echo "import-mock-entities; a script to help you generate mocks for a travis test case
Version: $VERSION

$USAGE

# param : jhipster-application    path to a jhipster application where you generated the entities you want to add as mocks

# -h                              Print this help message
# -n test-case-number             Set the number to associate with the test case (prefix for directory, suffix for entities)
                                  If not given, counts the directories inside the directory 'entities' relative to this script and add one.
# -d test-case-description        The string that must be used for the directory name containing the mock entities.
                                  If not given, use the basename of the last parameter which is the JHipster application which contains the entities you want to add.
"
			exit 0;
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
    noSlashName=${1%/}
    basename=${noSlashName##*/}
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

# --- finding entities ---------------------------------------------------
entityListTempFile=`mktemp /tmp/"$NAME"-XXXXX`

find "$entitiesDir" -type f -regex ".*\.json" | while read file; do entityNameFromPath "$file" >> "$entityListTempFile"; done

# todo add explanation within comments into the file

"${EDITOR:-nano}" "$entityListTempFile"

# todo offer option to automatically move the directory
mockEntitiesDir="$testCaseNameWithId"
mocksConfigurationFile="$mockEntitiesDir"/mocks.conf

# todo warn user if directory already exists (and tell him what is in it)
mkdir "$mockEntitiesDir"

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
    entityFileNameWithId="$entityNameWithId".json

    cp "$entitiesDir"/"$entity".json "$mockEntitiesDir"/"$entityFileNameWithId"
    # todo add prefix to table name

    echo "$entityNameWithId" >> "$mocksConfigurationFile"
done < "$entityListTempFile"

rm "$entityListTempFile"
