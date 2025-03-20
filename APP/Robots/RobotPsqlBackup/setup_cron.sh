#!/bin/bash

# Define the cron job command
CRON_JOB="1 0 * * * /usr/bin/python3 /var/www/fask/LocalLinkk/Robots/RobotPsqlBackup/robot_psql_backup.py >> /var/www/fask/LocalLinkk/Robots/RobotPsqlBackup/robot_psql_backup_cron.log 2>&1"

# Remove existing cron job if it exists
(sudo crontab -l 2>/dev/null | grep -v -F "/usr/bin/python3 /var/www/fask/LocalLinkk/Robots/RobotPsqlBackup/robot_psql_backup.py") | sudo crontab -

# Add the new cron job
(sudo crontab -l 2>/dev/null; echo "$CRON_JOB") | sudo crontab -
echo "Cron job added/replaced in root's crontab: $CRON_JOB"
