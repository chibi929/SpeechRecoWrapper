#!/bin/bash

mkdir deploy
cp -r dist deploy
cp -r index.html deploy
echo "<?php ?>" > deploy/main.php
cd deploy
bx app push speech-reco
