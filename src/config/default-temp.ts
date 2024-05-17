import { QuickPickItem, QuickPickOptions, workspace } from 'vscode';
import { localize } from 'vscode-nls-i18n';

// commit信息模板
export const DefaultCommitTemp =
    workspace.getConfiguration('GitCommitPlugin').get<string>('DefaultCommitTemp') || '';
