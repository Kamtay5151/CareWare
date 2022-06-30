# CareWare
How to setup dev environment:

Install git for windows - https://gitforwindows.org/
  - after install, open cmd
    - run (substituting your information):
    - git config --global user.email 'username@email.com"
    - git config --global user.name 'My Name'
  - close cmd
  
Install nodejs LTS 16.15.1 - https://nodejs.org/en/download/
  - this is a next/next/finish install, just keep the defaults

Install vscode
  - select the source control button on the left
  - clone repository
  - paste: https://github.com/CornHead764/CareWare.git into the url box
  - select a folder to save it (documents or something)
  - click open in the bottom right
  - select yes, I trust the authors

On the top bar, select the terminal menu, followed by new terminal (if one isn't already open)
  - make sure the current directory is where the git folder is saved (last part should be \CareWare>)
    - if not, cd to where you saved the git repo in the earlier step
  - run: npm install

After modifying a file (or multiple)
  - go to the source control page
  - click the three dots, then pull. This forcefully pulls down any changes made by others currently on github
  - click the plus button next to any changes you want to commit (or do all)
  - enter a commit message (like: "add home page" or "fix login bug", don't use past tense)
  - press the check mark to commit (this commits your changes locally to git, you will still need to push these up to github for others to see them)
  - press the sync button
  - If this is your first commit/push:
    - a github sign in box appears
    - sign in using your browser
    - after signing in, close the browser
    - click yes on the pop up in the corner "would you like code to periodically run git fetch"
	
To run the web server, in terminal, run: npm start
  - first run may ask if you want to allow it through the firewall, hit allow access.
  - open a web browser, and navigate to 127.0.0.1:3000
  - some changes require you restart the web server, so keep that in mind when modifying files
