CREATE TYPE roles AS ENUM ('DEVELOPER', 'LEAD');
CREATE TABLE user (
    id SERIAL PRIMARY KEY,
    email VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role roles NOT NULL DEFAULT 'DEVELOPER'
);
CREATE TYPE environments AS ENUM ('DEVELOPMENT', 'STAGING', 'PRODUCTION');
CREATE TYPE service_status AS ENUM ('HEALTHY', 'DEGRADED', 'DOWN');
CREATE TABLE microservice (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    endpointUrl VARCHAR(500) NOT NULL,
    environment environments NOT NULL DEFAULT 'DEVELOPMENT',
    status service_status NOT NULL DEFAULT 'HEALTHY',
    version VARCHAR(20) NOT NULL,
    owner_email VARCHAR(20) NOT NULL REFERENCES user(email)
)