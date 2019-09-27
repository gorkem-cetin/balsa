#!/usr/bin/env bash

curl -s https://api.github.com/repos/balsa-team/balsa/releases/latest | grep "balsa.tar.gz" | cut -d : -f 2,3 | tr -d \" | wget -qi -
tar -xvf balsa.tar.gz
rm balsa.tar.gz
