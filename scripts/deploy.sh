#!/bin/bash
set -euxo pipefail

ROOT=$(
  cd $(dirname $0)/..
  /bin/pwd
)
DIST="$ROOT/dist/"
PUBLISH_BRANCH=$1
VERSION=$(cat package.json | jq -r .version)

git fetch --all
git stash

git checkout $PUBLISH_BRANCH
git pull origin $PUBLISH_BRANCH

pushd "v/"
# If the folder already exists we want to repalce it
if [ -d $VERSION ]; then
  rm -r $VERSION
fi

cp -r $DIST $VERSION
git add $VERSION

if [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  rm latest
  ln -s $VERSION latest
  git add latest
fi

git diff-index --quiet HEAD || git commit -q -m "Publish v$VERSION"
git push origin $PUBLISH_BRANCH
popd

git checkout -

git stash apply
