
DATETIME=$(shell date)

build:
	conda  env create --file tmfarrell-github-io.conda_env.yml

update-resume:
	python3 scripts/download_resume.py
	git add Tim_Farrell_Resume.pdf
	git commit -m "updated resume: $(DATETIME)"
	git push