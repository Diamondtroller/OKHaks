# -*- MakeFile -*-
.PHONY: clean update all
.DEFAULT_GOAL := all

JSON_FILES := $(wildcard static/data/*.json)

clean: 
	rm -f static/data/*

static/data/%.json:
	wget $(@:static/data/%=https://okeanija.draugiem.lv/flash/%) -O $@

all: $(JSON_FILES)
	@echo $@

update: clean all
