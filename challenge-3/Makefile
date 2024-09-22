# Minimum Node version required
MIN_NODE_VERSION := 18

check-node-version:
	@node -v | awk -v min=$(MIN_NODE_VERSION) -F. '$$1 >= "v"min { exit 0 } { exit 1 }' || \
	(echo "Node.js version must be $(MIN_NODE_VERSION) or greater."; exit 1)

clean:
	rm -rf node_modules

install: clean
	npm install

build: 
	npm run build

lint: 
	npm run lint

type-check: 
	npx tsc

dev: 
	npm run dev

validate: build lint type-check

test: check-node-version install validate dev