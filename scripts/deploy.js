const fs = require('fs');
const { normalize, join, sep, dirname, basename } = require('path');

const mkdirp = require('mkdirp');
const globby = require('globby');
const pretty = require('pretty');

const scriptReg = /<script+.*>+.*<\/script>/g;
const linkReg = /<link as+.*\/>/g;

(async () => {
  const src = normalize(`${__dirname}/../public/**/*.html`);
  const dest = normalize(`${__dirname}/../deploy`);

  mkdirp.sync(dest);
  const paths = await globby([src]);

  paths.forEach((path) => {
    let content = fs.readFileSync(path, 'utf-8');
    const folder = dirname(path).split('/').pop();

    let filename = basename(path);
    filename = filename === 'index.html' && folder !== 'public'
      ? `${folder}.html`
      : filename;

    content = content.replace(scriptReg, '');
    content = content.replace(linkReg, '');

    fs.writeFileSync(join(dest, filename), pretty(content));

    console.log(`modify ${path} ---> ${filename}`);
  });
})();