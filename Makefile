build: 
	bundle exec jekyll build

run: 
	bundle exec jekyll serve

rebuild-index:
	cd indexer && npm install && node index.js