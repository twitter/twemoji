#!/usr/bin/env bash

if [ ! -f "$1" ] || [ "$2" = "" ]; then
  echo '
usage example:
  ./esm.sh ./path/module.js modname

will append:
  export default modname;

at the end of:
  ./path/esm.js
'
else
  cp "$1" "$(dirname "$1")/esm.js"
echo "
export default $2;
" >> "$(dirname "$1")/esm.js"
echo "
exported $2 as default
"
fi
