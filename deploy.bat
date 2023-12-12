@echo off
SET /P COMMITMESSAGE="Enter commit message: "
git add .
git commit -m "%COMMITMESSAGE%"
git push origin master
echo Changes pushed to GitHub.
pause
