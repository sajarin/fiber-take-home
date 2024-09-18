.PHONY: clean install run

# Define directories
TMP_DIR = tmp
OUT_DIR = out

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
	rm -rf $(TMP_DIR) $(OUT_DIR)