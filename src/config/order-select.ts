import { QuickPickItem, workspace } from 'vscode';
import { localize } from 'vscode-nls-i18n';
import axios from 'axios';

interface MyQuickPickItem extends QuickPickItem {
    taskId?: string
    taskCode?: string
    taskDesc?: string
}

// 工号
export const SunnyId =
    workspace.getConfiguration('GitCommitPlugin').get<string>('SunnyId') || '';

export async function GetCommitOrderList() {
    
    const orderDetailType: MyQuickPickItem[] = [
        {
            label: 'Back',
            detail: localize('extension.commitDetailType.back.detail'),
        },
    ];

    if(!SunnyId) {return orderDetailType;}

    try {
        const { data } = await axios.post('http://192.168.46.10:9889/devResources/selectDetail', 'jh');

        const myDetail = data.jh.find((el: any) => el.id === SunnyId);

        if(myDetail && myDetail.gtArray) {
            orderDetailType.unshift(...myDetail.gtArray.map((el: any)  => ({
                label: el.id,
                detail: el.name,
                taskId: el.billid,
                taskCode: el.id,
                taskDesc: el.name.split('-').pop(),
            })));
        }

        return orderDetailType;
    } catch (error) {
        return orderDetailType;
    }
}