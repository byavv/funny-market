MAKEFLAGS = -j1
REPORTER = spec
MSNAME = proxy
TESTS = test/*.spec.js
BIN = node_modules/.bin
SERVER_FLAGS ?= 
QMAKE_CLEAN = ./coverage ./tmp/* ./build/*
ISTANBUL_CMD = istanbul
MOCHA_CMD = node_modules/mocha/bin/_mocha

.PHONY: test test-cov clean run dev debug

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
		
run: 
	node . $(SERVER_FLAGS)

dev: 	
	@DEBUG=${MSNAME} \
	node . $(SERVER_FLAGS)

debug: 	
	@DEBUG=${MSNAME} \	
	node-debug .
	