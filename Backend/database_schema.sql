
-- categories for types companies
CREATE TABLE categories(
    category_id text NOT NULL,
    category_name text,
    parent_category_id text,
    PRIMARY KEY(category_id)
);

-- genres for types of events
CREATE TABLE genres(
    genre_id text NOT NULL,
    genre_name text,
    parent_genre_id text,
    PRIMARY KEY(genre_id)
);

-- compaines
CREATE TABLE companies(
    company_id text NOT NULL,
    company_name text NOT NULL,
    category_id text,
    email varchar(255),
    phone varchar(15),
    website varchar(255),
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    advert_type varchar(255) DEFAULT 'Text'::character varying,
    advert_text varchar(1000),
    advert_image varchar(255),
    advert_expires date,
    company_address text,
    google_maps_link text,
    created_date date,
    created_by_user_id varchar(50),
    PRIMARY KEY(company_id)
);

-- locations 
CREATE TABLE locations(
    id text NOT NULL,
    name varchar(255),
    region varchar(255),
    country varchar(255),
    ismajor boolean,
    population integer,
    latitude double precision,
    longitude double precision,
    PRIMARY KEY(id)
);
CREATE INDEX idx_ismajor ON locations(ismajor);


-- users
CREATE TABLE users(
    userid text NOT NULL,
    userfname text,
    userlname text,
    userlocation text,
    useremail text,
    userpassword text,
    usertype text DEFAULT 'Viewer'::text,
    PRIMARY KEY(userid)
);
CREATE UNIQUE INDEX users_useremail_key ON users USING btree ("useremail");

-- settings
CREATE TABLE settings (
    Sname varchar(255),
    Svalue varchar(255)
);

-- posttypes
CREATE TABLE posttypes(
    post_id text NOT NULL,
    post_name text,
    post_size text,
    post_sizeinpixels text,
    post_price text,
    PRIMARY KEY(post_id)
);

create table series(
    series_id text not null,
    created_date date,
    created_by_user_id varchar(50)
);

CREATE TABLE events(
    event_id text NOT NULL,
    event_name text NOT NULL,
    company_id text,
    genre_id text,
    series_id text,
    email varchar(255),
    phone varchar(15),
    website varchar(255),
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    advert_type varchar(255) DEFAULT 'Text'::character varying,
    advert_text varchar(1000),
    advert_image varchar(255),
    advert_expires date,
    event_address text,
    google_maps_link text,
    created_date date,
    created_by_user_id varchar(50),
    PRIMARY KEY(event_id)
);