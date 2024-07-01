# Robot Psql Backup

## Introduction

The robot will back up the Postgres database every day.

- The Robot run in the VM 192.168.127.223 on Don
- The database is backed up to Garry
- The settings are in the .env

## Development Notes

Development notes for the robot are in:

- [DevelopmentNotes\20240701.md](DevelopmentNotes\20240701.md)

## Deployment

### First Time Deployment

- ssh to the server
- Change directory `cd /var/www/fask/Locallinkk'
- git checkout if not already checked out
- Change directory `cd Robots\RobotPsqlBackup`
- Copy the example config file `cp .env.example .env`
- Edit the settings in the config file `nano .env`
- Make the Script Executable: Make the script executable by running `chmod +x setup_cron.sh`
- Run the Script: Execute the script to set up the cron job `./setup_cron.sh`
- TODO mount garry and change setting backupOutputPath in .env