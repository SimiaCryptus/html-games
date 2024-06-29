const replace = require('replace-in-file');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');

const options = {
  files: [
    path.join(buildDir, 'index.html'),
    path.join(buildDir, '**/*.js'),
    path.join(buildDir, '**/*.css'),
  ],
  from: /"\//g,
  to: '"',
};

replace(options)
  .then(results => {
    console.log('Replacement results:', results);
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });
