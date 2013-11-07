#!/bin/bash

l=`ls -d -l  */ | awk '{print "<a href=\"" $9 "\">" $9 "</a>"}'`

echo "<!DOCTYPE html><html lang="en"> <head> <meta charset="UTF-8" /> <title></title> </head> <body> <pre><code>$l</code></pre></body></html>" > index.html
