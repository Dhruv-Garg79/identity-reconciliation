#!/bin/bash

cat seed.sql
chmod +x docker-entrypoint-initdb.d/init.sh
psql -U $POSTGRES_USER -d $POSTGRES_DB -a -f seed.sql
