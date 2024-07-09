import uuid

categories = {
    '00000000-0000-0000-0000-000000000001': ('Sports', [
        'Football', 'Basketball', 'Tennis', 'Running', 'Cycling', 'Swimming', 'Martial Arts', 'Walking & Hiking'
    ]),
    '00000000-0000-0000-0000-000000000002': ('Music', [
        'Concerts', 'Live Bands', 'DJ Nights', 'Rave Parties', 'Silent Discos', 'Classical Music', 'Music Festivals'
    ]),
    '00000000-0000-0000-0000-000000000003': ('Performing and Visual Arts', [
        'Theatre', 'Dance Performances', 'Opera', 'Ballet', 'Drag Shows', 'Magic Shows', 'Stand-Up Comedy', 
        'Book Signings', 'Author Talks', 'Poetry Readings', 'Literary Festivals', 'Art Exhibitions', 'Gallery Openings', 
        'Line Drawing Classes', 'Sculpture Workshops'
    ]),
    '00000000-0000-0000-0000-000000000004': ('Hobbies & Interests', [
        'Book Clubs', 'Creative Writing', 'Art Workshops', 'Craft Fairs', 'Car Shows & Clubs', 'Collecting', 'Photography', 
        'Cosplay & Gaming', 'Comic Conventions', 'Esports Tournaments', 'Game Nights', 'History Talks', 'Science Exhibitions'
    ]),
    '00000000-0000-0000-0000-000000000005': ('Business & Networking', [
        'Business Networking', 'Conferences', 'Seminars', 'Job Fairs', 'Workshops'
    ]),
    '00000000-0000-0000-0000-000000000006': ('Nightlife', [
        'Nightclubs', 'Pub Quizzes / Trivia', 'Karaoke', 'Bingo', 'Murder Mystery', 'Escape Rooms'
    ]),
    '00000000-0000-0000-0000-000000000007': ('Festivals & Fairs', [
        'Charity Events', 'Community Gatherings', 'Local Markets', 'Craft Fairs', 'Cultural Festivals'
    ]),
    '00000000-0000-0000-0000-000000000008': ('Food & Drink', [
        'Food Festivals', 'Gin, Wine, Whiskey Tasting', 'Beer Festivals', 'Food Tasting', 'Cooking Classes', 'Brewery Tours'
    ]),
    '00000000-0000-0000-0000-000000000009': ('Health & Wellness', [
        'Yoga Classes', 'Meditation Sessions', 'Mental Health Workshops', 'Fitness Classes'
    ]),
    '00000000-0000-0000-0000-000000000010': ('Seasonal & Holiday', [
        'Halloween', 'Christmas', 'Easter', "Mother's/Father's Day", 'Pumpkin Picking', 'New Years Party'
    ]),
    '00000000-0000-0000-0000-000000000011': ('Family & Kids', [
        'Family Fun Days', "Children's Theatre", 'Puppet Shows', 'Drive-In Cinema', 'Interactive Storytelling'
    ]),
}

# Function to generate a new UUID
def generate_id():
    return str(uuid.uuid4())

# Generate SQL statements
sql_statements = []
for parent_id, (parent_name, subcategories) in categories.items():
    parent_sql = f"INSERT INTO genres (genre_id, genre_name, parent_genre_id) VALUES ('{parent_id}', '{parent_name}', '0');"
    sql_statements.append(parent_sql)
    for subcategory in subcategories:
        sub_id = generate_id()
        sub_sql = f"INSERT INTO genres (genre_id, genre_name, parent_genre_id) VALUES ('{sub_id}', '{subcategory}', '{parent_id}');"
        sql_statements.append(sub_sql)

# Save the SQL statements to a text file
with open('c:\\temp\\insert_genres.sql', 'w') as file:
    for statement in sql_statements:
        file.write(statement + '\n')

print("SQL insert statements have been saved to insert_genres.sql")