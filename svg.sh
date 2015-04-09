createsvg() {
  local d
  local svg
  for d in assets/*.ai; do
    svg=$(echo "$d" | sed 's/.ai/.svg/')
    echo "creating $svg ..."
    inkscape -f "$d" -l "$svg"
  done
  mkdir -p svg
  mv assets/*.svg svg/
}

viewport() {
  local f
  for f in svg/*.svg; do
    content=$(
      cat "$f" |
      sed 's/<!-- Created with Inkscape (http:\/\/inkscape.org\/) -->//' |
      sed 's/viewBox="0 0 47.5 47.5"//' |
      sed 's/height="47.5"/viewBox="0 0 47.5 47.5"/' |
      sed 's/width="47.5"/style="enable-background:new 0 0 47.5 47.5;"/' |
      sed -e ':a' -e 'N' -e '$!ba' -e 's/\n//g' |
      sed -e 's/  */ /g' |
      sed -e 's/ \/>/\/>/g'
    )
    echo "$f"
    echo "$content" >"$f"
    
  done
}

createsvg

viewport