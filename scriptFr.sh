#!/bin/bash

pid=$(lsof -t -i:3000)

if [ -z "$pid" ]; then
  echo "No process found running on port 3000."
else
  echo "Stopping process with PID $pid..."
  kill $pid
fi

# Start the npm service
echo "Starting npm service..."
cd /home/trent/Embedded-Project/
git pull

cd /home/trent/Embedded-Project/embedded/SERVER/FRONT-END/
npm start 
sleep 2
