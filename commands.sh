PRIVATE=./private.key
PUBLIC=./public.key
STORAGE=./storage

if [ -e "$PUBLIC" && -e "$PRIVATE" ]; then
  echo "file exists"
else
  echo "Generate key pairs"
  node key-generator.js
fi

if [ -d "$STORAGE" ]; then
  echo "storage exists"
else
  echo "Make storage dir"
  mkdir storage
fi