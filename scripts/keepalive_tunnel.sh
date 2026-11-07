#!/usr/bin/env bash

# RoadSense AI Auto-Reconnecting Public Tunnel Daemon
URL_FILE="/Users/devanboinatharun/Desktop/AI TRAFFIC SIGN/tunnel_url.txt"
LOG_FILE="/Users/devanboinatharun/Desktop/AI TRAFFIC SIGN/tunnel.log"

echo "Starting RoadSense Tunnel Daemon..." > "$LOG_FILE"

while true; do
  ssh -o StrictHostKeyChecking=no \
      -o ServerAliveInterval=10 \
      -o ServerAliveCountMax=3 \
      -R 80:localhost:5173 nokey@localhost.run 2>&1 | while read -r line; do
        echo "$line" >> "$LOG_FILE"
        if echo "$line" | grep -q "\.lhr\.life"; then
          url=$(echo "$line" | grep -o 'https://[^ ]*\.lhr\.life' | head -n 1)
          if [ -n "$url" ]; then
            echo "$url" > "$URL_FILE"
            echo "[TUNNEL ACTIVE]: $url" >> "$LOG_FILE"
          fi
        fi
      done
  sleep 2
done
