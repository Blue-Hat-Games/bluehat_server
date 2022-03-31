#!/bin/bash
source ~/.bash_profile

cd ~/nft_game_server
git pull origin main
npm i
npm run build
pm2 stop project
pm2 start bin/www --name project --update-env
sleep 2
pm2 list
