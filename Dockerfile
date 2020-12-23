# https://hub.docker.com/_/node/
FROM node:15-alpine


COPY _docker/rootfs/ /

RUN chmod +x /docker-entrypoint.sh


COPY --chown=node:node node_modules/ \
     /app/node_modules/
COPY --chown=node:node out/ \
     /app/

# TODO: temporary stuff to simplify deploy to staging
COPY --chown=node:node src/api/graphql/mocks.js src/api/graphql/mock-store.js \
     /app/src/api/graphql/
COPY --chown=node:node api-mock-server.js graphql.mock.schema.json \
     /app/
COPY --chown=node:node media-server-mock/ \
     /app/media-server-mock/


ENV SHARE_APP=0


WORKDIR /app

EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["node", "./server.js"]
