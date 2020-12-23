###############################
# Common defaults/definitions #
###############################

comma := ,

# Checks two given strings for equality.
eq = $(if $(or $(1),$(2)),$(and $(findstring $(1),$(2)),\
                                $(findstring $(2),$(1))),1)
# Makes given string usable in URL.
# Analogue of slugify() function from GitLab:
# https://gitlab.com/gitlab-org/gitlab-foss/blob/master/lib/gitlab/utils.rb
slugify = $(strip $(shell echo $(2) | tr [:upper:] [:lower:] \
                                    | tr -c [:alnum:] - \
                                    | cut -c 1-$(1) \
                                    | sed -e 's/^-*//' -e 's/-*$$//'))




######################
# Project parameters #
######################

IMAGE_NAME := hub.instrumentisto.com/social/frontend

RELEASE_BRANCH := release
MAINLINE_BRANCH := master
CURRENT_BRANCH := $(strip $(if $(call eq,$(CI_SERVER),yes),\
	$(CI_COMMIT_REF_NAME),$(shell git branch | grep \* | cut -d ' ' -f2)))

VERSION ?= $(strip $(shell grep '"version": ' package.json \
	| cut -d ':' -f2 | cut -d '"' -f2))
CARGO_HOME ?= $(strip $(shell grep 'CARGO_HOME: ' .gitlab-ci.yml \
	| cut -d ':' -f2))
RUST_VER ?= $(strip $(shell grep 'RUST_VER: ' .gitlab-ci.yml \
	| cut -d ':' -f2 | cut -d "'" -f2))
NODE_VER ?= $(strip $(shell grep 'NODE_VER: ' .gitlab-ci.yml \
	| cut -d ':' -f2 | cut -d "'" -f2))




###########
# Aliases #
###########

build: yarn.build


# Resolve all project dependencies.
#
# Usage:
#	make deps [dev=(yes|no)]

deps: cargo yarn


docs: docs.ts


down: docker.down


fmt: cargo.fmt


lint: yarn.lint


squash: git.squash


# Run all project tests.
#
# Usage:
#	make test

test: test.unit.ts test.e2e test.docker


up: docker.up


serve: yarn.serve




############################
# Synchronization commands #
############################

# Synchronizes GraphQL API schema, CockroachDB schema and Docker image from
# social/backend.
#
# Usage:
#	make sync.backend

backend-edge ?= hub.instrumentisto.com/social/backend:edge
cockroachdb-edge ?= hub.instrumentisto.com/social/backend/db/cockroachdb:edge

sync.backend:
	cargo update -p soc-api-graphql
	$(deps)
	sudo rm -rf .cache/cockroachdb/
	docker pull $(backend-edge)
	docker pull $(cockroachdb-edge)




##################
# Cargo commands #
##################

# Resolve Cargo project dependencies.
#
# Usage:
#	make cargo [cmd=(fetch|<cargo-cmd>)]
#	           [dockerized=(no|yes)]

cargo-cmd = $(if $(call eq,$(cmd),),fetch,$(cmd))

cargo:
ifneq ($(dockerized),no)
	docker run --rm --network=host -v "$(PWD)":/app -w /app \
	           -v "$(abspath $(CARGO_HOME))/registry":/usr/local/cargo/registry\
		rust:$(RUST_VER) \
			make cargo cmd='$(cargo-cmd)' dockerized=no
else
	cargo $(cargo-cmd)
ifeq ($(cargo-cmd),fetch)
	cargo run --bin export_graphql_schema
endif
endif


# Format Rust sources with rustfmt.
#
# Usage:
#	make cargo.fmt [check=(no|yes)]
#	               [dockerized=(yes|no)]

cargo.fmt:
ifneq ($(dockerized),no)
	docker pull rustlang/rust:nightly
	docker run --rm --network=host -v "$(PWD)":/app -w /app \
	           -v "$(abspath $(CARGO_HOME))/registry":/usr/local/cargo/registry\
		rustlang/rust:nightly \
			make cargo.fmt check='$(check)' dockerized=no pre-install=yes
else
ifeq ($(pre-install),yes)
	rustup component add rustfmt
endif
	cargo +nightly fmt --all $(if $(call eq,$(check),yes),-- --check,)
endif




#################
# Yarn commands #
#################

# Resolve NPM project dependencies with Yarn.
#
# Optional 'cmd' parameter may be used for handy usage of docker-wrapped Yarn,
# for example: make yarn cmd='upgrade'
#
# Usage:
#	make yarn [cmd=('install --pure-lockfile'|<yarn-cmd>)]
#	          [dev=(yes|no)]
#	          [dockerized=(no|yes)]

