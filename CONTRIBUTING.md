Contribution Guide
==================

## Requirements

- When you're adding or removing site pages, make sure that they are correctly routed in [Nginx configuration file](_helm/frontend/conf/nginx.vh.conf).
- When you're changing project files layout, make sure that project distribution is created as expected [in `Dockerfile`](Dockerfile).
- All project dependencies should be declared with [Yarn]. In other words, using [NPM] or [Bower] is __not allowed__.
- All project JavaScript sources must be written accordingly with [JavaScript Standard Style].
- If you don't use docker-wrapped commands, make sure that tools you use have the same version as in docker-wrapped commands. It's [latest version](.gitlab-ci.yml), mainly.




## Operations

Take a look at [`Makefile`] and [`package.json`] for commands usage details.


### Local development

Use `docker-compose` from [`Makefile`] to boot up [Docker Compose environment](docker-compose.yml) for local development:
```bash
make up
make down
```

To serve app with hot module replacement use `webpack-dev-server` from [`Makefile`]:
```bash
make serve
```

Or `helm` and `minikube` to boot up local [Minikube] cluster __(preferred)__:
```bash
make minikube.boot  # to create and boot up Minikube VM

make docker.build minikube=yes  # to build image for Minikube Docker Daemon

make helm.up
make helm.down

minikube stop    # to stop Minikube VM
minikube delete  # to remove Minikube VM
```


### Review and staging clusters

Use `helm` to deploy project onto `review` or `staging` [Kubernetes] cluster.

```bash
make helm.up cluster=review
make helm.down cluster=review

make helm.up cluster=staging
make helm.down cluster=staging
```

Use `helm.discover.sftp` from [`Makefile`] to show SFTP credentials for accessing source code in deployed container:
```bash
make helm.discover.sftp cluster=review

make helm.discover.sftp cluster=staging
```

Use `deploy:review`/`stop:deploy:review` manual CI jobs for deploying project onto `review` [Kubernetes] cluster directly from GitLab MR. For more information checkout [Review Apps tutorial].


### Dependencies

To resolve all project dependencies use commands from [`Makefile`]:
```bash
make deps

# or Yarn/Cargo only
make yarn
make cargo
```

To upgrade project dependencies specify the appropriate sub-command:
```bash
make yarn cmd='upgrade'
make cargo cmd='update'
```


### Building

To build both client and server bundles use commands from [`Makefile`]:
```bash
make build

# or specify concrete target
make build target=client
make build target=server

# or produce production-ready bundles with minified assets
make build dev=no

# or docker-wrapped
make build dockerized=yes
```

To build/rebuild project Docker image use command from [`Makefile`]:
```bash
make docker.build
```

#### Mobile platforms

To develop native mobile app use [NativeScript] CLI (but [prepare your environment][9] first):
```bash
# Android
yarn build:android
yarn debug:android
yarn run:android

# iOS
yarn build:ios
yarn debug:ios
yarn run:ios

# to learn more about NativeScript CLI
tns help
```

__NOTE__: Use `nativescript-cli` of 6.5 version, but not higher!


### Linting

To lint TypeScript/JavaScript sources use commands from [`Makefile`]:
```bash
make lint

# or with Yarn for TS/JS only
yarn lint
yarn lint:ts
yarn lint:js

# to automatically fix StandardJS issues
make yarn.lint fix=yes
yarn lint:js --fix
```


### Testing

To run tests use commands from [`Makefile`]:
```bash
make test

# or concrete tests
make test.unit.ts
make test.e2e
make test.docker

# or with Yarn
yarn test:unit
yarn test:e2e

# E2E tests could be run separately
yarn test:e2e:chrome
yarn test:e2e:ssr

# or in interactive mode
yarn test:e2e:interactive
```

To run unit tests in watch mode use commands from [`Makefile`]:
```bash
make test.unit.ts watch=yes

# or with Yarn
yarn watch:test:unit
```


### Documentation

To generate project documentation use commands from [`Makefile`]:
```bash
make docs

# or with Yarn
yarn docs
```


### Playground

To start [GraphQL Playground] in-browser IDE for exploring GraphQL API endpoint use the one deployed with [backend API][social/backend].
- http://front.soc.localhost/api/playground for Docker Compose environment.
- http://front.soc.test/api/playground for Minikube deployments (`minikube` cluster).
- https://front.soc.stg.t11913.org/api/playground for ~"area: staging" deployment (`staging` cluster).
- `https://<branch-slug>-front.soc.rev.t11913.org/api/playground` for GitLab Review Apps (`review` cluster).




## Tips & Tricks

- For more information about `minikube` and `helm` usage checkout [Minikube tutorial].
- For more information about `staging` and `review` cluster usage checkout [Staging tutorial].





[`Makefile`]: Makefile
[`package.json`]: package.json

[social/backend]: https://git.instrumentisto.com/social/backend

[Bower]: https://bower.io
[JavaScript Standard Style]: https://standardjs.com/rules.html
[NativeScript]: https://www.nativescript.org
[Kubernetes]: https://kubernetes.io
[Minikube]: https://github.com/kubernetes/minikube
[Minikube tutorial]: https://git.instrumentisto.com/common/documentation/blob/master/tutorials/minikube.md
[NPM]: https://www.npmjs.com
[Review Apps tutorial]: https://git.instrumentisto.com/common/documentation/blob/master/tutorials/staging.md#review-apps
[Staging tutorial]: https://git.instrumentisto.com/common/documentation/blob/master/tutorials/staging.md
[Yarn]: https://yarnpkg.com

[9]: https://docs.nativescript.org/start/quick-setup#full-setup
