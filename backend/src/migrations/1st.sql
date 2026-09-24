CREATE TYPE user_role AS ENUM ('DEVELOPER', 'LEAD');
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'DEVELOPER'
);
CREATE TYPE microservice_environment AS ENUM ('DEVELOPMENT', 'STAGING', 'PRODUCTION');
CREATE TYPE microservice_status AS ENUM ('HEALTHY', 'DEGRADED', 'DOWN');
CREATE TABLE microservice (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    endpointUrl VARCHAR(500) NOT NULL,
    environment microservice_environment NOT NULL DEFAULT 'DEVELOPMENT',
    status microservice_status NOT NULL DEFAULT 'HEALTHY',
    version VARCHAR(20) NOT NULL,
    owner_email SERIAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_email) REFERENCES users(id)
);