yarn-cmd = $(if $(call eq,$(cmd),),install --pure-lockfile,$(cmd))

yarn:
ifeq ($(dockerized),yes)
	docker run --rm --network=host -v "$(PWD)":/app -w /app \
	           -e CI_SERVER='$(CI_SERVER)' \
		node:$(NODE_VER) \
			make yarn cmd='$(yarn-cmd)' dev='$(dev)' dockerized=no
else
	yarn $(yarn-cmd) \
		$(if $(call eq,$(CI_SERVER),yes),\
			--no-progress,) \
		$(if $(and $(call eq,$(dev),no),\
		           $(call eq,$(word 1,$(yarn-cmd)),install)),\
			--production,)
ifneq ($(dev),no)
ifeq ($(word 1,$(yarn-cmd)),install)
	CYPRESS_CACHE_FOLDER=.cache/cypress/ \
	node_modules/.bin/cypress install
endif
endif
endif


# Build project from TypeScript sources with webpack.
#
# Usage:
#	make yarn.build [target=(all|client|server)]
#	                [dev=(yes|no)]
#	                [dockerized=(no|yes)]

yarn.build:
ifeq ($(dockerized),yes)
	docker run --rm -v "$(PWD)":/app -w /app \
		node:$(NODE_VER) \
			make yarn.build target='$(target)' dev='$(dev)' dockerized=no
else
	NODE_ENV=$(if $(call eq,$(dev),no),production,development) \
	MEDEA_HOST=$(if $(call eq,$(dev),no),"'https://$(helm-up-review-app-domain)'","'http://localhost'") \
	yarn build:$(if $(call eq,$(target),),all,$(target))
	cp server.js out/
endif


# Start dev server for better development experience.
#
# Usage:
#	make yarn.serve

yarn.serve:
	make docker.up background=yes log=no
	yarn start:dev


# Lint project TypeScript (with ESLint) and JavaScript (with Standard) sources.
#
# Usage:
#	make yarn.lint [fix=(no|yes)]
#	               [dockerized=(no|yes)]

yarn.lint:
ifeq ($(dockerized),yes)
	docker run --rm -v "$(PWD)":/app -w /app \
		node:$(NODE_VER) \
			make yarn.lint fix='$(fix)' dockerized=no
else
	yarn lint $(if $(call eq,$(fix),yes),--fix,)
endif


# Bundle hash save to file after `yarn build:client` script execution.
#
# Usage:
#	make yarn.write.hash

yarn-write-hash-dir = out/public/

