
const vscode = require('vscode');
const os = require('os');
const path = require('path');
const axios = require("axios");

var lastTimestamp;
var r_data;
class weappArticleTree {
    constructor(context){
        this.context = context;
        this.page = 1
        this.userRoot = os.homedir();
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh(){
        this.page +=1
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element){
        return element;
    }
    async getChildren(element) {
        const res = await axios.get(`https://api.poetries.top/api/interview/article/list?pageNum=1&pageSize=1000&categoryId=`);
        const list = res.data && res.data.data && res.data.data.list || []
        r_data = list.length ? list.filter(v=>v.title && v.url) : []
        if(!r_data)r_data=[];
        var a_length = list.length;
        var fin_items = [];
        for(var i = 0;i<a_length;i++){
            var item = r_data[i] || {};
            fin_items.push(
                new DataItem(
                    `${i+1}.${item.title}`,
                    '',
                    {
                        command:"feinterview.openSite",title: item.title,arguments:[{url: item.url,title:item.title,icon: 'icon_boss.svg',openType: "openExternal"}]
                    }
                )
            );
        }

        return fin_items;
    }
}

class DataItem extends vscode.TreeItem{
    constructor(label, tooltip, command) {
        super(label,  vscode.TreeItemCollapsibleState.None);
        this.tooltip = tooltip;
        this.iconPath = path.join(__filename,'../../','resources', 'icon_boss.svg');
        this.command = command;
    }
}

module.exports = weappArticleTree;