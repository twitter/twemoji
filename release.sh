#!/bin/bash 

root=$(
  cd $(dirname $0)
  /bin/pwd
)

dir=$1
out=/tmp/school.$$

trap "rm -fr $out" 0 1 2

git clone $root/.git $out
cd $out
git remote set-url origin git@github.com:twitter/scala_school.git
git fetch
git checkout gh-pages
cd $root
cp -r $dir/* $out/
cd $out
git add .
git commit -am"publish by $USER"
git push origin gh-pages
