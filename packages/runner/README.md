# Judge runner

The Scratch judge mainly run in the browser, just as the scratch project itself.
However, to test a submission, we need to be able to run the judge in a more
automated way.

This package contains two ways of running this:

- The manual runner. In this way, you open the `environmnent.html` file in the
  browser, and it will automatically run stuff.
- The programmatic runner. Here, the judge will be run using puppeteer.
