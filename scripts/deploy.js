const fs = require('fs');
const { normalize, join, sep, dirname, basename } = require('path');

const mkdirp = require('mkdirp');
const globby = require('globby');
const pretty = require('pretty');

(async () => {
  const src = normalize(`${__dirname}/../public/**/*.html`);
  const dest = normalize(`${__dirname}/../deploy`);

  mkdirp.sync(dest);
  const paths = await globby([src]);

  paths.forEach((path) => {
    console.log(`---> ${path}\n`)

    const content = fs.readFileSync(path, 'utf-8');
    const folder = dirname(path).split('/').pop();

    let filename = basename(path);
    filename = filename === 'index.html' && folder !== 'public'
      ? `${folder}.html`
      : filename;

      console.log(`result --->`, filename, folder);
    fs.writeFileSync(join(dest, filename), pretty(content));
  });
})();
