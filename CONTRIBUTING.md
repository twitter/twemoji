# Contributing Guidelines

Looking to contribute something? Here's how you can help.

## Bugs reports

A bug is a _demonstrable problem_ that is caused by the code in the
repository. Good bug reports are extremely helpful - thank you!

Guidelines for bug reports:

1. **Use the GitHub issue search** &mdash; check if the issue has already been
   reported.

2. **Check if the issue has been fixed** &mdash; try to reproduce it using the
   latest `master` or development branch in the repository.

3. **Isolate the problem** &mdash; ideally create a reduced test
   case and a live example.

4. Please try to be as detailed as possible in your report. Include specific
   information about the environment - operating system and version, browser
   and version... and steps required to reproduce the issue.

## Feature requests & contribution enquiries

Feature requests are welcome. But take a moment to find out whether your idea
fits with the scope and aims of the project. It's up to *you* to make a strong
case for the inclusion of your feature. Please provide as much detail and
context as possible.

Contribution enquiries should take place before any significant pull request,
otherwise you risk spending a lot of time working on something that we might
have good reasons for rejecting.

## Making Changes

If you'd like to test and/or contribute please follow these instructions.

[Fork this repo on GitHub](https://github.com/twitter/twemoji.git/fork)

### Setup

```bash
# clone your fork
git clone -b master https://github.com/$YOUR_USERNAME/twemoji.git/
cd twemoji

# install dependencies
yarn install

# Build and test your installation
yarn build
yarn test
```

### Making changes

Make sure to adhere to the coding conventions used throughout the codebase
(indentation, accurate comments, etc.) and any other requirements (such as test
coverage).

Please follow this process; it's the best way to get your work included in the
project:

1. Create a new topic branch to contain your feature, change, or fix:

> If you'd like to test and/or propose some changes to the latest library version please change the `./scripts/build.js` file at its end so that everything will be generated properly once launched.

1. Commit your changes in logical chunks. Provide clear and explanatory commit
   messages. Use git's [interactive rebase](https://help.github.com/en/articles/about-git-rebase)
   feature to tidy up your commits before making them public.

2. Run `yarn prepublish`. This will do several things:

   1. Ask for the version number (See: [SemVer](https://semver.org/))
   2. Build the project and put the built assets in `dist/`
   3. Run the tests
   4. Move the contents of the `dist/` directory to the `gh-pages` branch
   5. Place the contents of the `dist/` directory in its corresponding versioned folder.
   6. Commit the changes and push them to the `gh-pages` branch of your fork.

## Pull requests

Good pull requests - patches, improvements, new features - are a fantastic
help. They should remain focused in scope and avoid containing unrelated
commits.

1. Push your topic branch up to your fork: `git push origin my-feature-branch`

2. [Open a Pull Request](http://help.github.com/send-pull-requests/) with a
   clear title and description. One for your changes in `master` and another one for
   your changes in `gh-pages`.

## License

By contributing your code:

You agree to license your contribution under the terms of the MIT (for code) and CC-BY (for graphics) licenses
<https://github.com/twitter/twemoji/blob/gh-pages/LICENSE>
<https://github.com/twitter/twemoji/blob/gh-pages/LICENSE-GRAPHICS>
