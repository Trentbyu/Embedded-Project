#!/bin/bash

pid=$(lsof -t -i:3000)

if [ -z "$pid" ]; then
  echo "No process found running on port 3000."
else
  echo "Stopping process with PID $pid..."
  kill $pid
fi


cd /home/trent/Embedded-Project/
git pull
npm install 
cd /home/trent/Embedded-Project/embedded/FRONT-END/
npm start 
