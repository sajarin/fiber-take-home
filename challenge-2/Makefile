.PHONY: clean install run

# Define directories
OUT_DIR = out
CHEERIO_STORAGE_DIR = storage

# Default target
default: run

# Install dependencies
install:
	npm install

# Run the script
run: install
	tsx runner.ts

# Clean up generated directories
clean:
	rm -rf $(CHEERIO_STORAGE_DIR) $(OUT_DIR)