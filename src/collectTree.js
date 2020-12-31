const vscode = require('vscode');
const os = require('os');
const path = require('path');
const BaseConfig = require('./baseConfig');

class ToolsTree {
    constructor(context){
        this.context = context;
        this.userRoot = os.homedir();
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh(){
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element){
        return element;
    }
    getChildren() {
        const sites = BaseConfig.getConfig('frontend-box.markbook');
        return sites.map(item => {
          const tree = new DataItem(
            item.title,
            '',
            {
              command:"feinterview.openSite",title:"",arguments:[item]
            }
          )
          tree.id = item.url
          return tree;
        });
    }
}

class DataItem extends vscode.TreeItem{
    constructor(label, tooltip, command) {
        super(label,  vscode.TreeItemCollapsibleState.None);
        this.tooltip = tooltip;
        this.iconPath = path.join(__filename,'../../','resources', 'sitepage.svg');
        this.command = command;
    }
}

module.exports = ToolsTree;