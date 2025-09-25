#!/bin/bash
set -e;

# Script start  a user with limited privileges for n8n so it does not run as postgres superuser

if [ -n "$POSTGRES_NON_ROOT_USER" ] && [ -n "$POSTGRES_NON_ROOT_PASSWORD" ]; then
	psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
		CREATE USER $POSTGRES_NON_ROOT_USER WITH PASSWORD '$POSTGRES_NON_ROOT_PASSWORD';
		GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_NON_ROOT_USER;
		GRANT CREATE ON SCHEMA public TO $POSTGRES_NON_ROOT_USER;
	EOSQL
else
	echo "SETUP INFO: No non root creation variables found, skipping creation of non root user.";
fi
