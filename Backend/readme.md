# LocalLinkk Backend

## Deployment

### First Time Deployment

The following steps describe how to deploy the application to a new server for the first time.

- SSH to server `ssh <ip address>`
- Change directory to `cd /var/www/fask`
- Clone HTTP repos `sudo git clone https://github.com/KyleSeaford/LocalLinkk.git`
- The backend app will be in folder `/var/www/fask/LocalLinkk/Backend`
- Install requirements `sudo pip install -r requirements.txt`
- Copy the example settings file `cp .env.example /var/www/fask/.env`
- Restart the server `sudo systemctl reload apache2`
`

### Update Deployment

The following steps describe how to update the code on an existing deployment

- SSH to server `ssh <ip address>`
- Change directory to `cd /var/www/fask`
- Backup the current local copy of the project to a zip file. File format yyyymmddhhmm `zip -r Backup\202406231319.zip LocalLinkk`
- Change the directory to the Locallinkk `cd LocalLinkk`
- Get rid of any local edits `sudo git stash`
- Get the latest code from the git hub repository `sudo git pull`
- Change the directory to the Backend `cd Backend`
- Updated the requirements `sudo pip install -r requirements.txt`
- Edit the `.env` to Add any new setting from `.env.example`
- Restart the server `sudo systemctl reload apache2`
`
