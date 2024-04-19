# -*- MakeFile -*-
.PHONY: clean update all
.DEFAULT_GOAL := all

clean: 
	rm -f js/*

JSON_FILES := $(wildcard json/*.json)
JS_FILES := $(patsubst json/%.json,js/%.js,$(JSON_FILES))

js/%.js: json/%.json
	wget $(<:json/%=https://okeanija.draugiem.lv/flash/%) -O $<
	deno fmt $<
	echo "export default" | cat /dev/stdin - $< > $@

all: $(JS_FILES)
	@echo $@

update: clean all
