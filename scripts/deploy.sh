#!/bin/bash

ROOT=$(
  cd $(dirname $0)/..
  /bin/pwd
)
DIST="$ROOT/dist/"
PUBLISH_BRANCH=$1
VERSION=$(cat package.json | jq -r .version)

git fetch --all
git checkout $PUBLISH_BRANCH
git pull origin $PUBLISH_BRANCH
cd "v/"
# If the folder already exists we want to repalce it
if [ -d $VERSION ]; then
  rm -r $VERSION
fi
# Create new version folder out of dist/
mv -f $DIST $VERSION
git add $VERSION
git commit -q -m "Publish v$VERSION"
git push origin $PUBLISH_BRANCH
# Return to your working branch
git checkout -
cd $ROOT