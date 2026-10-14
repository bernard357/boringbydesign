.PHONY: help setup serve build preview clean

DIST := documentation/.vitepress/dist
CACHE := documentation/.vitepress/cache

help:
	@echo "Targets:"
	@echo "  setup    Install dependencies (npm ci)"
	@echo "  serve    Start the dev server with hot reload (localhost:5173)"
	@echo "  build    Build the static site into $(DIST)"
	@echo "  preview  Serve the built site locally for a production check"
	@echo "  clean    Remove the built site and the VitePress cache"

setup:
	npm ci

serve:
	npm run dev

build:
	npm run build

preview:
	npm run preview

clean:
	rm -rf $(DIST) $(CACHE)