yarn.write.hash:
	@echo {\"hash\":\"$(shell ls $(yarn-write-hash-dir)main.*.js \
		| cut -d '.' -f2)\"} > $(yarn-write-hash-dir)bundle-hash.json




####################
# Testing commands #
####################

# Run Bats tests for project Docker image.
#
# Documentation of Bats:
#	https://github.com/bats-core/bats-core
#
# Usage:
#	make test.docker [IMAGE=(<empty>|review|<docker-image-postfix>)]
#	                 [TAG=(dev|<docker-tag>)]

test-docker-image = $(IMAGE_NAME)$(if $(call eq,$(IMAGE),),,/$(IMAGE))
test-docker-tag = $(if $(call eq,$(TAG),),dev,$(TAG))

test.docker:
	IMAGE=$(test-docker-image):$(test-docker-tag) \
	node_modules/.bin/bats test/docker/suite.bats


# Run Cypress.js E2E tests for project.
#
# Usage:
#	make test.e2e [( [start-app=no]
#	               | start-app=yes [IMAGE=(<empty>|review)]
#	                               [TAG=(dev|<docker-tag>)]
#	                               [no-cache=(no|yes)]
#	                               [pull=(no|yes)] )]

test.e2e:
ifeq ($(start-app),yes)
	make docker.up IMAGE=$(IMAGE) TAG=$(TAG) \
	               no-cache=$(no-cache) pull=$(pull) \
	               background=yes log=no
endif
	docker run --rm -v "$(PWD)":/app -w /app --ipc=host --shm-size=1g \
			--network=container:socfront-nginx \
			-e CYPRESS_CACHE_FOLDER=.cache/cypress/ \
			-e CYPRESS_BASE_URL=http://127.0.0.1 \
		cypress/browsers:latest \
			yarn test:e2e
ifneq ($(start-app),no)
	make docker.down
endif


# Run TypeScript sources unit tests for project with Jest.
#
# Usage:
#	make test.unit.ts [watch=(no|yes)]
#	                  [dockerized=(no|yes)]

test.unit.ts:
ifeq ($(dockerized),yes)
	docker run --rm -v "$(PWD)":/app -w /app \
		node:$(NODE_VER) \
			make test.unit.ts watch='$(watch)' dockerized=no
else
	yarn $(if $(call eq,$(watch),yes),watch:,)test:unit
endif




##########################
# Documentation commands #
##########################

# Generate Typedoc documentation of project TypeScript sources.
#
# Documentation of Typedoc:
#	https://typedoc.org/guides/usage
#
# Usage:
#	make docs.ts [dockerized=(no|yes)]

docs.ts:
ifeq ($(dockerized),yes)
	docker run --rm -v "$(PWD)":/app -w /app \
		node:$(NODE_VER) \
			make docs.ts dockerized=no
else
	yarn docs
endif




###################
# Docker commands #
###################

docker-env = $(strip $(if $(call eq,$(minikube),yes),\
	$(subst export,,$(shell minikube docker-env | cut -d '\#' -f1)),))

# Authenticate to GitLab Container Registry where project Docker images
# are stored.
#
# Usage:
#	make docker.auth [user=<gitlab-username>] [pass-stdin=(no|yes)]
#	                 [minikube=(no|yes)]

docker.auth:
	$(docker-env) \
	docker login $(word 1,$(subst /, ,$(IMAGE_NAME))) \
		$(if $(call eq,$(user),),,--username=$(user)) \
		$(if $(call eq,$(pass-stdin),yes),--password-stdin,)


# Build project Docker image.
#
# Usage:
#	make docker.build [IMAGE=(<empty>|review|artifacts)]
#	                  [TAG=(dev|<tag>)]
#	                  [no-cache=(no|yes)]
#	                  [minikube=(no|yes)]

docker-build-image-name = $(IMAGE_NAME)$(if $(call eq,$(IMAGE),),,/$(IMAGE))
docker-build-dir = .
ifeq ($(IMAGE),artifacts)
docker-build-dir = _build/artifacts
endif

docker.build:
ifeq ($(IMAGE),artifacts)
ifeq ($(wildcard _build/artifacts/rootfs/docs/ts),)
	@make docs.ts
endif
ifeq ($(wildcard _build/artifacts/rootfs/helm),)
	@make helm.build ver=$(VERSION)
endif
endif
	$(docker-env) \
	docker build $(if $(call eq,$(minikube),yes),,--network=host) --force-rm \
		$(if $(call eq,$(no-cache),yes),\
			--no-cache --pull,) \
		-t $(docker-build-image-name):$(if $(call eq,$(TAG),),dev,$(TAG)) \
		$(docker-build-dir)/


# Stop project in Docker Compose development environment
# and remove all related containers.
#
# Usage:
#	make docker.down

docker.down:
	docker-compose down --rmi=local -v


# Pull project Docker images from GitLab Container Registry.
#
# Usage:
#	make docker.pull [IMAGE=(<empty>|review|artifacts)]
#	                 [TAGS=(dev|@all|<t1>[,<t2>...])]
#	                 [minikube=(no|yes)]

docker-pull-image-name = $(IMAGE_NAME)$(if $(call eq,$(IMAGE),),,/$(IMAGE))
docker-pull-tags = $(if $(call eq,$(TAGS),),dev,$(TAGS))

docker.pull:
ifeq ($(docker-pull-tags),@all)
	$(docker-env) \
	docker pull $(docker-pull-image-name) --all-tags
else
	$(foreach tag,$(subst $(comma), ,$(docker-pull-tags)),\
		$(call docker.pull.do,$(tag)))
endif
define docker.pull.do
	$(eval tag := $(strip $(1)))
	$(docker-env) \
	docker pull $(docker-pull-image-name):$(tag)
endef


# Push project Docker images to GitLab Container Registry.
#
# Usage:
#	make docker.push [IMAGE=(<empty>|review|artifacts)]
#	                 [TAGS=(dev|<t1>[,<t2>...])]
#	                 [minikube=(no|yes)]

docker-push-image-name = $(IMAGE_NAME)$(if $(call eq,$(IMAGE),),,/$(IMAGE))
docker-push-tags = $(if $(call eq,$(TAGS),),dev,$(TAGS))

docker.push:
	$(foreach tag,$(subst $(comma), ,$(docker-push-tags)),\
		$(call docker.push.do,$(tag)))
define docker.push.do
	$(eval tag := $(strip $(1)))
	$(docker-env) \
	docker push $(docker-push-image-name):$(tag)
endef


# Tag project Docker image with given tags.
#
# Usage:
#	make docker.tag [IMAGE=(<empty>|review|artifacts)]
#	                [of=(dev|<of-tag>)] [TAGS=(dev|<with-t1>[,<with-t2>...])]
#	                [as-image=(<empty>|review|artifacts)]
#	                [minikube=(no|yes)]

docker-tag-image-name = $(IMAGE_NAME)$(if $(call eq,$(IMAGE),),,/$(IMAGE))
docker-tag-of = $(if $(call eq,$(of),),dev,$(of))
docker-tag-with = $(if $(call eq,$(TAGS),),dev,$(TAGS))
docker-tag-as-image-name = $(strip $(if $(call eq,$(as-image),),\
	$(docker-tag-image-name),$(IMAGE_NAME)/$(as-image)))

docker.tag:
	$(foreach tag,$(subst $(comma), ,$(docker-tag-with)),\
		$(call docker.tag.do,$(docker-tag-of),$(tag)))
define docker.tag.do
	$(eval from := $(strip $(1)))
	$(eval to := $(strip $(2)))
	$(docker-env) \
	docker tag $(docker-tag-image-name):$(from) \
	           $(docker-tag-as-image-name):$(to)
endef


# Save project Docker images in a tarball file.
#
# Usage:
#	make docker.tar [IMAGE=(<empty>|review|artifacts)]
#	                [TAGS=(dev|<t1>[,<t2>...])]
#	                [minikube=(no|yes)]

docker-tar-image-name = $(IMAGE_NAME)$(if $(call eq,$(IMAGE),),,/$(IMAGE))
docker-tar-dir = .cache/docker/$(docker-tar-image-name)
docker-tar-tags = $(if $(call eq,$(TAGS),),dev,$(TAGS))

docker.tar:
	@mkdir -p $(docker-tar-dir)/
	$(docker-env) \
	docker save \
		-o $(docker-tar-dir)/$(subst $(comma),_,$(docker-tar-tags)).tar \
		$(foreach tag,$(subst $(comma), ,$(docker-tar-tags)),\
			$(docker-tar-image-name):$(tag))


docker.test: test.docker


# Load project Docker images from a tarball file.
#
# Usage:
#	make docker.untar [IMAGE=(<empty>|review|artifacts)]
#	                  [TAGS=(dev|<t1>[,<t2>...])]
#	                  [minikube=(no|yes)]

docker-untar-image-name = $(IMAGE_NAME)$(if $(call eq,$(IMAGE),),,/$(IMAGE))
docker-untar-dir = .cache/docker/$(docker-untar-image-name)
docker-untar-tags = $(if $(call eq,$(TAGS),),dev,$(TAGS))

docker.untar:
	$(docker-env) \
	docker load \
		-i $(docker-untar-dir)/$(subst $(comma),_,$(docker-untar-tags)).tar


# Run project in Docker Compose development environment.
#
# Usage:
#	make docker.up [IMAGE=(<empty>|review)] [TAG=(dev|<docker-tag>)]
#	               [pull=(no|yes)]
#	               [rebuild=(no|yes)] [no-cache=(no|yes)]
#	               [( [background=no]
#	                | background=yes [log=(no|yes)] )]

docker-up-image-name = $(IMAGE_NAME)$(if $(call eq,$(IMAGE),),,/$(IMAGE))
docker-up-tag = $(if $(call eq,$(TAG),),dev,$(TAG))

docker.up: docker.down
ifeq ($(pull),yes)
	COMPOSE_IMAGE_NAME=$(docker-up-image-name) \
	COMPOSE_IMAGE_TAG=$(docker-up-tag) \
	docker-compose pull --parallel --ignore-pull-failures
endif
ifeq ($(rebuild),yes)
	@make docker.build IMAGE=$(IMAGE) TAG=$(docker-up-tag) no-cache=$(no-cache)
endif
ifeq ($(no-cache),yes)
	rm -rf .cache/cockroachdb/data/
endif
	COMPOSE_IMAGE_NAME=$(docker-up-image-name) \
	COMPOSE_IMAGE_TAG=$(docker-up-tag) \
	docker-compose up \
		$(if $(call eq,$(background),yes),-d,--abort-on-container-exit)
ifeq ($(background),yes)
ifeq ($(log),yes)
	@docker logs -f socfront-app
endif
endif




##############################
# Helm and Minikube commands #
##############################

helm-cluster = $(if $(call eq,$(cluster),),minikube,$(cluster))

helm-chart-dir = _helm/$(if $(call eq,$(chart),),frontend,$(chart))
helm-chart-vals-dir = _dev

helm-release-default = $(strip $(if $(call eq,$(helm-cluster),review),\
	$(CURRENT_BRANCH),dev))
helm-release = $(call slugify,40,\
	socfront$(strip $(if $(call eq,$(helm-cluster),staging),,\
	-$(if $(call eq,$(release),),$(helm-release-default),$(release)))))
helm-release-namespace = $(strip \
	$(if $(call eq,$(helm-cluster),staging),staging,\
	$(if $(call eq,$(helm-cluster),review),staging-review,\
	default)))

helm-cluster-args = $(strip $(if $(call eq,$(CI_SERVER),yes),\
	--namespace=$(helm-release-namespace),\
	--kube-context=$(helm-cluster)))
kubectl-cluster-args = $(strip $(if $(call eq,$(CI_SERVER),yes),\
	--namespace=$(helm-release-namespace),\
	--context=$(helm-cluster)))

minikube-mount-pid = $(word 1,$(shell ps | grep -v grep \
                                         | grep 'minikube mount' \
                                         | grep 'social-frontend'))

# Run Helm command in context of concrete Kubernetes cluster.
#
# Usage:
#	make helm [cmd=(--help|'<command>')]
#	          [cluster=(minikube|review|staging)]

helm:
	helm $(helm-cluster-args) $(if $(call eq,$(cmd),),--help,$(cmd))


# Build Helm package from project Helm chart.
#
# Usage:
#	make helm.build [ver=<chart-version>]

helm-build-ver-default := $(strip \
	$(shell grep -m1 'version: ' $(helm-chart-dir)/Chart.yaml | cut -d ':' -f2))
helm-build-ver = $(strip \
	$(if $(call eq,$(ver),),$(helm-build-ver-default),\
	$(if $(call eq,$(ver),master),$(helm-build-ver-default),\
	$(patsubst v%,%,$(ver)))))

helm.build:
	@mkdir -p _build/artifacts/rootfs/helm/
	helm package \
		--destination=_build/artifacts/rootfs/helm/ \
		--version=$(helm-build-ver) \
		$(if $(call eq,$(helm-build-ver),$(helm-build-ver-default)),,\
			--app-version=$(helm-build-ver)) \
		$(helm-chart-dir)/


# Resolve project Helm charts dependencies.
#
# Usage:
#	make helm.dep [cmd=(build|update|list)]

helm-dep-cmd = $(if $(call eq,$(cmd),),build,$(cmd))

helm.dep:
	helm repo add instrumentisto-social-backend \
		https://social.io.instrumentisto.com/backend/helm \
		--username=proj-social-frontend \
		--password=m7DjZq2Ccj4pGZqfSVUSSeSsh
	helm dep $(helm-dep-cmd) $(helm-chart-dir)/


# Show SFTP credentials to access deployed project in Kubernetes cluster.
#
# Usage:
#	make helm.discover.sftp [cluster=(minikube|review|staging)]
#	                        [release=(dev|<current-git-branch>|<release-name>)]

base64-cmd = base64 $(strip \
	$(if $(call eq,$(shell echo "" | base64 -d &>/dev/null; echo $$?),0),-d,-D))

helm.discover.sftp:
	$(if $(call eq,$(shell kubectl $(kubectl-cluster-args) get service \
		$(helm-release) 1>/dev/null && echo "yes"),yes),,\
			$(error no '$(helm-release)' release is deployed))
	@echo 'host: $(shell kubectl $(kubectl-cluster-args) get ingress \
		-l "app.kubernetes.io/instance=$(helm-release)" \
		-o jsonpath="{.items[0].spec.rules[0].host}")'
	@echo 'port: $(shell kubectl $(kubectl-cluster-args) get services \
		-l "app.kubernetes.io/instance=$(helm-release),\
		    app.kubernetes.io/component=sftp" \
		-o jsonpath="{.items[0].spec.ports[0].nodePort}")'
	@echo 'user: $(shell kubectl $(kubectl-cluster-args) get secret \
		-l "app.kubernetes.io/instance=$(helm-release),\
		    app.kubernetes.io/component=sftp" \
		-o jsonpath="{.items[0].data.SFTP_USER}"|$(base64-cmd))'
	@echo 'pass: $(shell kubectl $(kubectl-cluster-args) get secret \
		-l "app.kubernetes.io/instance=$(helm-release),\
		    app.kubernetes.io/component=sftp" \
		-o jsonpath="{.items[0].data.SFTP_PASSWORD}"|$(base64-cmd))'


# Remove Helm release of project from Kubernetes cluster.
#
# Usage:
#	make helm.down [cluster=(minikube|review|staging)]
#	               [release=(dev|<current-git-branch-slug>|<release-name>)]
#	               [check=(no|yes)]

helm.down:
ifeq ($(helm-cluster),minikube)
ifneq ($(minikube-mount-pid),)
	kill $(minikube-mount-pid)
endif
endif
ifeq ($(check),yes)
	$(if $(shell helm $(helm-cluster-args) list | grep '$(helm-release)'),\
		helm $(helm-cluster-args) uninstall $(helm-release) ,\
		@echo "--> No $(helm-release) release found in $(helm-cluster) cluster")
else
	helm $(helm-cluster-args) uninstall $(helm-release)
endif


# Lint project Helm chart.
#
# Usage:
#	make helm.lint [chart=(frontend|medea)]

helm.lint:
	helm lint $(helm-chart-dir)/


# List all Helm releases in Kubernetes cluster.
#
# Usage:
#	make helm.list [cluster=(minikube|review|staging)]

helm.list:
	helm $(helm-cluster-args) list


# Run project in Kubernetes cluster as Helm release.
#
# Usage:
#	make helm.up [release=(dev|<current-git-branch-slug>|<release-name>)]
#	             [force=(no|yes)]
#	             [( [atomic=no] [wait=(yes|no)]
#	              | atomic=yes )]
#	             [( cluster=(minikube|review)
#	              	[( [rebuild=no]
#	              	 | rebuild=yes [debug=(yes|no)] [no-cache=(no|yes)] )]
#	              | cluster=staging )]

helm-up-review-app-domain = $(strip \
	$(call slugify,63,$(CURRENT_BRANCH)).front.soc.rev.t11913.org)

helm.up:
ifeq ($(wildcard my.$(helm-cluster).vals.yaml),)
	touch my.$(helm-cluster).vals.yaml
endif
ifeq ($(helm-cluster),minikube)
ifeq ($(rebuild),yes)
	@make docker.build no-cache=$(no-cache) minikube=yes TAG=dev
endif
ifeq ($(minikube-mount-pid),)
	minikube mount "$(PWD):/mount/social-frontend" &
endif
endif
ifeq ($(helm-cluster),review)
ifeq ($(rebuild),yes)
	@make docker.build IMAGE=review TAG=$(CURRENT_BRANCH) no-cache=$(no-cache)
	@make docker.push IMAGE=review TAGS=$(CURRENT_BRANCH)
endif
endif
	helm $(helm-cluster-args) upgrade --install \
		$(helm-release) $(helm-chart-dir)/ \
			--namespace=$(helm-release-namespace) \
			$(if $(call eq,$(CI_SERVER),yes),\
				--set labels.app=$(CI_ENVIRONMENT_SLUG) \
				--set labels."app\.gitlab\.com\/env"=$(CI_ENVIRONMENT_SLUG) \
				--set labels."app\.gitlab\.com\/app"=$(CI_PROJECT_PATH_SLUG) ,)\
			$(if $(call eq,$(helm-cluster),review),\
				--values=$(helm-chart-vals-dir)/staging.vals.yaml ,)\
			--values=$(helm-chart-vals-dir)/$(helm-cluster).vals.yaml \
			--values=my.$(helm-cluster).vals.yaml \
			$(if $(call eq,$(helm-cluster),review),\
				--set ingress.hosts={"$(helm-up-review-app-domain)"} \
				--set medea.conf.server.client.http.public_url="wss://$(helm-up-review-app-domain)/medea/ws" \
				--set medea.conf.turn.host="$(helm-up-review-app-domain)" \
				--set backend.medea.controlUrl="https://$(helm-up-review-app-domain)/medea-control-mock/control-api" \
				--set image.tag="$(CURRENT_BRANCH)" )\
			--set backend.image.tag=$(shell \
				grep 'COMPOSE_BACKEND_TAG=' .env | cut -d '=' -f2) \
			--set backend.cockroachdb.image.tag=$(shell \
				grep 'COMPOSE_BACKEND_TAG=' .env | cut -d '=' -f2) \
			--set deployment.revision=$(shell date +%s) \
			$(if $(call eq,$(force),yes),\
				--force,)\
			$(if $(call eq,$(atomic),yes),\
				--atomic,\
			$(if $(call eq,$(wait),no),,\
				--wait ))


# Bootstrap Minikube cluster (local Kubernetes) for development environment.
#
# The bootsrap script is updated automatically to the latest version every day.
# For manual update use 'update=yes' command option.
#
# Usage:
#	make minikube.boot [update=(no|yes)]
#	                   [driver=(virtualbox|hyperkit|hyperv)]
#	                   [k8s-version=<kubernetes-version>]

minikube.boot:
ifeq ($(update),yes)
	$(call minikube.boot.download)
else
ifeq ($(wildcard $(HOME)/.minikube/bootstrap.sh),)
	$(call minikube.boot.download)
else
ifneq ($(shell find $(HOME)/.minikube/bootstrap.sh -mmin +1440),)
	$(call minikube.boot.download)
endif
endif
endif
	@$(if $(cal eq,$(driver),),,MINIKUBE_VM_DRIVER=$(driver)) \
	 $(if $(cal eq,$(k8s-version),),,MINIKUBE_K8S_VER=$(k8s-version)) \
		$(HOME)/.minikube/bootstrap.sh
define minikube.boot.download
	$()
	@mkdir -p $(HOME)/.minikube/
	@rm -f $(HOME)/.minikube/bootstrap.sh
	curl -fL -o $(HOME)/.minikube/bootstrap.sh \
		https://raw.githubusercontent.com/instrumentisto/toolchain/master/minikube/bootstrap.sh
	@chmod +x $(HOME)/.minikube/bootstrap.sh
endef




######################
# Artifacts commands #
######################

# Prepares deployment of project artifacts.
#
# Usage:
#	make artifacts.deployment [dir=(public|<dir-path>)] [pull=(yes|no)]

artifacts-deployment-dir = $(if $(call eq,$(dir),),public,$(dir))

artifacts.deployment:
ifneq ($(pull),no)
	@make docker.pull TAGS=@all IMAGE=artifacts
endif
	@rm -rf $(artifacts-deployment-dir)
	@mkdir -p $(artifacts-deployment-dir)/helm/
	$(foreach tag,$(shell \
		docker images --format="{{.Tag}}" $(IMAGE_NAME)/artifacts),\
			$(call artifacts.deployment.unpack,$(tag)))
	helm repo index \
		--url=https://social.io.instrumentisto.com/frontend/helm \
		$(artifacts-deployment-dir)/helm/
define artifacts.deployment.unpack
	$(eval tag := $(strip $(1)))
	docker save -o $(artifacts-deployment-dir)/$(tag).tar \
		$(IMAGE_NAME)/artifacts:$(tag)
	@mkdir -p $(artifacts-deployment-dir)/$(tag)-tmp/
	tar -xf $(artifacts-deployment-dir)/$(tag).tar \
		-C $(artifacts-deployment-dir)/$(tag)-tmp/ \
		"$$(tar -tf $(artifacts-deployment-dir)/$(tag).tar | grep layer.tar)"
	@mkdir -p $(artifacts-deployment-dir)/$(tag)/
	tar -xf $(artifacts-deployment-dir)/$(tag)-tmp/*/layer.tar \
		-C $(artifacts-deployment-dir)/$(tag)/
	if [ -f $(artifacts-deployment-dir)/$(tag)/helm/*.tgz ]; then \
		mv -f $(artifacts-deployment-dir)/$(tag)/helm/*.tgz \
			$(artifacts-deployment-dir)/helm/ ;\
	fi
	rm -rf $(artifacts-deployment-dir)/$(tag).tar \
	       $(artifacts-deployment-dir)/$(tag)-tmp \
	       $(artifacts-deployment-dir)/$(tag)/helm
endef




###################
# GitLab commands #
###################

gitlab.check.api = $(call eq,$(shell \
	curl -X GET -w "%{http_code}" -o /dev/null -s \
	     -H "PRIVATE-TOKEN: $(gitlab-api-token)" \
		$(gitlab-api-url)$(strip $(1))),200)

# Release GitLab project version.
#
# Usage:
#	make gitlab.release token=<gitlab-api-token> [VERSION=<proj-version>]
#	     [api-url=(https://git.instrumentisto.com/api/v4|<gitlab-api-v4-url>)]
#	     [project-id=(27|<gitlab-project-id>)]
#	     [project-url=(https://git.instrumentisto.com/social/frontend|<gitlab-project-url>)]
#	     [pages-url=(https://social.io.instrumentisto.com/frontend|<gitlab-pages-url>)]

gitlab-api-url = $(strip $(if $(call eq,$(api-url),),\
	https://git.instrumentisto.com/api/v4,$(api-url)))
gitlab-api-token = $(token)
gitlab-proj-id = $(strip $(if $(call eq,$(project-id),),27,$(project-id)))
gitlab-proj-url = $(strip $(if $(call eq,$(project-url),),\
	https://git.instrumentisto.com/social/frontend,$(project-url)))
gitlab-pages-url = $(strip $(if $(call eq,$(pages-url),),\
	https://social.io.instrumentisto.com/frontend,$(pages-url)))

gitlab.release:
	$(if $(call gitlab.check.api,/projects/$(gitlab-proj-id)),,\
		$(error API token is invalid))
	$(if $(call gitlab.check.api,/projects/$(gitlab-proj-id)/releases/v$(VERSION)),\
		$(call gitlab.release.delete,$(VERSION)),)
	$(call gitlab.release.create,$(VERSION),$(strip \
		[Changelog]($(gitlab-proj-url)/blob/v$(VERSION)/CHANGELOG.md#$(shell \
			sed -n '/^## \[$(VERSION)\]/{\
				s/^## \[\(.*\)\][^0-9]*\([0-9].*\)/\1-\2/;\
				s/[^0-9a-z-]*//g;\
				p;\
			}' CHANGELOG.md)) | \
		[Milestone]($(gitlab-proj-url)/milestones/$(shell \
			sed -n '/^## \[$(VERSION)\]/,/Milestone/{\
				s/.*milestones.\([0-9]*\).*/\1/p;\
			}' CHANGELOG.md)/) | \
		[Repository]($(gitlab-proj-url)/tree/v$(VERSION))))
	$(call gitlab.release.link,$(VERSION),TypeScript docs,\
		$(gitlab-pages-url)/v$(VERSION)/docs/ts)
