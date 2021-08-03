---
to: <%-destination%>/codegen.js
force: true
---

const { CodeGen, InputPromt } = require('simple-codegen');

const codegen = new CodeGen();

codeGen.addPrompt(new InputPromt("name", "Hello World"));

module.exports = codeGen;
