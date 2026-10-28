#!/bin/bash
# scenes.js = header + generated captions + toolkit + story (framework head + stations + boil clock / camera tail)
cd "$(dirname "$0")" && cat src_build/story_head.part src_build/story_body.js src_build/story_tail.part > src_build/story.js && cat src_build/head.js caps_gen.js src_build/toolkit.js src_build/story.js > scenes.js
