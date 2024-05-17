import { QuickPickItem, QuickPickOptions, workspace } from 'vscode';
import { localize } from 'vscode-nls-i18n';

/**
 * @description git commit detail 提交信息的详情
 */
export interface CommitDetailType extends QuickPickItem {
    key?: string | number;
    isEdit?: boolean;
}
//最大的 subject 限制字数 Max subject characters
export const MaxSubjectCharacters =
    workspace.getConfiguration('GitCommitPlugin').get<number>('MaxSubjectCharacters') || 20;

export function GetCommitDetailType() {
    const CommitDetailType: Array<CommitDetailType> = [
        {
            label: '<Scope>',
            key: 'scope',
            description: localize('extension.commitDetailType.scope.description'),
            detail: localize('extension.commitDetailType.scope.detail'),
            isEdit: false,
        },
        {
            label: '<Subject>',
            key: 'subject',
            description: localize('extension.commitDetailType.subject.description'),
            detail: localize(
                'extension.commitDetailType.subject.detail',
                MaxSubjectCharacters.toString(),
            ),
            isEdit: false,
        },
        {
            label: 'Complete',
            key: 'complete',
            detail: localize('extension.commitDetailType.complete.detail'),
        },
        {
            label: 'Back',
            key: 'back',
            detail: localize('extension.commitDetailType.back.detail'),
        },
    ];

    return CommitDetailType;
}

export const CommitDetailQuickPickOptions: QuickPickOptions = {
    matchOnDescription: true,
    matchOnDetail: true,
    ignoreFocusOut: true,
};
