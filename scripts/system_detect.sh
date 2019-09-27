#!/usr/bin/env bash

set -a;

if [ -e ".env" ]
then
    source ./.env
else
    cp sample.env .env
    source ./.env
fi


SYS_INIT="initd"

if [[ `/sbin/init --version` =~ upstart ]]; then
    SYS_INIT="upstart"
elif [[ `systemctl` =~ -\.mount ]]; then
    SYS_INIT="systemd"
fi 2> /dev/null

set +a;
