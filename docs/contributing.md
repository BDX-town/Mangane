# Contributing to Soapbox

When contributing to Soapbox, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

## Project Contribution Flow

It is recommended that you use the following guidelines to contribute to the Soapbox project:

* Understand recommended [GitLab Flow](https://www.youtube.com/watch?v=InKNIvky2KE) methods on branch management
* Use the following branch management process:
    * Pull a fork
    * Mirror the fork against the original repository, setting the mirror to only mirror to protected branches
    * Set the master branch in your fork to Protected
    * Never modify the master branch in your fork, so that your fork mirroring does not break
    * Pull branches in your fork to solve specific issues
    * Do merge requests only to the original repository master branch, so that your fork mirroring does not break
* If you don't use the above policy, when your mirrored fork breaks mirroring, you can force your fork to back to successful mirroring using the following process:
    * Unprotect the master branch of your fork from force push
    * Use the following git commands from the cmd line of your local copy of your fork's master branch
    ```
    git remote add upstream /url/to/original/repo
    git fetch upstream
    git checkout master
    git reset --hard upstream/master  
    git push origin master --force
    ```
    * Re-protect the master branch of your fork from force push    

Please note we have a code of conduct, please follow it in all your interactions with the project.

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a
   build.
2. Update the README.md with details of changes to the interface, this includes new environment
   variables, exposed ports, useful file locations and container parameters.
3. Increase the version numbers in any examples files and the README.md to the new version that this
   Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4. You may merge the Pull Request in once you have the sign-off of two other developers, or if you
   do not have permission to do that, you may request the second reviewer to merge it for you.
