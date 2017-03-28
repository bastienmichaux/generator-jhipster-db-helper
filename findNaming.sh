#!/bin/bash

echo "searching WRONG naming strategies"
if [ $(grep --recursive --line-number --word-regex --context=3 --group-separator=$'\n---\n' --exclude-dir='node_modules' -e 'org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy' -e 'org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy' $1 | wc -l) -eq 0 ];then
	echo "success : no wrong naming strategies found"
else
	echo "FAILED : found wrong naming strategies."

	read -p "Do you wish to display matches ? [Y/n]" -n 1 -r
	echo $REPLY
	if [[ $REPLY =~ ^[yY]$ ]]
	then
		echo "Resulting grep of WRONG strategies"
		grep --color=always --recursive --line-number --word-regex --context=3 --group-separator=$'\n---\n' --exclude-dir='node_modules' -e 'org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy' -e 'org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy' $1
	fi
fi

echo "searching CORRECT naming strategies"
if [ $(grep --recursive --line-number --word-regex --context=3 --group-separator=$'\n---\n' --exclude-dir='node_modules' -e 'org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl' -e 'org.hibernate.boot.model.naming.ImplicitNamingStrategyJpaCompliantImpl' $1 | wc -l) -gt 0 ];then
	echo "success : correct naming strategies found"

	read -p "Do you wish to display matches ? [Y/n]" -n 1 -r
	echo $REPLY
	if [[ $REPLY =~ ^[yY]$ ]]
	then
		echo "Resulting grep of correct strategies"
		grep --color=always --recursive --line-number --word-regex --context=3 --group-separator=$'\n---\n' --exclude-dir='node_modules' -e 'org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl' -e 'org.hibernate.boot.model.naming.ImplicitNamingStrategyJpaCompliantImpl' $1
	fi
else
	echo "FAILED : didn't find naming strategies."
fi

