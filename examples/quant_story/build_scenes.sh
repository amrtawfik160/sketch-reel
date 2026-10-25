#!/bin/bash
# assemble scenes.js from the sources: header, generated captions, toolkit, story
cd "$(dirname "$0")" && cat src/head4.js caps_gen.js src/toolkit.js src/story4.js > scenes.js
