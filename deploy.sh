#!/bin/bash

# Ask for a commit message
read -p "Enter commit message: " COMMITMESSAGE

# Git commands
git add .
git commit -m "$COMMITMESSAGE"
git push origin master

echo "Changes pushed to GitHub."
