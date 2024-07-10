import re

def is_valid_basic_advert(text):
    errors = []

    if isAdvertTooLong(text, 100):
        errors.append("Basic advert text must be less than 100 characters")
    
    if isEmailInAdvert(text):
        errors.append("Basic advert must not contain an email address")

    if isWebAddressInAdvert(text):
        errors.append("Basic advert must not contain an web address")
    
    isSwear = isSwearWordInAdvert(text)
    if (isSwear != ""):
        errors.append("Advert must not contain word " + str(isSwear)) 

    return errors

def is_valid_custom_advert(text):
    errors = []

    if isAdvertTooLong(text, 1000):
        errors.append("Basic advert text must be less than 1000 characters")
    
    isSwear = isSwearWordInAdvert(text)
    if (isSwear != ""):
        errors.append("Advert must not contain word " + str(isSwear)) 

    return errors

def isAdvertTooLong(text, length):
    ### Check the length of the advert text ###
    return len(text) > length

def isEmailInAdvert(text):
    ### Check if there is an email in the advert text ##
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    if re.search(email_pattern, text):
        return True
    else:
        return False 

def isWebAddressInAdvert(text):
    ### Check if there is a web address in the advert text ###
    website_pattern = r'\b(https?://|www\.)[^\s/$.?#].[^\s]*\b'
    if re.search(website_pattern, text):
        return True
    else:
        return False

def isSwearWordInAdvert(text):
    ### Check is the advert contains swear words and offensive terms ###
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
            return swear_word

    # If all checks pass, return True
    return ""



def is_valid_advert(text):
    return "bobo"