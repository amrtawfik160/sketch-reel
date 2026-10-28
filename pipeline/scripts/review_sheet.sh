#!/bin/bash
# Dense review sheets for a rendered reel: one timestamped frame every 0.5 s, 6x2 per sheet.
# usage: review_sheet.sh <video.mp4> <outdir>   -> <outdir>/sheet_01.png, sheet_02.png, ...
set -eu
mkdir -p "$2"
rm -f "$2"/sheet_*.png
ffmpeg -v error -i "$1" -vf "fps=2,scale=360:640,drawtext=text='%{pts\:hms}':x=8:y=8:fontsize=22:fontcolor=yellow:box=1:boxcolor=black@0.6,tile=6x2" "$2/sheet_%02d.png"
ls "$2"/sheet_*.png
