DIR="$PWD/build/"
if [ -d "$DIR" ]; then
  echo "Found a build folder. Deleting..."
  rm -r $DIR && yarn dev
else
 yarn dev 
fi
