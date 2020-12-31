const { ExtensionContext } = require('vscode');
const { EventEmitter } = require('events');

let extensionContext = ExtensionContext;
let events = new EventEmitter();

module.exports = {
  extensionContext,
  events,
};
