for d in assets/*.ai; do
  svg=$(echo "$d" | sed 's/.ai/.svg/')
  echo "creating $svg ..."
  inkscape -f "$d" -l "$svg"
done
mkdir -p svg
mv assets/*.svg svg/