define gitlab.release.create
	@curl -X POST -o /dev/null -s -f \
	      -H "PRIVATE-TOKEN: $(gitlab-api-token)" \
		$(gitlab-api-url)/projects/$(gitlab-proj-id)/releases \
			--data "name=$(1)" \
			--data "tag_name=v$(1)" \
			--data "milestones[]=$(1)" \
			--data "description=$(2)"
	@echo "Release $(1) created"
endef
define gitlab.release.delete
	@curl -X DELETE -o /dev/null -s -f \
	      -H "PRIVATE-TOKEN: $(gitlab-api-token)" \
		$(gitlab-api-url)/projects/$(gitlab-proj-id)/releases/v$(1)
	@echo "Release $(1) removed"
endef
define gitlab.release.link
	@curl -X POST -o /dev/null -s -f \
	      -H "PRIVATE-TOKEN: $(gitlab-api-token)" \
		$(gitlab-api-url)/projects/$(gitlab-proj-id)/releases/v$(1)/assets/links \
			--data "name=$(2)" \
			--data "url=$(3)"
	@echo "Asset link '$(2)' created for release $(1)"
endef




################
# Git commands #
################

# Release project version (merge to release branch and apply version tag).
#
# Usage:
#	make git.release [VERSION=<proj-ver>]

