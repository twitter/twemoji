#!/bin/bash 

ROOT=$(
  cd $(dirname $0)/..
  /bin/pwd
)
OUT="$ROOT/dist/"
PUBLISH_BRANCH=$1
# For this to work, the version specification must be on the second line of package.json
VERSION=$(cat "$ROOT/package.json" | sed '2!d' | egrep -o '[0-9]+\.[0-9]+\.[0-9]+')

git fetch --all
git add -f $OUT
git checkout $PUBLISH_BRANCH
git pull origin $PUBLISH_BRANCH
if [ -d $VERSION ]; then
  rm -r $VERSION
fi
git mv -f $OUT $VERSION
git commit -q -m "Update the Twemoji project and push to $PUBLISH_BRANCH"
git push origin $PUBLISH_BRANCH
# Return to your working branch
git checkout -