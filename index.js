var path = require('path')
var fs = require('ps')
var basename = require('enhanced-resolve/lib/getPaths').basename

module.exports = function (options) {
  // TODO basePath  结尾追加 '/'
  return {
    apply: c.bind(this, options)
  }
}

function c (options, resolver){
  var target = resolver.ensureHook('resolve')
  resolver.getHook('resolve').tapAsync('HttpResolverWebpackPlugin', function (request, resolveContext, callback){
    // TODO 匹配规则 需从options中取
    if(/^@mit/.test(request.request)) {
      var fileNames = request.request.split('/')
      var fileName = fileNames.pop() || fileNames.pop()
      // TODO 写入地址需从options中取
      var writerStream = fs.createWriteStream('./output.js')
      http.get(options.basePath + fileName, function(req,res){
        req.pipe(writerStream)
        writerStream.on('finish', function() {
          var obj = Object.assign({}, request, {
            request: path.resolve(__dirname, '../output.js')
          });
          return resolver.doResolve(target, obj, null, resolveContext, callback);
        });
      });
    } else {
      callback()
    }
  })
}