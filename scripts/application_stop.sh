#Stopping existing node servers
echo "Stopping any existing node servers"
pm2 stop 0
pkill node