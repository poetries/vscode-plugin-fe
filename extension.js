// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const CategoryTree = require('./src/navTree');
const BlogTree = require("./src/blogTree");
const ToolsTree = require("./src/toolsTree");
const DocsTree = require("./src/docsTree");
const SettingTree = require("./src/settingTree");
const { default: axios } = require('axios');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

var webViewStorage={};
var context;
function activate(ctx) {
	context = ctx;
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "feinterview" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const categoryTree = new CategoryTree(context);
	vscode.window.registerTreeDataProvider("feinterview_site", categoryTree);

	const settingTree = new SettingTree(context);
	vscode.window.registerTreeDataProvider("feinterview_setting", settingTree);

	const blogTree = new BlogTree(context);
	vscode.window.registerTreeDataProvider("feinterview_blog", blogTree);

	const toolsTree = new ToolsTree(context);
	vscode.window.registerTreeDataProvider("feinterview_tools", toolsTree);

	const docsTree = new DocsTree(context);
	vscode.window.registerTreeDataProvider("feinterview_docs", docsTree);

	let openSite = vscode.commands.registerCommand('feinterview.openSite', openInWebview);
	context.subscriptions.push(openSite);

	let addTools = vscode.commands.registerCommand('feinterview.addTools', function () {
		console.log('addTools');
		vscode.env.openExternal("https://github.com/poetries/mywiki/tree/master/bookmark");
	});
}

function openInWebview(params) {
	// The code you place here will be executed every time your command is executed
	console.log('feinterview.openSite:' + JSON.stringify(params));
	// Display a message box to the user

	if(params.openType == 'openExternal') {
		vscode.env.openExternal(params.url);
		return
	}

	var view = params.view||"default";
	var target = params.target||view;

	if(!webViewStorage[target]) {
		webViewStorage[target]={};
	}

	var webViewPanel = webViewStorage[target].panel;

	if(!webViewPanel){
		webViewPanel = vscode.window.createWebviewPanel(
			'webview', // viewType
			'', // 视图标题
			vscode.ViewColumn.One,
			{
				enableFindWidget:true,
				enableCommandUris: true,
				enableScripts: true, // 启用JS，默认禁用
				retainContextWhenHidden: true // webview被隐藏时保持状态，避免被重置
			}
		);
		webViewPanel.onDidDispose(function(){
			console.log("webview diposed");
			delete webViewStorage[target];
		});
		webViewPanel.webview.onDidReceiveMessage(
			message => {
				console.log("webview onDidReceiveMessage：",JSON.stringify(message));
				switch (message.command) {
					case 'alert':
						vscode.window.showInformationMessage(message.text);
						break;
					case 'log':
						console.log(message.text);
						break;
					case 'openExternal':
						vscode.env.openExternal(message.url);
						break;
					case 'openInWebview':
						openInWebview({url:message.url});
						break;
					case 'request':
						console.log("ready to request from weview");
						console.log(message.params);
						axios.request({
							url:message.params.url,
							method:message.params.method||'GET',
							data:message.params.data
						}).then((res)=>{
							console.log(res);
							webViewPanel.webview.postMessage({ command: 'onRequestSuccess' , data:res.data });
						}).catch((err)=>{
							console.log(err);
							webViewPanel.webview.postMessage({ command: 'onRequestFail' , data:err });
						});
						break;
				}
			},
			undefined,
			context.subscriptions
		);

		webViewStorage[target]={panel:webViewPanel};
	}
	webViewPanel.title = params.title||"前端面试";

	webViewPanel.iconPath = vscode.Uri.file(path.join(__dirname,"resources",params.icon||"icon_"+view+".svg"));

	if(params.url!=webViewStorage[target].url){
		webViewStorage[target].url = params.url;
		webViewPanel.webview.html = getWebViewContent(context, 'src/views/'+view+'.html');
		webViewPanel.webview.postMessage({ command: 'load' , params:params });
	}

	webViewPanel.reveal();
}

function getWebViewContent(context, templatePath) {
	const resourcePath = path.join(context.extensionPath, templatePath);
	const dirPath = path.dirname(resourcePath);
	let html = fs.readFileSync(resourcePath, 'utf-8');
    html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
		if($2.indexOf("https://")<0)return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
		else return $1 + $2+'"';
	});
	return html;
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
