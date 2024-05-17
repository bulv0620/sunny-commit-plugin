import { workspace, QuickPickItem } from 'vscode';
import { localize } from 'vscode-nls-i18n';

/**
 * @description git commit 提交类型
 */
export interface CommitType extends QuickPickItem {
    key?: string;
}

export default function GetCommitTypes() {
    let CommitType: Array<CommitType> = [
        {
            label: 'init',
            key: 'init',
            detail: localize('extension.commitType.init.detail'),
        },
        {
            label: 'feat',
            key: 'feat',
            detail: localize('extension.commitType.feat.detail'),
        },
        {
            label: 'fix',
            key: 'fix',
            detail: localize('extension.commitType.fix.detail'),
        },
        {
            label: 'docs',
            key: 'docs',
            detail: localize('extension.commitType.docs.detail'),
        },
        {
            label: 'style',
            key: 'style',
            detail: localize('extension.commitType.style.detail'),
        },
        {
            label: 'refactor',
            key: 'refactor',
            detail: localize('extension.commitType.refactor.detail'),
        },
        {
            label: 'perf',
            key: 'perf',
            detail: localize('extension.commitType.perf.detail'),
        },
        {
            label: 'test',
            key: 'test',
            detail: localize('extension.commitType.test.detail'),
        },
        {
            label: 'build',
            key: 'build',
            detail: localize('extension.commitType.build.detail'),
        },
        {
            label: 'ci',
            key: 'ci',
            detail: localize('extension.commitType.ci.detail'),
        },
        {
            label: 'chore',
            key: 'chore',
            detail: localize('extension.commitType.chore.detail'),
        },
        {
            label: 'revert',
            key: 'revert',
            detail: localize('extension.commitType.revert.detail'),
        },
    ];

    return CommitType;
}
