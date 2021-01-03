const vscode = require('vscode');
const os = require('os');
const path = require('path');
const axios = require("axios");

var lastTimestamp;
var r_data;
class TopicTree {
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
        const {data: {zpData:{topicList,hasMore}}} = await axios.get(`http://boss-interview.poetries.top/wapi/moment/discover/recHotTopic?page=${this.page}`);
        r_data = topicList;
        if(!hasMore) {
            this.page = 1
        }
        if(!r_data)r_data=[];
        var a_length = 4;
        var fin_items = [];
        for(var i = 0;i<a_length;i++){
            var item = r_data[i];
            fin_items.push(
                new DataItem(
                    item.topicName,
                    '',
                    {
                        command:"feinterview.openSite",title:"",arguments:[{url:"http://boss-interview.poetries.top?topicId="+item.formId,title:item.topicName,icon: 'icon_topic.svg'}]
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
        this.iconPath = path.join(__filename,'../../','resources', 'icon_topic.svg');
        this.command = command;
    }
}

module.exports = TopicTree;