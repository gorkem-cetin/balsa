#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if (( EUID != 0 )); then
   echo "You can't run this script without sudo." 1>&2
   exit 100
fi


if [[ $DIR == *"/root"* ]]; then
  echo "You can't' run this script in /root directory."
  exit 100
fi

. ./scripts/system_detect.sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

apt -y update
apt -y install gnupg curl ca-certificates wget gcc g++ make

# postgresql
./scripts/install_database.sh

# add repos
curl -sL https://deb.nodesource.com/setup_10.x | sudo bash
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt -y update
sudo apt -y install nodejs yarn

# build and install project
yarn && yarn build

# nginx
sudo apt -y install nginx
sudo cat nginx.conf >> /etc/nginx/sites-available/default
sudo sed -i -e "s|%DIR%|$DIR|g" /etc/nginx/sites-available/default
sudo systemctl restart nginx

# supervisor
sudo apt -y install supervisor

(cat $DIR/balsa.service ; echo "ExecStart=/usr/bin/supervisord --nodaemon --configuration $DIR/supervisord.conf") > /etc/systemd/system/balsa.service
sudo systemctl enable balsa
sudo systemctl start balsa
