#!/bin/bash

cd ~/bluehat_server
git pull origin master
sudo docker-compose up --build -d