// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { GitExtension } from './types/git';
import GetCommitTypes, { CommitType } from './config/commit-type';
import {
    GetCommitDetailType,
    CommitDetailQuickPickOptions,
    MaxSubjectCharacters,
    CommitDetailType,
} from './config/commit-detail';
import GetCommitInputType, { CommitInputType } from './config/commit-input';
export interface GitMessage {
    [index: string]: string;
    type: string;
    subject: string
}

import { localize, init } from 'vscode-nls-i18n';
import { GetCommitOrderList } from './config/order-select';
import { DefaultCommitTemp } from './config/default-temp';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    init(context.extensionPath);

    const CommitType: Array<CommitType> = GetCommitTypes();
    const CommitDetailType: Array<CommitDetailType> = GetCommitDetailType();
    const CommitInputType: CommitInputType = GetCommitInputType();

    //获取是否在git扩展内 Gets whether it is in the git extension
    function getGitExtension() {
        return vscode.extensions.getExtension<GitExtension>('vscode.git')?.activate();
    }
    //Commit message config
    const message_config: GitMessage = {
        type: '',
        subject: '',
        taskId: '',
        taskCode: '',
        taskDesc: ''
    };
    //清除填写信息 Clear message
    function clearMessage() {
        Object.keys(message_config).forEach(key => (message_config[key] = ''));
        CommitDetailType.map(item => {
            item.isEdit = false;
            return item;
        });
    }
    //组合信息 Portfolio information
    function messageCombine(config: GitMessage) {
        let result = DefaultCommitTemp;
        result =
            config.type !== ''
                ? result.replace(/<type>/g, config.type)
                : result.replace(/<type>/g, '');
        result =
            config.subject !== ''
                ? result.replace(/<subject>/g, config.subject)
                : result.replace(/<subject>/g, '');
        result =
            config.taskId !== ''
                ? result.replace(/<taskId>/g, config.taskId)
                : result.replace(/<taskId>/g, '');
        result =
            config.taskCode !== ''
                ? result.replace(/<taskCode>/g, config.taskCode)
                : result.replace(/<taskCode>/g, '');
        result =
            config.taskDesc !== ''
                ? result.replace(/<taskDesc>/g, config.taskDesc)
                : result.replace(/<taskDesc>/g, '');
        result = result.replace(/<enter>/g, '\n');
        result = result.replace(/<space>/g, ' ');

        return result.trim();
    }

    const gitExtension = await getGitExtension();

    if (!gitExtension?.enabled) {
        vscode.window.showErrorMessage(
            'Git extensions are not currently enabled, please try again after enabled!',
        );
        return false;
    }

    //获取当前的 git仓库实例 Get git repo instance
    let repo: any = gitExtension.getAPI(1).repositories[0];

    //输入提交详情 Input message detail
    const inputMessageDetail = (_key: string | number) => {
        const _detailType = CommitDetailType.find(item => item.key === _key);
        CommitInputType.prompt = `${_detailType?.description} 👉 ${_detailType?.detail}`;
        CommitInputType.value = message_config[_key] || '';
        vscode.window.showInputBox(CommitInputType).then(value => {
            const _value = value || '';
            message_config[_key] = _value;
            _detailType && (_detailType.isEdit = true);
            if (_key === 'subject') {
                const input_value_length = value ? value.length : 0;
                if (input_value_length > MaxSubjectCharacters) {
                    vscode.window.showErrorMessage(
                        `The commit overview is no more than ${MaxSubjectCharacters} characters but the current input is ${input_value_length} characters`,
                        ...['ok'],
                    );
                    inputMessageDetail(_key);
                    return false;
                }
            }
            recursiveInputMessage(startMessageInput);
        });
    };

    //完成输入 Complete input message
    const completeInputMessage = () => {
        vscode.commands.executeCommand('workbench.view.scm');
        repo.inputBox.value = messageCombine(message_config);
    };
    // 递归输入信息 Recursive input message
    const recursiveInputMessage = (startMessageInput?: () => void) => {
        CommitDetailQuickPickOptions.placeHolder = localize(
            'extension.showGitCommit.description.placeholder',
        );

        const _CommitDetailType: Array<CommitDetailType> = JSON.parse(
            JSON.stringify(CommitDetailType),
        );
        _CommitDetailType.map((item: any) => {
            if (item.isEdit) {
                item.description = `${item.description} 👍 >> ${message_config[item.key || '']
                }`;
            }
            return item;
        });
        vscode.window
            .showQuickPick(_CommitDetailType, CommitDetailQuickPickOptions)
            .then(select => {
                const label = (select && select.label) || '';
                if (label !== '') {
                    const _key = select?.key || 'complete';
                    if(_key === 'taskCode') {
                        SelectOrder(_key);
                        return false;
                    }
                    if (_key === 'complete') {
                        completeInputMessage();
                        clearMessage();
                        return false;
                    }
                    if (_key === 'back') {
                        startMessageInput && startMessageInput();
                        clearMessage();
                        return false;
                    }
                    inputMessageDetail(_key);
                } else {
                    clearMessage();
                }
            });
    };
    //开始输入 Start input
    const startMessageInput = () => {
        CommitDetailQuickPickOptions.placeHolder = localize(
            'extension.showGitCommit.placeholder',
        );

        vscode.window
            .showQuickPick(CommitType, CommitDetailQuickPickOptions)
            .then(select => {
                let label = (select && select.label) || '';

                message_config.type = label;
                if (label !== '') {
                    recursiveInputMessage(startMessageInput);
                }
            });
    };
    //选择工单
    const SelectOrder = async (_key: string | number) => {
        const _detailType = CommitDetailType.find(item => item.key === _key);
        CommitDetailQuickPickOptions.placeHolder = localize(
            'extension.showGitCommit.selectOrder.placeholder',
        );
        const list = await GetCommitOrderList();
        vscode.window
            .showQuickPick(list, CommitDetailQuickPickOptions)
            .then(select => {
                const label = (select && select.label) || '';

                if(label !== '') {
                    if(label === 'Back'){
                        recursiveInputMessage(startMessageInput);
                        return false;
                    }
                    else {
                        _detailType && (_detailType.isEdit = true);
                        message_config.taskId = select!.taskId as string;
                        message_config.taskCode = select!.taskCode as string;
                        message_config.taskDesc = select!.taskDesc as string;
                        recursiveInputMessage(startMessageInput);
                        return false;
                    }
                }
                else {
                    clearMessage();
                }
            });
    };
    //点击图标触发快捷选项 Click the icon to trigger shortcut options
    let disposable = vscode.commands.registerCommand(
        'extension.showGitCommit',
        (uri?) => {
            if (uri) {
                //如果有多个repo 寻找当前的 进行填充 If there are multiple repos looking for the current to populate
                repo = gitExtension.getAPI(1).repositories.find(repo => {
                    const uriRoot = uri._rootUri ? uri._rootUri : uri.rootUri;
                    return repo.rootUri.path === uriRoot?.path;
                });
            }
            startMessageInput();
        },
    );
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
