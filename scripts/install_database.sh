#!/usr/bin/env bash

sudo apt -y install postgresql postgresql-contrib

#!/bin/sh
if [[ $SYS_INIT == "systemd" ]]
then
    sudo systemctl postgresql start
else
    sudo /etc/init.d/postgresql start
fi

su -c "psql -c \"CREATE USER balsa WITH LOGIN PASSWORD 'balsa' \"" postgres
su -c "createdb balsa" postgres
