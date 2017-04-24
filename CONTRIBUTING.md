<!-- These contributing guidelines are shamelessly inspired/copied from https://github.com/jhipster/generator-jhipster  -->

# Contributing to JHipster-db-helper

Are you ready to contribute to JHipster-db-helper? We'd love to have you on board, and we will help you as much as we can.
Here are the guidelines we'd like you to follow so that we can be of more help:

 - [Issues and Bugs](#issue)
 - [Feature Requests](#feature)
 - [Submission Guidelines](#submit)
 - [Generator development setup](#setup)
 - [Coding Rules](#rules)
 - [Git Commit Guidelines](#commit)

## <a name="issue"></a> Issues and Bugs
If you find a bug in the source code or a mistake in the documentation, you can help us by submitting a ticket to our [GitHub issues](https://github.com/bastienmichaux/generator-jhipster-db-helper/issues).
Even better, you can submit a Pull Request to our [JHipster module project](https://github.com/bastienmichaux/generator-jhipster-db-helper/pulls).

**Please see the Submission Guidelines below**.

## <a name="feature"></a> Feature Requests
You can request a new feature by submitting a ticket to our [GitHub issues](https://github.com/bastienmichaux/generator-jhipster-db-helper/issues).
If you would like to implement a new feature then consider what kind of change it is:

* **Major Changes** that you wish to contribute to the project should be discussed first. Please open a ticket which clearly states that it is a feature request in the title and explains clearly what you want to achieve in the description, and the jhipster-db-helper team will discuss with you what should be done in that ticket. You can then start working on a Pull Request.
* **Small Changes** can be proposed without any discussion. Open up a ticket which clearly states that it is a feature request in the title. Explain your change in the description, and you can propose a Pull Request straight away.

## <a name="submit"></a> Submission Guidelines

### Submitting an Issue
Before you submit your issue search [the archive](https://github.com/bastienmichaux/generator-jhipster-db-helper/issues?utf8=%E2%9C%93&q=is%3Aissue), maybe your question was already answered.

If your issue appears to be a bug, and has not been reported, open a new issue.
Help us to maximize the effort we can spend fixing issues and adding new features, by not reporting duplicate issues.
Correctly following the issue template will increase the chances of your issue beind dealt with quickly !

Click [here](https://github.com/bastienmichaux/generator-jhipster-db-helper/issues/new) to open a bug issue with a pre-filled template.

### Submitting a Pull Request
Before you submit your pull request consider the following guidelines:

* Search [GitHub](https://github.com/bastienmichaux/generator-jhipster-db-helper/pulls?utf8=%E2%9C%93&q=is%3Apr) for an open or closed Pull Request
  that relates to your submission.
* Make your changes in a new git branch

     ```shell
     git checkout -b my-fix-branch master
     ```

* Create your patch, **including appropriate test cases**.
* Follow our [Coding Rules](#rules).
* Generate a new JHipster project, and ensure that all tests pass

     ```shell
     mvn package -Pprod
     ```

* Test that the new project runs correctly:

     ```shell
     mvn spring-boot:run
     ```
<!-- * You can also run our travis build locally by following [this](#local-travis-build) -->

* Commit your changes using a descriptive commit message that follows our
  [commit message conventions](#commit-message-format).

     ```shell
     git commit -a
     ```

  Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

* Push your branch to GitHub:

    ```shell
    git push origin my-fix-branch
    ```

* In GitHub, send a pull request to `jhipster/generator-jhipster:master`.
* If we suggest changes then
  * Make the required updates.
  * Re-run the JHipster tests on your sample generated project to ensure tests are still passing.
  * Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

    ```shell
    git rebase master -i
    git push -f
    ```

That's it! Thank you for your contribution!

#### Resolving merge conflicts ("This branch has conflicts that must be resolved")

Sometimes your PR will have merge conflicts with the upstream repository's master branch. There are several ways to solve this but if not done correctly this can end up as a true nightmare. So here is one method that works quite well.

* First, fetch the latest information from the master

    ```shell
    git fetch upstream
    ```

* Rebase your branch against the upstream/master

    ```shell
    git rebase upstream/master
    ```

* Git will stop rebasing at the first merge conflict and indicate which file is in conflict. Edit the file, resolve the conflict then

    ```shell
    git add <the file that was in conflict>
    git rebase --continue
    ```

* The rebase will continue up to the next conflict. Repeat the previous step until all files are merged and the rebase ends successfully.
* Re-run the JHipster tests on your sample generated project to ensure tests are still passing.
* Force push to your GitHub repository (this will update your Pull Request)

    ```shell
    git push -f
    ```

#### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes
from the main (upstream) repository:

* Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

    ```shell
    git push origin --delete my-fix-branch
    ```

* Check out the master branch:

    ```shell
    git checkout master -f
    ```

* Delete the local branch:

    ```shell
    git branch -D my-fix-branch
    ```

* Update your master with the latest upstream version:

    ```shell
    git pull --ff upstream master
    ```

## <a name="setup"></a> Generator development setup
JHipster and its modules are [Yeoman Generators](http://yeoman.io/), so you must follow the [Yeoman authoring documentation](http://yeoman.io/authoring/) in order to be able to run and test your changes.

Here are the most important steps.

### Fork the generator-jhipster-db-helper project

Go to the [generator-jhipster project](https://github.com/bastienmichaux/generator-jhipster-db-helper) and click on the "fork" button. You can then clone your own fork of the project, and start working on it.

[Please read the Github forking documentation for more information](https://help.github.com/articles/fork-a-repo)

### Set NPM/YARN to use the cloned project

To put it in a nutshell, you need to:

1. run `npm link` or `yarn link` on the `generator-jhipster-db-helper` project
1. run `npm link generator-jhipster-db-helper` or `yarn link generator-jhipster-db-helper` on the generated application folder (you need to do this for each application you create)

In your cloned `generator-jhipster-db-helper` project, type `npm link` or `yarn link` depending on the package manager you use.

This will do a symbolic link from the global `node_modules` version to point to this folder, so when we run `yo jhipster-db-helper`, you will now use the development version of JHipster.

For testing, you will want to generate an application, and there is a specific issue here: for each application, JHipster installs a local version of itself. This is made to enable several applications to each use a specific JHipster version (application A uses JHipster 3.1.0, and application B uses JHipster 3.2.0).

To overcome this you need to run `npm link generator-jhipster-db-helper` or `yarn link generator-jhipster-db-helper` on the generated project folder as well, so that the local version has a symbolic link to the development version of JHipster.

Now, running the 'yo jhipster-db-helper' command should use your specific JHipster-db-helper version. You can test it by making a small change in your cloned generator, and running again on an existing JHipster project:

```shell
yo jhipster-db-helper
```

You should see your changes reflected in the generated project.

<!-- ## Local Travis Build -->

<!-- You can run the travis builds locally by following below commands -->

<!-- CD into the travis folder `cd travis` from the generator source code root folder -->

<!-- Run `./build-samples.sh [command_name] [sample_name:optional]` -->

<!-- Sample name is optional and can be any of the folder name in the `travis/samples` folder. If not specified the it will mean all samples -->

<!-- Command name can be as below -->

    <!-- `generate`: Generate the sample if specified else generate all samples -->
    <!-- `build` : Generate and test the sample if specified else generate and test all samples -->
    <!-- `clean` : Clean the generated code for the sample if specified else clean all samples -->

## <a name="rules"></a> Coding Rules
To ensure consistency throughout the source code, keep these rules in mind as you are working:

* All features or bug fixes **must be tested** by one or more tests.
* All files must follow the [.editorconfig file](http://editorconfig.org/) located at the root of the JHipster generator project. Please note that generated projects use the same `.editorconfig` file, so that both the generator and the generated projects share the same configuration.
* Java files **must be** formatted using [Intellij IDEA's code style](http://confluence.jetbrains.com/display/IntelliJIDEA/Code+Style+and+Formatting). Please note that JHipster committers have a free Intellij IDEA Ultimate Edition for developing the project.
* Generators JavaScript files **must follow** the eslint configuration defined at the project root, which is based on [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).
<!-- * Web apps JavaScript files **must follow** [Google's JavaScript Style Guide](https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml). -->
<!-- * AngularJS files **must follow** [John Papa's Angular 1 style guide] (https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md). -->
<!-- * Angular 2+ Typescript files **must follow** [Official Angular style guide] (https://angular.io/styleguide). -->

Please ensure to run `npm run lint` and `npm test` on the project root before submitting a pull request. You can also run `npm run lint-fix` to fix some of the lint issues automatically.

<!-- ## <a name="templates"></a> Template Guidelines -->

<!-- The template engine used by yeoman is [EJS](http://ejs.co/), its syntax is fairly simple. -->
<!-- For simple code (few lines), logic can be embedded in the main file but if logic becomes more complex it's better to externalise the JS fragment to a sub template included by the first one and located in same folder. -->

<!-- Sub templates should be named with the `ejs` extension because it's the default one, it enables editors to apply correct syntax highlighting and it enables us to use a very concise syntax: -->

    <!-- <%- include('field_validators'); -%> -->

<!-- This statement means that [_Entity.java](generators/entity/templates/src/main/java/package/domain/_Entity.java) template includes [field_validators.ejs](generators/entity/templates/src/main/java/package/domain/field_validators.ejs) sub template. -->

<!-- Sub templates can be unit tested. -->

## <a name="commit"></a> Git Commit Guidelines

We have rules over how our git commit messages must be formatted. Please ensure to [squash](https://help.github.com/articles/about-git-rebase/#commands-available-while-rebasing) unnecessary commits so that your commit history is clean.

### <a name="commit-message-format"></a> Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**.

```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on Github as well as in various git tools.

### Header
The Header contains a succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Body
If your change is simple, the Body is optional.

Just as in the Header, use the imperative, present tense: "change" not "changed" nor "changes".
The Body should include the motivation for the change and contrast this with previous behavior.

### Footer
The footer is the place to reference GitHub issues that this commit **Closes**.

You **must** use the [Github keywords](https://help.github.com/articles/closing-issues-via-commit-messages) for
automatically closing the issues referenced in your commit.

### Example
For example, here is a good commit message:

```
upgrade to Spring Boot 1.1.7

upgrade the Maven and Gradle builds to use the new Spring Boot 1.1.7,
see http://spring.io/blog/2014/09/26/spring-boot-1-1-7-released

Fix #1234
```
