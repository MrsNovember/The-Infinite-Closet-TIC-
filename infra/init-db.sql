-- The Infinite Closet (TIC) - Database Initialization Script

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS users;
CREATE SCHEMA IF NOT EXISTS fashion;
CREATE SCHEMA IF NOT EXISTS marketplace;
CREATE SCHEMA IF NOT EXISTS social;

-- Users Schema Tables
CREATE TABLE users.accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false
);

CREATE INDEX idx_users_email ON users.accounts(email);
CREATE INDEX idx_users_username ON users.accounts(username);

-- Fashion Schema Tables
CREATE TABLE fashion.digital_twins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users.accounts(id) ON DELETE CASCADE,
    avatar_model_url TEXT,
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    measurements JSONB,
    skin_tone VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_digital_twins_user ON fashion.digital_twins(user_id);

CREATE TABLE fashion.virtual_closet (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users.accounts(id) ON DELETE CASCADE,
    garment_id UUID,
    garment_name VARCHAR(255),
    category VARCHAR(100),
    image_url TEXT,
    ar_model_url TEXT,
    metadata JSONB,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_favorite BOOLEAN DEFAULT false
);

CREATE INDEX idx_virtual_closet_user ON fashion.virtual_closet(user_id);
CREATE INDEX idx_virtual_closet_category ON fashion.virtual_closet(category);

CREATE TABLE fashion.outfits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users.accounts(id) ON DELETE CASCADE,
    outfit_name VARCHAR(255),
    description TEXT,
    garments JSONB,
    occasion VARCHAR(100),
    weather VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_public BOOLEAN DEFAULT false
);

CREATE INDEX idx_outfits_user ON fashion.outfits(user_id);

-- Marketplace Schema Tables
CREATE TABLE marketplace.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    category VARCHAR(100),
    images JSONB,
    ar_model_url TEXT,
    inventory INTEGER,
    sku VARCHAR(100) UNIQUE,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_products_brand ON marketplace.products(brand_id);
CREATE INDEX idx_products_category ON marketplace.products(category);

CREATE TABLE marketplace.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users.accounts(id) ON DELETE CASCADE,
    order_number VARCHAR(100) UNIQUE,
    total_amount DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'pending',
    items JSONB,
    shipping_address JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user ON marketplace.orders(user_id);
CREATE INDEX idx_orders_status ON marketplace.orders(status);
CREATE INDEX idx_orders_created ON marketplace.orders(created_at);

-- Social Schema Tables
CREATE TABLE social.runway_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users.accounts(id) ON DELETE CASCADE,
    runway_name VARCHAR(255),
    location VARCHAR(100),
    outfit_id UUID REFERENCES fashion.outfits(id),
    video_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0
);

CREATE INDEX idx_runway_sessions_user ON social.runway_sessions(user_id);
CREATE INDEX idx_runway_sessions_created ON social.runway_sessions(created_at);

CREATE TABLE social.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users.accounts(id) ON DELETE CASCADE,
    content TEXT,
    media_urls TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0
);

CREATE INDEX idx_posts_user ON social.posts(user_id);
CREATE INDEX idx_posts_created ON social.posts(created_at);

-- Grant permissions to app user
GRANT ALL PRIVILEGES ON SCHEMA users, fashion, marketplace, social TO tic_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA users, fashion, marketplace, social TO tic_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA users, fashion, marketplace, social TO tic_user;
