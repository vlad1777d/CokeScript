var cokescript = require('../dist/cokescript');
var assert = require("assert");
var vm = require('vm');

function gen(source) {
  return cokescript.generateModule(source).code.trim();
}
function exe(js, context) {
  try { 
    return vm.runInNewContext(js, context);
  } catch(e) {
    throw 'JS error\n' + js;
  }
}

describe("Test suite", function() {

  it("Simple function", function() {
    var code = gen("def test() 1");
    assert.equal(code, "function test() { return 1; };");
    assert.equal(exe(code), undefined);
  });

  it("Function call", function() {
    var code = gen("def test() 1\ntest()");
    assert.equal(exe(code), 1);
  });

  it("Function addition", function() {
    var code = gen("def test() 1 + 3\ntest()");
    assert.equal(exe(code), 4);
  });

  it("String interpolation", function() {
    var code = gen('def test(alpha, beta) "hello {alpha} world {beta}"\ntest(1, 2)');
    assert.equal(exe(code), "hello 1 world 2");
  });

  it("Return an array", function() {
    var code = gen('def test(a=1, b, c="test")\n  return [a, b, c]\ntest(undefined, 3)\n');
    assert.deepEqual(exe(code), [1, 3, "test"]);
  });

  it("Return an object", function() {
    var code = gen('def test(a=1, b, c="test")\n  return {a:a, b:b, c:c}\ntest(undefined, 3)\n');
    assert.deepEqual(exe(code), {a:1, b:3, c:"test"});
  });

  it("Multiline interpolated string", function() {
    var code = gen('a = "hello {w}\nhello {x}\nhello {y}"\na');
    assert.equal(exe(code, {w:1, x:2, y:3}), "hello 1\nhello 2\nhello 3");
  });

});
