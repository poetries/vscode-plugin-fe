const vscode = require('vscode');
const os = require('os');
const path = require('path');
const axios = require("axios");

var lastTimestamp;
var r_data;
class CategoryTree {
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
        var timestamp = new Date().getTime();
        if(!lastTimestamp||timestamp-lastTimestamp>3600000){
            lastTimestamp=timestamp;
            const res = await axios.get("http://poetries1.gitee.io/vscode-plugin-fe-tools/nav.json");
            r_data = res.data;
        }else{
            console.log("use cached");
        }
        if(!r_data)r_data=[];
        var a_length = r_data.length;
        var fin_items = [];
        
        for(var i = 0;i<a_length;i++){
            var item = r_data[i];
            item.view = "tool";
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

module.exports = CategoryTree;