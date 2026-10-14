.PHONY: help setup posts serve build preview clean

DIST := documentation/.vitepress/dist
CACHE := documentation/.vitepress/cache
POSTS := documentation/public/posts.json

help:
	@echo "Targets:"
	@echo "  setup    Install dependencies (npm ci)"
	@echo "  posts    Build the blog index ($(POSTS)) from post frontmatter"
	@echo "  serve    Start the dev server with hot reload (localhost:5173)"
	@echo "  build    Build the static site into $(DIST)"
	@echo "  preview  Serve the built site locally for a production check"
	@echo "  clean    Remove the built site, cache, and generated post index"

setup:
	npm ci

posts:
	python3 scripts/build_posts.py

serve: posts
	npm run dev

build: posts
	npm run build

preview:
	npm run preview

clean:
	rm -rf $(DIST) $(CACHE) $(POSTS)
