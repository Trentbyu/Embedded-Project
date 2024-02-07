#!/bin/bash
cd /home/trent/Embedded-Project/
git pull
pid=$(lsof -t -i:5000)

if [ -z "$pid" ]; then
  echo "No process found running on port 5000."
else
  echo "Stopping process with PID $pid..."
  kill $pid
fi

cd /home/trent/Embedded-Project/embedded/SERVER/BACK-END/
sudo python3 config.py
