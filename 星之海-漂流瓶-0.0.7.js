// ==UserScript==
// @name         漂流瓶（星之海API版）
// @author       流溪
// @version      0.0.6-fix
// @description  请务必看文档！使用.星之海导游手册可以获取帮助。目前星之海还很不完善，如在扔出emoji时会报错，请避免它。
// @timestamp    1676100198
// @license      Apache-2
// @homepageURL  https://github.com/lxy071130
// ==/UserScript==
const botId = 114514; //这里把114514替换为你自己的botId，请务必加群申请，否则无法进行任何行为！
if(!seal.ext.find('漂流瓶')){
    ext = seal.ext.new('漂流瓶','流溪','0.0.6');
    seal.ext.register(ext);
}
const cmdGetBottle = seal.ext.newCmdItemInfo();
cmdGetBottle.name = '捡漂流瓶';
cmdGetBottle.solve = (ctx, msg, cmdArgs) => {
    switch (cmdArgs.getArgN(1)){
        case 'help': {
            seal.replyToSender(ctx, msg, `使用.捡漂流瓶 来拾取一个瓶子。全部命令请使用".星之海导游手册"来查询。`);
            seal.ext.newCmdExecuteResult(true);
            break;
        }
        default: {
            let strUserId = msg.sender.userId;
            let userName = msg.sender.nickname;
            let rawUserId = Number(strUserId.replace(/[abcdefghijklmnopqrstuvwxyz]/ig,"").replace(":",""));
            const url = 'https://cdn.api.dicex.cn/drift_bottle/starry_sea/drift/get?user_id='+rawUserId+'&bot_client='+msg.platform
            fetch(url, {
                headers: {
                    'X-Self-Id': botId
                }
            })
                .then((response) => {
                    // 判断响应状态码是否为 200
                    if (response.ok) {
                        return response.text();
                    } else {
                        seal.replyToSender(ctx, msg, "获取漂流瓶失败。这大概率是因为配置错误的botId。");
                    }
                })
                .then((data) => {
                    fetchResult = JSON.parse(data);
                    switch (fetchResult.error_info){
                        case '': {
                            bottleMsg = fetchResult.content.msg;
                            bottleCount = fetchResult.drift_bottle_count;
                            bottleUserId = fetchResult.content.user_id;
                            bottleTime = Date(Number(fetchResult.content.time_stamp));
                            bottleUserName = fetchResult.content.user_name;
                            botClient = fetchResult.update_source.bot_client;
                            seal.replyToSender(ctx, msg, `"${userName}"捞到了一个瓶子，里面装着一张纸条，上面写着：\n${bottleMsg}\n看起来像是"${bottleUserName}"(${botClient}:${bottleUserId})的留言。`)
                            seal.ext.newCmdExecuteResult(true);
                            break;
                        }
                        default: {
                            errorInfo = fetchResult.error_info;
                            seal.replyToSender(ctx, msg, `错误:${errorInfo}`);
                        }
                    }
                })
        }
    }
};
const cmdThrowBottle = seal.ext.newCmdItemInfo();
cmdThrowBottle.name = '扔漂流瓶'
cmdThrowBottle.solve = (ctx, msg, cmdArgs) => {
    switch (cmdArgs.getArgN(1)){
        case 'help': {
            seal.replyToSender(ctx, msg, `使用.扔漂流瓶 扔出一个瓶子。全部命令请使用".星之海导游手册"来查询。`);
            seal.ext.newCmdExecuteResult(true);
            break;
        }
        default: {
            const url = 'https://cdn.api.dicex.cn/drift_bottle/starry_sea/drift/update';
            let strUserId = msg.sender.userId;
            let bottleMsg = cmdArgs.getArgN(1);
            let userName = msg.sender.nickname;
            let rawUserId = Number(strUserId.replace(/[abcdefghijklmnopqrstuvwxyz]/ig,"").replace(":",""));
            let groupId = msg.groupId
            let rawGroupId = Number(groupId.replace("QQ-Group:",""))
            to_send_msgs = {
                "bot_id": botId,
                "bot_client": msg.platform,

                "target_id": Number(""),

                "content": {
                    "msg": bottleMsg,
                    "user_id": rawUserId,

                    "user_name": userName,
                    "group_id": rawGroupId,
                    "group_name": "",

                    "time_stamp": Date.parse( new Date()),
                },
            }
            switch (cmdArgs.args.length){
                case 0: {
                    seal.replyToSender(ctx, msg, `"${userName}"尝试向星之海中丢一个空空的瓶子，但是瓶子被送了回来。`);
                    break;
                }
                default: {
                    fetch(url, {
                        body: JSON.stringify(to_send_msgs),
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                            'X-self-Id': botId,
                        }
                    })
                        .then((response) => {
                            if (response.ok) {
                                return response.text();
                            } else {
                                seal.replyToSender(ctx, msg, "发送漂流瓶失败。这大概率是因为配置错误的botId。");
                            };
                        })
                        .then((data) => {
                            let back_msgs = JSON.parse(data);
                            switch (back_msgs.back_msg){
                                case "成功上传!": {
                                    seal.replyToSender(ctx, msg, `"${userName}"向浮动的星之海中丢了一个瓶子。`)
                                    break;
                                }
                                default: {
                                    seal.replyToSender(ctx, msg, `出现错误:${back_msg}`)
                                }
                            }
                        })
                        .catch((error) => {
                            seal.replyToSender(ctx, msg, `执行发生如下错误：\n${error}`);
                        });
                }
            }
        }
    }
}
const cmdGetBottleAmount = seal.ext.newCmdItemInfo();
cmdGetBottleAmount.name = '查询瓶子数量';
cmdGetBottleAmount.solve = (ctx, msg, cmdArgs) => {
    let userName = msg.sender.nickname
    url = 'https://cdn.api.dicex.cn/drift_bottle/starry_sea/drift/count'
    fetch(url, {
        headers: {
            'X-Self-Id': botId
        }
    })
        .then((response) => {
            if (response.ok) {
                return response.text();
            } else {
                console.log('连接失败');
            };
        })
        .then((data) => {
            let drift_count = JSON.parse(data);
            let bottleAmount = drift_count.drift_bottle_count;
            seal.replyToSender(ctx, msg, `"${userName}"看到星之海中有${bottleAmount}颗星辰在闪耀。`)
        })
        .catch((error) => {
            seal.replyToSender(ctx, msg, `执行发生如下错误：\n${error}`);
        });
}
const cmdHelp = seal.ext.newCmdItemInfo();
cmdHelp.name = '星之海导游手册';
cmdHelp.solve = (ctx, msg, cmdArgs) =>{
    switch (cmdArgs.args.length){
        case 0: {
            seal.replyToSender(ctx, msg, `————总导览————\n.星之海导游手册 使用方法 //查看如何使用该扩展\n.星之海导游手册 协约       //查看完整协约\n.星之海导游手册 注意事项 //查看简易版协约\n因为太多了只能分开写，见谅`)
            break;
        }
        default: {
            switch (cmdArgs.getArgN(1)){
                case '使用方法': {
                    seal.replyToSender(ctx, msg, `星之海的使用方法：\n.扔漂流瓶 内容 //扔出一个漂流瓶\n.捡漂流瓶        //捡起一个漂流瓶\n.查询瓶子数量  //查看现有漂流瓶数量\n.扔漂流瓶给 qq号 内容 //扔瓶子给特定的人\n.跨入星之海 //自杀行为……\n目前星之海还很不完善，如在扔出emoji时会报错，请避免它。\n更多功能制作中……`)
                    break;
                }
                case '协约': {
                    seal.replyToSender(ctx, msg, `请看这里！`);
                    seal.replyToSender(ctx, msg, `[CQ:share,url=https://api.dicex.cn/privacy-agreement,title=星之海协约,image=https://api.dicex.cn/logo.png]`);
                    seal.replyToSender(ctx, msg, `或直接访问https://api.dicex.cn/privacy-agreement`);
                    break;
                }
                case '注意事项': {
                    seal.replyToSender(ctx, msg, `游客们，你们被允许这样做：\n1.利用漂流瓶进行交友；\n2.向有价值的漂流瓶表达赞赏；\n3.和漂流瓶主人进行友好的交流。\n4.其他充满正能量的行为。\n你们被禁止这样做：\n1.扔出恶意或违法的漂流瓶，扔出无意义漂流瓶，蓄意扔出大量漂流瓶；\n2.因为不含恶意的漂流瓶的内容对漂流瓶主人进行辱骂；\n3.无故骚扰漂流瓶主人，或尝试进行非法行为；\n4.其他违背道德和法律的，攻击他人的行为。`)
                    break;
                }
                default: {
                    seal.replyToSender(ctx, msg, `啊嘞？导游手册没有这一章……`)
                }
            }
        }
    }
}
const cmdSuicide = seal.ext.newCmdItemInfo()
cmdSuicide.name = '踏入星之海'
cmdSuicide.solve = (ctx, msg, cmdArgs) => {
    switch (cmdArgs.getArgN(1)){
        case 'help': {
            seal.replyToSender(ctx, msg, `如果你一定要这样……我能怎么办呢？`);
            seal.ext.newCmdExecuteResult(true);
            break;
        }
        default: {
            const url = 'https://cdn.api.dicex.cn/drift_bottle/starry_sea/drift/update';
            let strUserId = msg.sender.userId;
            let rawUserId = Number(strUserId.replace(/[abcdefghijklmnopqrstuvwxyz]/ig,"").replace(":",""));
            let userName = msg.sender.nickname;
            let bottleMsg = `一份由"`+userName+`"的骨灰组成的信纸……看上去又有哪个不长眼的踏入星之海了啊。`;
            let groupId = msg.groupId
            let rawGroupId = Number(groupId.replace("QQ-Group:",""))
            to_send_msgs = {
                "bot_id": botId,
                "bot_client": msg.platform,

                "target_id": Number(""),

                "content": {
                    "msg": bottleMsg,
                    "user_id": rawUserId,

                    "user_name": userName,
                    "group_id": rawGroupId,
                    "group_name": "",

                    "time_stamp": Date.parse( new Date()),
                },
            }
            fetch(url, {
                body: JSON.stringify(to_send_msgs),
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'X-self-Id': botId,
                }
            })
                .then((response) => {
                    if (response.ok) {
                        return response.text();
                    } else {
                        seal.replyToSender(ctx, msg, "发送漂流瓶失败。这大概率是因为配置错误的botId。");
                    };
                })
                .then((data) => {
                    let back_msgs = JSON.parse(data);
                    switch (back_msgs.back_msg){
                        case "成功上传!": {
                            seal.replyToSender(ctx, msg, `"${userName}"跨入了星之海。看起来他被那里的知识所震撼且暂时回不来了……`)
                            break;
                        }
                        default: {
                            seal.replyToSender(ctx, msg, `出现错误:${back_msg}`)
                        }
                    }
                })
                .catch((error) => {
                    seal.replyToSender(ctx, msg, `执行发生如下错误：\n${error}`);
                });
        }
    }
}
const cmdThrowBottleTo = seal.ext.newCmdItemInfo();
cmdThrowBottleTo.name = '扔漂流瓶给'
cmdThrowBottleTo.solve = (ctx, msg, cmdArgs) => {
    let targetUserId = Number(cmdArgs.getArgN(1));
    switch (msg.platform) {
        case 'QQ': {
            const url = 'https://cdn.api.dicex.cn/drift_bottle/starry_sea/drift/update';
            let strUserId = msg.sender.userId;
            let bottleMsg = cmdArgs.getArgN(2);
            let userName = msg.sender.nickname;
            let rawUserId = Number(strUserId.replace(/[abcdefghijklmnopqrstuvwxyz]/ig, "").replace(":", ""));
            let groupId = msg.groupId;
            let rawGroupId = Number(groupId.replace("QQ-Group:", ""));
            to_send_msgs = {
                "bot_id": botId,
                "bot_client": msg.platform,

                "target_id": Number(targetUserId),

                "content": {
                    "msg": bottleMsg,
                    "user_id": rawUserId,

                    "user_name": userName,
                    "group_id": rawGroupId,
                    "group_name": "",

                    "time_stamp": Date.parse(new Date()),
                },
            }
            switch (cmdArgs.args.length) {
                case 1: {
                    seal.replyToSender(ctx, msg, `"${userName}"尝试向星之海中丢一个空空的瓶子，但是瓶子被送了回来。`);
                    break;
                }
                case 0: {
                    seal.replyToSender(ctx, msg, `"${userName}"尝试向星之海中丢一个空空的瓶子，但是瓶子被送了回来。`);
                    break;
                }
                default: {
                    switch (isNaN(targetUserId)){
                        case true: {
                            seal.replyToSender(ctx, msg, `QQ号必须是一串数字！`);
                            seal.ext.newCmdExecuteResult(true);
                            break;
                        }
                        default: {
                            fetch(url, {
                                body: JSON.stringify(to_send_msgs),
                                method: "POST",
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-self-Id': botId,
                                }
                            })
                                .then((response) => {
                                    if (response.ok) {
                                        return response.text();
                                    } else {
                                        seal.replyToSender(ctx, msg, "发送漂流瓶失败。这大概率是因为配置错误的botId。");
                                    };
                                })
                                .then((data) => {
                                    let back_msgs = JSON.parse(data);
                                    switch (back_msgs.back_msg) {
                                        case "成功上传!": {
                                            seal.replyToSender(ctx, msg, `"${userName}"向浮动的星之海中丢了一个瓶子，上面写着一串神秘的编号：${targetUserId}。`)
                                            break;
                                        }
                                        default: {
                                            seal.replyToSender(ctx, msg, `出现错误:${back_msg}`)
                                        }
                                    }
                                })
                                .catch((error) => {
                                    seal.replyToSender(ctx, msg, `执行发生如下错误：\n${error}`);
                                });
                        }
                    }
                }
            }
            break;
        }
        default: {
            seal.replyToSender(ctx, msg, `目前此插件只支持qq上的定向漂流瓶功能……`);
            seal.ext.newCmdExecuteResult(true);
        }
    }
}
ext.cmdMap['跨入星之海'] = cmdSuicide;
ext.cmdMap[`捡漂流瓶`] = cmdGetBottle;
ext.cmdMap['扔漂流瓶'] = cmdThrowBottle;
ext.cmdMap['查询瓶子数量'] = cmdGetBottleAmount;
ext.cmdMap['星之海导游手册'] = cmdHelp;
ext.cmdMap['扔漂流瓶给'] = cmdThrowBottleTo;