git.release:
ifneq ($(CURRENT_BRANCH),$(MAINLINE_BRANCH))
	@echo "--> Current branch is not '$(MAINLINE_BRANCH)'" && false
endif
	git fetch origin --tags $(RELEASE_BRANCH):$(RELEASE_BRANCH)
ifeq ($(shell git rev-parse v$(VERSION) >/dev/null 2>&1 && echo "ok"),ok)
	@echo "--> Tag v$(VERSION) already exists" && false
endif
	git fetch . $(MAINLINE_BRANCH):$(RELEASE_BRANCH)
	git tag v$(VERSION) $(RELEASE_BRANCH)
	git push origin $(RELEASE_BRANCH)
	git push --tags origin $(RELEASE_BRANCH)


# Squash changes of the current Git branch onto another Git branch.
#
# WARNING: You must merge `onto` branch in the current branch before squash!
#
# Usage:
#	make git.squash [onto=($(MAINLINE_BRANCH)|<git-branch>)]
#	                [del=(no|yes)]
#	                [upstream=(origin|<git-remote>)]

onto ?= $(MAINLINE_BRANCH)
upstream ?= origin

git.squash:
ifeq ($(CURRENT_BRANCH),$(onto))
	@echo "--> Current branch is '$(onto)' already" && false
endif
	git checkout $(onto)
	git branch -m $(CURRENT_BRANCH) orig-$(CURRENT_BRANCH)
	git checkout -b $(CURRENT_BRANCH)
	git branch --set-upstream-to $(upstream)/$(CURRENT_BRANCH)
	git merge --squash orig-$(CURRENT_BRANCH)
ifeq ($(del),yes)
	git branch -d orig-$(CURRENT_BRANCH)
endif




##################
# .PHONY section #
##################

.PHONY: build deps docs down fmt lint squash test up serve \
        cargo cargo.fmt \
        docker.auth docker.build docker.down docker.pull docker.push \
        	docker.tag docker.tar docker.test docker.untar docker.up \
        docs.ts \
        git.release git.squash \
        gitlab.release \
        helm helm.build helm.dep helm.down helm.lint helm.list helm.up \
        	helm.discover.sftp \
        minikube.boot \
        sync.backend \
        test.docker test.e2e test.unit.ts \
        yarn yarn.build yarn.serve yarn.lint yarn.write.hash
