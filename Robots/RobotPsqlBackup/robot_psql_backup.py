import os
from dotenv import load_dotenv
import subprocess
from datetime import datetime
import smtplib
from email.mime.text import MIMEText

# Load environment variables from .env file
load_dotenv()

DB_HOST = str(os.getenv('dbHost'))
DB_DATABASE = str(os.getenv('dbDatabase'))
DB_USER = str(os.getenv('dbUser'))
DB_PASSWORD = str(str(os.getenv('dbPassword')))
EMAIL_SENDER = str(os.getenv('emailSender'))
EMAIL_RECEIVER = str(os.getenv('emailReceiver'))
EMAIL_SMTP_SERVER = str(os.getenv('emailSMTPServer'))
EMAIL_SMTP_PORT = int(str(os.getenv('emailSMTPPort')))
EMAIL_SMTP_USER = str(os.getenv('emailSMTPUser'))
EMAIL_SMTP_PASSWORD = str(os.getenv('emailSMTPPassword'))
OUTPUT_PATH = str(os.getenv('backupOutputPath', '.'))  # Default to current directory if not set

# Ensure all required variables are loaded
if not all([DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD, EMAIL_SENDER, EMAIL_RECEIVER, EMAIL_SMTP_SERVER, EMAIL_SMTP_PORT, EMAIL_SMTP_USER, EMAIL_SMTP_PASSWORD]):
    raise ValueError("Some environment variables are missing.")

# Set the PGPASSWORD environment variable to avoid password prompt
os.environ['PGPASSWORD'] = DB_PASSWORD

# Generate a timestamp for the backup file
timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
backup_file = os.path.join(OUTPUT_PATH, f"{DB_DATABASE}_backup_{timestamp}.sql")

# Construct the pg_dump command
pg_dump_command = [
    "pg_dump",
    "--host", DB_HOST,
    "--dbname", DB_DATABASE,
    "--username", DB_USER,
    "--file", backup_file
]

try:
    # Execute the pg_dump command
    result = subprocess.run(pg_dump_command, check=True, text=True, capture_output=True)
    print(f"Backup successful! Backup file created: {backup_file}")
except subprocess.CalledProcessError as e:
    print(f"Backup failed: {e.stderr}")
    # Send email notification
    try:
        msg = MIMEText(f"Backup of database {DB_DATABASE} failed.\nError: {e.stderr}")
        msg['Subject'] = f"Database Backup Failed for {DB_DATABASE}"
        msg['From'] = EMAIL_SENDER
        msg['To'] = EMAIL_RECEIVER

        with smtplib.SMTP(EMAIL_SMTP_SERVER, EMAIL_SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_SMTP_USER, EMAIL_SMTP_PASSWORD)
            server.sendmail(EMAIL_SENDER, EMAIL_RECEIVER, msg.as_string())
        print("Failure notification email sent successfully.")
    except Exception as email_error:
        print(f"Failed to send notification email: {email_error}")

# Clean up the PGPASSWORD environment variable
del os.environ['PGPASSWORD']
