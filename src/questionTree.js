const vscode = require('vscode');
const os = require('os');
const path = require('path');
const axios = require("axios");

var lastTimestamp;
var r_data;
class questionTree {
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
        const {data: {zpData:{list,hasMore}}} = await axios.get(`https://www.zhipin.com/wapi/moment/get/question/wait2AnswerList?page=${this.page}&pageSize=30`);
        r_data = list;
        if(!hasMore) {
            this.page = 1
        }
        if(!r_data)r_data=[];
        var a_length = 30;
        var fin_items = [];
        for(var i = 0;i<a_length;i++){
            var item = r_data[i];
            fin_items.push(
                new DataItem(
                    item.content || '',
                    '',
                    {
                        command:"feinterview.openSite",title:"",arguments:[{url:"http://boss-interview.poetries.top/question-detail?questionId="+item.questionId,title:item.content || '',icon: 'icon_question.svg'}]
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
        this.iconPath = path.join(__filename,'../../','resources', 'icon_question.svg');
        this.command = command;
    }
}

module.exports = questionTree;