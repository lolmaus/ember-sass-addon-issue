# ember-sass-addon-issue

When the the project is built normally, the following happens:

* `app/styles/app.scss` @uses `app/components/my-component`;
* `app/components/my-component.scss` @uses the `$content` variable from `app/styles/config/themes/current-theme`;
* `app/styles/config/themes/_current-theme.scss` @forwards `./default`;
* `app/styles/config/themes/_current-theme.scss` defines the `$content` variable.

It works.

When the project is built with the `EMBER_THEME=client2` env var (or simply use `yarn client2`), then the in-repo addon `select-sass-theme` should replace `_current-theme.scss` with `_client2.scss`, and the `$content` variable should have different value.

This does not work! The addon successfully manipulates the tree, but this tree is different from what Sass sees.

This might be because the `app/components/my-component.scss` file is outside of Sass import paths, and when this file is imported, it is read from the actual filesystem or from another tree, but not the tree that the in-repo addon manipulates on.
