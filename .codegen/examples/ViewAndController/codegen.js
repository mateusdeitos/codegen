// const { Template } = require('simple-codegen');
const { Template, CodeGen } = require('../../../dist');
const { resolve } = require('path');
const codeGenController = require('../Controller/codegen');
const codeGenView = require('../View/codegen');

const codeGen = CodeGen.clone(codeGenController)

codeGen.addTemplate(new Template(resolve(__dirname, '..', 'Controller', 'templates')));
codeGen.addTemplate(new Template(resolve(__dirname, '..', 'View', 'templates')));

codeGenView.getPrompts().map(prompt => codeGen.addPrompt(prompt));

module.exports = codeGen;
