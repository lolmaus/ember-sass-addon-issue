'use strict';

const stew = require('broccoli-stew');
const themeName = process.env.EMBER_THEME || 'default';

module.exports = {
  name: require('./package').name,

  _registers: [],
  setupPreprocessorRegistry(type, registry, isFinal = false) {
    if (themeName === 'default') {
      return;
    }
    this._registers.push([type, registry]);
    if (!isFinal) {
      return;
    }
    const sass = registry
      .load('css')
      .find(({ name }) => name === 'ember-cli-sass');
    if (!sass) {
      console.error('unable to find ember-cli-sass processor');
      return;
    }
    console.log('found preprocessor');
    registry.remove('css', sass);

    function SASSOverridePlugin() {
      this.name = 'sass-override-plugin';
      this.ext = ['scss', 'sass'];
    }

    SASSOverridePlugin.prototype.toTree = function (
      tree,
      inputPath,
      outputPath,
      inputOptions
    ) {
      tree = stew.rm(tree, `app/styles/config/themes/_current-theme.scss`);

      tree = stew.mv(
        tree,
        `app/styles/config/themes/_${themeName}.scss`,
        `app/styles/config/themes/_current-theme.scss`
      );

      return sass.toTree(tree, inputPath, outputPath, inputOptions);
    };

    registry.add('css', new SASSOverridePlugin());
  },

  included() {
    this._super.included.apply(this, arguments);
    this._registers.forEach(([type, registry]) => {
      this.setupPreprocessorRegistry(type, registry, true);
    });
  },
};
