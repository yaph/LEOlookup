#!/bin/sh
zip -r LEOlookup.zip LEOlookup
mv LEOlookup.zip /tmp/
rm -rf /tmp/LEOlookup
unzip /tmp/LEOlookup.zip -d /tmp
