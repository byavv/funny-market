SRCDIR = .
REPORTER = spec
MSNAME = proxy
TESTS = test/*.spec.js
BIN = node_modules/.bin
SERVER_FLAGS ?= 
QMAKE_CLEAN = ./coverage ./tmp/* ./build/*
ISTANBUL_CMD = istanbul
MOCHA_CMD = node_modules/mocha/bin/_mocha

.PHONY: test test-cov clean run dev debug run-prod 

test:
	@DEBUG=test 
	@NODE_ENV=test \
	node $(MOCHA_CMD) test \
	$(TESTS)
	
test-cov:
	@DEBUG=test 
	@NODE_ENV=test \
	$(ISTANBUL_CMD) cover $(MOCHA_CMD) -- -R $(REPORTER) \
	$(TESTS)	
	
clean:
	@echo "Cleaning..." 
	rm -rf $(QMAKE_CLEAN)

dev: 
	nodemon $(SRCDIR)

debug: 	
	@DEBUG=${MSNAME} \	
	node-debug $(SRCDIR)

start:
	@NODE_ENV=production \
	node $(SRCDIR) $(SERVER_FLAGS)

build:
	docker build -t $(MSNAME) $(SRCDIR)

remove: 	
	@echo "Removing previous container $(MSNAME)" 
	docker rm -f $(MSNAME)

help:
	@echo "-------------------------------------------------------------------------"
	@echo "-                        Available commands                             -"
	@echo "-------------------------------------------------------------------------"
	@echo ""
	@echo "  make dev          Run server in development mode"
	@echo ""
	@echo "  make debug        Runs $(MSNAME) server via node-debug"
	@echo "                    See: https://github.com/node-inspector/node-inspector"
	@echo "                     "
	@echo "  make start/stop   Starts/stops server in production mode"
	@echo "                    See: http://strong-pm.io/"
	@echo "                     "
	@echo "  make clean        Clean temp folders"
	@echo "                     "
	@echo "  make test         Starts tests"
	@echo ""
	@echo "  make test-cov     Starts tests with coverage"
	@echo ""
	@echo "  make build        Build Docker container"
	@echo ""
	@echo "  make remove       Remove Docker container"
	@echo ""
	@echo "-------------------------------------------------------------------------"