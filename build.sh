#!/bin/bash
npm install;
npm run clean;
npm run build;

for file in dist/**/*/*.{js,css,svg}
do
  bro --input "$file" --output "$file".br
done

