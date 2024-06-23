# LocalLinkk Backend

## Deployment

### First Time Deployment

The following steps describe how to deploy the application to a new server for the first time.

- SSH to server `ssh <ip address>`
- Change directory to `cd /var/www/fask`
- Clone HTTP repos `sudo git clone https://github.com/KyleSeaford/LocalLinkk.git`
- The backend app will be in folder `/var/www/fask/LocalLinkk/Backend`
- Install requirements `sudo pip install -r requirements.txt`
- Copy the example settings file `cp .env.example .env`
- Edit hardcoded addresses in the WSGI configuration `sudo nano /var/www/fask/app.wsgi`
- Restart the server `sudo service apache2 restart`

### Update Deployment

The following steps describe how to update the code on an existing deployment

- SSH to server `ssh <ip address>`
- Change directory to `cd /var/www/fask`
- Get rid of any local edits `git stash`
- Get the latest code from the git hub repository `git pull`
- Updated the requirements `sudo pip install -r requirements.txt`
- Restart the server `sudo service apache2 restart`
