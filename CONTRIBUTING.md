Rules

    Don't create a pull request on an issue that doesn't exist, create an issue first and if the changes you are proposing are said to be okay, you can go ahead and create a pull request

    Don't work on anything unless you are assigned, if you make a pull request without being assigned to that issue, it will be closed without being merged

    Don't work on more than one issue at a time, this is so that you don't make a huge pull request and others can have opportunities to work on another issue while you work on something else

    Do read the readme.md file

    Add the Issue you worked on in your Pull Request

    Fill out issue and pull request(PR) templates properly, if you don't know how, check out previous issues/PR to know how they are filled or this video👇🏾


Pull Request Template
👩🏽‍💻 Prerequisite Skills to Contribute
Contribute in project

    Node.js
    TypeScript

How to Contribute

    Take a look at the existing Issues or create a new issue!
    Fork the Repo. Then, create a branch for any issue that you are working on. Finally, commit your work.
    Create a Pull Request (PR), which will be promptly reviewed and given suggestions for improvements by the community.
    Add screenshots or screen captures to your Pull Request to help us understand the effects of the changes proposed in your PR.

HOW TO MAKE A PULL REQUEST:

    Start by making a Fork of the Code-Magic repository. Click on the Fork symbol at the top right corner.

    Clone your new fork of the repository in the terminal/CLI on your computer with the following command:

git clone https://github.com/<your-github-username>/clann

    Navigate to the newly created Code-Magic project directory:

cd clann

    Set upstream command:

git remote add upstream https://github.com/jeoffreyduke/clann.git

    Create a new branch:

git checkout -b YourBranchName

    Sync your fork or your local repository with the origin repository:

    In your forked repository, click on "Fetch upstream"
    Click "Fetch and merge"

Alternatively, Git CLI way to Sync forked repository with origin repository:

git fetch upstream

git merge upstream/main

Github Docs for Syncing

    Make your changes to the source code.

    Stage your changes and commit:

Make sure not to commit package.json or package-lock.json file

git cz

    Push your local commits to the remote repository:

git push origin YourBranchName

    Create a Pull Request!

    Congratulations! You've made your first contribution to Code-Magic!

After this, the maintainers will review the PR and will merge it if it helps move the Code-Magic project forward. Otherwise, it will be given constructive feedback and suggestions for the changes needed to add the PR to the codebase.
    
Issues
In order to discuss changes, you are welcome to open an issue about what you would like to contribute. Enhancements are always encouraged and appreciated.
