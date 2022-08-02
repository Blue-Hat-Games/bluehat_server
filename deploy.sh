#!/bin/bash

cd ~/bluehat_server
git pull origin main
docker-compose up --build -d