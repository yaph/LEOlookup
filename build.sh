#!/bin/sh
rm -rf /tmp/LEOlookup
cp -R LEOlookup /tmp
find /tmp/LEOlookup -name '*.git' -exec rm -f {} \;
find /tmp/LEOlookup -name '*-example.*' -exec rm -f {} \;
cd /tmp
zip -rv LEOlookup.zip LEOlookup
rm -rf /tmp/LEOlookup
