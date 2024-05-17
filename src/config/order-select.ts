import { QuickPickItem, QuickPickOptions, workspace } from 'vscode';
import { localize } from 'vscode-nls-i18n';
import axios from 'axios';

// 工号
export const SunnyId =
    workspace.getConfiguration('GitCommitPlugin').get<string>('SunnyId') || '';

export async function GetCommitOrderList() {

    
    const orderDetailType: QuickPickItem[] = [
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
                detail: el.name
            })));
        }

        return orderDetailType;
    } catch (error) {
        return orderDetailType;
    }
}