import feedparser
import os

## Working RSS Feeds

#rss_url="https://www.cheshire-live.co.uk/whats-on/?service=rss"
rss_url="https://www.cheshirewildlifetrust.org.uk/events/rss.xml"

## Broken rss feeds
#rss_url = "https://www.visit-nottinghamshire.co.uk/information/event-product-rss-feed"
#rss_url = "https://community2.newcastle.gov.uk/apps/all-events/n?page=1"







seen_entries_file = "seen_entries.txt"

# Load seen entries from file
if os.path.exists(seen_entries_file):
    with open(seen_entries_file, "r") as file:
        seen_entries = set(file.read().splitlines())
else:
    seen_entries = set()

# Parse the RSS feed
feed = feedparser.parse(rss_url)

# Open file to append new seen entries
with open(seen_entries_file, "a") as file:
    # Display the feed's title and new entries
    #print(f"Feed Title: {feed.feed.title}")
    print("New Entries:\n")

    for entry in feed.entries:
        if entry.id not in seen_entries:
            print("="*20)
            print("entry=", entry)
            print(f"**Title: {entry.title}")
            print(f"**Link: {entry.link}")
            print(f"**Published: {entry.published}")
            print(f"**Summary: {entry.summary}\n")

            # Mark entry as seen
            seen_entries.add(entry.id)
            file.write(entry.id + "\n")
