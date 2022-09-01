# docker kill pgbouncer
docker rm pgbouncer

docker run -ti --name pgbouncer \
 -e POSTGRESQL_USERNAME="pgbouncer" \
 -e POSTGRESQL_PASSWORD="asdf" \
 -e POSTGRESQL_DATABASE="layer3" \
 -e POSTGRESQL_HOST="host.docker.internal" \
 -e PGBOUNCER_DATABASE="layer3" \
 -e PGBOUNCER_MAX_CLIENT_CONN="120" \
 -e PGBOUNCER_POOL_MODE="session" \
 -p 6432:6432 \
bitnami/pgbouncer:latest