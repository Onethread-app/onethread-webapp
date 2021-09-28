

#give permission for everything in the onethread-app backend directory
sudo chmod -R 777 /home/ec2-user/onethread-webapp/

#navigate into our working directory where we have all our github files
cd /home/ec2-user/onethread-webapp/backend

#add npm and node to path
export NVM_DIR="$HOME/.nvm"	
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm	
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in path now)

#install node modules
npm install 
cp env.production .env

#start our node app in the background
pm2 start index.js --name "api_ot_webapp" > ot.out.log 2> ot.err.log < /dev/null & 