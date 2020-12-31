const vscode = require('vscode');
const os = require('os');
const path = require('path');
const axios = require("axios");

class SettingTree {
    constructor(context){
        this.context = context;
        this.userRoot = os.homedir();
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    getTreeItem(element){
        return element;
    }
    async getChildren(element) {

        var r_cates = [
            {
                title:"关注公众号",
                icon:"icon_chat.svg",
                url:"",
                view:"group",
                target:"default"
            },
            {
                title:"关注作者",
                icon:"icon_fire.svg",
                url:"https://github.com/poetries",
                openType: 'openExternal'
            },
            {
                title:"博客主页",
                icon:"icon_dashboard.svg",
                url:"https://blog.poetries.top/archives/"
            },
        ];
        var a_length = r_cates.length;

        var fin_items = [];
        for(var i = 0;i<a_length;i++){
            var item = r_cates[i];
            fin_items.push(
                new DataItem(
                    item.title,
                    item.icon,
                    "",
                    {
                        command:"feinterview.openSite",title:"",arguments:[item]
                    }
                )
            );
        }

        return fin_items;
    }
}

class DataItem extends vscode.TreeItem{
    constructor(label, icon, tooltip, command) {
        super(label,  vscode.TreeItemCollapsibleState.None);
        this.tooltip = tooltip;
        this.iconPath = path.join(__filename,'../../','resources', icon);
        this.command = command;
    }
}

module.exports = SettingTree;