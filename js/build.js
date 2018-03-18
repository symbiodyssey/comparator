var buildify = require('buildify');

buildify()
  .load('core.js')
  //.concat(['part1.js', 'part2.js'])
  //.wrap('../lib/template.js', { version: '1.0' })
  //.concat('generic.js')

  .save('cp.js')
  .uglify()
  .save('cp.min.js');
