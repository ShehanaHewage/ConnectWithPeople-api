CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE posts (
    post_id UUID PRIMARY KEY,
    author_id UUID NOT NULL,
    description TEXT,
    maps_coordinates VARCHAR(255),
    media_url VARCHAR(255),
    post_type VARCHAR(50),
    ending_date TIMESTAMP WITH TIME ZONE,
    likes_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT fk_author FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE comments (
    comment_id UUID PRIMARY KEY,
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE polls (
    poll_id UUID PRIMARY KEY,
    post_id UUID NOT NULL UNIQUE,
    question TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT fk_poll_post FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

CREATE TABLE poll_options (
    poll_option_id UUID PRIMARY KEY,
    poll_id UUID NOT NULL,
    option_text TEXT NOT NULL,
    votes_count INTEGER DEFAULT 0,

    CONSTRAINT fk_poll_option_poll FOREIGN KEY (poll_id) REFERENCES polls(poll_id) ON DELETE CASCADE
);

-- If you need to track WHO voted for which option (more complex):
-- CREATE TABLE poll_votes (
--     poll_vote_id UUID PRIMARY KEY,
--     poll_option_id UUID NOT NULL,
--     user_id UUID NOT NULL,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--     CONSTRAINT fk_vote_option FOREIGN KEY (poll_option_id) REFERENCES poll_options(poll_option_id) ON DELETE CASCADE,
--     CONSTRAINT fk_vote_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
--     UNIQUE (poll_option_id, user_id) -- Ensure a user can vote for an option only once
-- );