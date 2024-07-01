#!/bin/bash

# Define the cron job command
CRON_JOB="1 0 * * * /usr/bin/python3 /var/www/robot_psql_backup.py"

# Check if the cron job already exists in the root's crontab
(sudo crontab -l 2>/dev/null | grep -F "$CRON_JOB") || {
    # Add the cron job to the root's crontab
    (sudo crontab -l 2>/dev/null; echo "$CRON_JOB") | sudo crontab -
    echo "Cron job added to root's crontab: $CRON_JOB"
}
