import re

def is_valid_advert(text):
    # Check if the text is longer than 100 characters
    if len(text) > 100:
        return False

    # Regular expression patterns for email and website addresses
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    website_pattern = r'\b(https?://|www\.)[^\s/$.?#].[^\s]*\b'

    # Check for email addresses
    if re.search(email_pattern, text):
        return False

    # Check for website addresses
    if re.search(website_pattern, text):
        return False

    # List of swear words and offensive terms AI generated
    swear_words = [
        "ass",
        "asshole",
        "bastard",
        "bitch",
        "bollocks",
        "bullshit",
        "crap",
        "cunt",
        "damn",
        "dick",
        "dickhead",
        "fag",
        "faggot",
        "fuck",
        "fucking",
        "motherfucker",
        "nigger",
        "piss",
        "prick",
        "shit",
        "shitty",
        "slut",
        "twat",
        "wanker",
        "arse",
        "bugger",
        "cock",
        "cockhead",
        "cum",
        "dyke",
        "fucker",
        "goddamn",
        "godsdamn",
        "hell",
        "homo",
        "jerk",
        "kike",
        "mick",
        "nazi",
        "negro",
        "pussy",
        "queer",
        "retard",
        "scumbag",
        "shemale",
        "spic",
        "tits",
        "tosser",
        "whore",
        "anal",
        "anus",
        "blowjob",
        "boobs",
        "clitoris",
        "cock",
        "cocksucker",
        "dildo",
        "ejaculation",
        "erection",
        "fisting",
        "handjob",
        "horny",
        "labia",
        "masturbate",
        "masturbation",
        "orgasm",
        "penis",
        "porn",
        "pornography",
        "semen",
        "sex",
        "sexual",
        "tit",
        "tits",
        "vagina",
        "viagra",
        "adderall",
        "amphetamine",
        "cocaine",
        "crack",
        "crystal meth",
        "ecstasy",
        "heroin",
        "ketamine",
        "lsd",
        "marijuana",
        "mdma",
        "meth",
        "methamphetamine",
        "morphine",
        "opium",
        "oxycodone",
        "oxycontin",
        "pcp",
        "shrooms",
        "speed",
        "steroids",
        "thc",
        "weed"
    ]



    # Check for swear words
    for swear_word in swear_words:
        if swear_word.lower() in text.lower():
            return False

    # If all checks pass, return True
    return True
