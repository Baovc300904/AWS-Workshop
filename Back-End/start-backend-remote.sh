#!/bin/bash
cd /home/ec2-user/backend

# Kill old process
echo "Stopping old backend process..."
pkill -f 'java.*app.jar' || true
sleep 3

# Load environment variables (skip comments and empty lines)
echo "Loading environment variables..."
set -a
source <(grep -v '^#' .env | grep -v '^$')
set +a

# Start new process
echo "Starting backend application..."
nohup java -jar app.jar --spring.profiles.active=ec2 > app.log 2>&1 &
echo $! > app.pid

# Wait and check
sleep 8
if ps -p $(cat app.pid) > /dev/null 2>&1; then
    echo "✅ Backend started successfully!"
    echo "PID: $(cat app.pid)"
    echo ""
    echo "Recent logs:"
    tail -30 app.log
else
    echo "❌ Backend failed to start!"
    echo "Error logs:"
    cat app.log
    exit 1
fi
