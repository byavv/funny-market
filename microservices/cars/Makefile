MAKEFLAGS = -j1
REPORTER = spec
MSNAME = cars
TESTS = test/*.spec.js
BIN = node_modules/.bin

QMAKE_CLEAN = ./coverage ./tmp/* ./build/*
ISTANBUL_CMD = istanbul
MOCHA_CMD = node_modules/mocha/bin/_mocha

.PHONY: test test-cov

test:
	@NODE_ENV=test \
	node $(MOCHA_CMD) test \
	$(TESTS)
	
test-cov:
	@NODE_ENV=test \
	$(ISTANBUL_CMD) cover $(MOCHA_CMD) -- -R $(REPORTER) \
	$(TESTS)	
	
clean: 
	rm -rf $(QMAKE_CLEAN)
		
run: 
	node .

dev: 	
	@DEBUG=${MSNAME} \
	node .
