<template>
    <div id="modelWarningPanel" class="ns">
        <section class="warning-wrapper led-speaker">
            <header class="blue-header">统计分析</header>
            <main>
                <ul>
                    <li>大喇叭-<span>{{ targetWayStat.speakerSum }}</span>个</li>
                    <li>LED显示屏-<span>{{ targetWayStat.LEDSum }}</span>个</li>
                </ul>
            </main>
        </section>
        <section class="warning-wrapper info-channel">
            <header class="blue-header">消息渠道</header>
            <main>
                <ul>
                    <li v-for="el in msgData"
                        :class="{'blue-selected': el.selected}"
                        @click="toggleInfoChannel(el)">{{el.name}}<em></em></li>
                </ul>
            </main>
        </section>
        <section class="warning-wrapper disaster-type">
            <header class="blue-header">灾害类型</header>
            <main>
                <select id="warnTypeFirst" class="type-select" @change="selectChange($event)">
                    <option selected disabled hidden>请选择灾害类型</option>
                    <option v-for="(eltype,key) in selectTypeData.disasters" :value="key" >{{key}}</option>
                </select>
                <select id="warnTypeSub" class="type-select" v-show="selectTypeData.subList.length">
                    <option v-for="item in selectTypeData.subList">{{item}}</option>
                </select>
            </main>
        </section>
        <section class="warning-wrapper disaster-level">
            <header class="blue-header">灾害等级</header>
            <main>
                <ul>
                    <li v-for="(el, index) in disasterLevel"
                        :class="{'blue-selected': el.selected}"
                        @click="changeLevel(el, index)">
                        <span :style="{backgroundColor: el.color}"></span>
                        <span>{{el.name}}<em></em></span>
                    </li>
                </ul>
            </main>
        </section>
        <section class="warning-wrapper effected-area">
            <header class="blue-header">影响区域</header>
            <main>
                <ul>
                    <li class="blue-selected"
                        v-for="el in townArray"
                        @click="deleteTown(el)">
                      {{el}}<em></em>
                    </li>
                </ul>
                <div class="btn">添加</div>
            </main>
        </section>
        <section class="warning-wrapper edit-info">
            <header class="blue-header">编辑信息</header>
            <main>
                <ul>
                    <li v-for="el in sendingChannel"
                        :class="{'blue-selected': el.key===releaseChannel}"
                        @click="changeSendingChannel(el)">
                      {{el.text}}
                    </li>
                    <li><textarea placeholder="请输入信息" v-model="releaseMsg" @change="updateReleaseMsg($event)"></textarea></li>
                </ul>
            </main>
        </section>
        <section class="warning-wrapper comfir-btn">
            <ul>
                <li class="btn">发送</li>
                <li class="btn">重置</li>
            </ul>
        </section>
    </div>
</template>

<script>
export default {
    props: ['affectedTownsNameList', 'regionData', 'affectedTownsIdList'],
    data() {
        return {
            msgData: {
                speaker: { value: 'SPEAKER', name: '大喇叭', selected: true, releaseMsg: '' },
                led: { value: 'LED', name: 'LED显示屏', selected: true, releaseMsg: '' },
                /*sms: { name: '短信', isSelected: true },
                alertSms: { name: '预警短信', isSelected: true },
                warnTV: { name: '应急频道', isSelected: true },
                weibo:{ name: '微博', isSelected: true },
                desktop: { name: '桌面插件', isSelected: true },
                qxClient: { name: '应急客户端', isSelected: true },
                wechat: { name: '微信', isSelected: true },
                email: { name: '电子邮箱', isSelected: true },
                weather: { name: '应急气象网', isSelected: true },
                fax: { name: '传真', isSelected: true },
                phone: { name: '12121外呼', isSelected: true },
                mailBox: { name: '12121信箱', isSelected: true }*/
            },
            selectTypeData:{
                subList:[],
                disasters:{
                    '水旱灾害':[
                        '洪水','内涝','水库重大险情','堤防重大险情','凌汛灾害','山洪灾害事件',
                        '农业干旱','城镇缺水','生态干旱','农村人畜饮水困难','其他水旱灾害',
                        ],
                    '气象灾害':[
                        '台风事件','龙卷风事件','暴雨事件','暴雪事件','寒潮事件','大风事件',
                        '沙尘暴事件','低温冻害事件','高温事件','热浪事件','干热风','下击暴流事件',
                        '雪崩事件','雷电事件','冰雹事件','霜冻事件','大雾事件','低空气切变事件',
                        '其他气象灾害事件'
                        ],
                    '地震灾害':[
                        '人工地震事件','天然地震事件','其它地震灾害',
                        ],
                    '地质灾害':[
                        '滑坡事件','泥石流事件','山体崩塌事件','地面塌陷事件','地裂缝事件',
                        '地面沉降事件','火山喷发事件','其它地址灾害事件',
                        ],
                    '海洋灾害事件':[
                        '海啸事件','风暴潮事件','海冰事件','巨浪事件','赤潮事件',
                        '其他海洋灾害事件'
                        ],
                    '生物灾害事件':[
                        '农业病害事件','农业虫害事件','农业草害事件','农业鼠害事件','森林病害事件',
                        '森林虫害事件','森林鼠害事件','农业转基因生物安全突发事件','林业转基因生物安全突发事件',
                        '林业有害植物事件','外来有害动植物威胁农业生产事件','外来有害动植物威胁林业生产事件',
                        '其它生物灾害'
                        ],
                    '森林草原灾害':[],
                    '其他自然灾害事件':[]
                }
            },
            disasterLevel: [
                { name: 'I级', color: 'red', selected: true },
                { name: 'Ⅱ级', color: 'orange', selected: false },
                { name: 'III级', color: 'yellow', selected: false },
                { name: 'IV级', color: 'blue', selected: false },
                //{ name: 'V级', color: 'grey', selected: false }
            ],
            selectedIndex: 0,
            selectedTownsData: [],
            selectedTownsIdArray: [],
            townsList: {},
            releaseMsg: '',
            releaseChannel: '',
            targetDevices: {}
        }
    },

    mounted() {
        //获取大喇叭数据
        this.$http.jsonp(`http://10.148.10.80:8111/dict/facilitiesGD/s4/${this.regionData.cityId},${this.regionData.countyId || ''},,,大喇叭;电子显示屏/JSONP/`)
          .then(response => {
            let data = response.data;
            if(typeof data === 'string' && /DB_ERR/.test(data))
              return;
            let targetDevices = {};
            for(let dev of data) {
              let type = dev.deviceType;
              if(!targetDevices.hasOwnProperty(type))
                targetDevices[type] = [];
              targetDevices[type].push(dev);
            }
            this.targetDevices = targetDevices;
          });
    },

    methods: {
        selectChange(ev){
            let target = ev.target;
            if(target.value != '请选择灾害类型') {
                this.selectTypeData.subList = this.selectTypeData.disasters[target.value];
            } else {
                this.selectTypeData.subList = [];
            }
        },
        toggleInfoChannel(target) {
            let len = 0;
            for(let i in this.msgData) {
                if(this.msgData[i].selected)
                    len++;
            }
            if(len === 1 && target.selected)
                return;
            target.selected = !target.selected;
        },
        changeLevel(el, index) {
            if(el.selected)
                return;

            for(let dl of this.disasterLevel) {
                dl.selected = dl.name === el.name;
            }

            this.selectedTownsData = Object.assign({}, this.affectedTownsNameList[index]);
            this.selectedTownsIdArray = this.affectedTownsIdList[index].concat([]);
        },
        updateReleaseMsg(ev) {
            const arr = this.sendingChannel.filter(channel => {
                return channel.selected;
            });
            const key = arr[0].key;
            this.msgData[key].releaseMsg = ev.target.value;
        },
        changeSendingChannel(el) {
            if(el.key === this.releaseChannel)
                return;
            this.releaseChannel = el.key;
            this.releaseMsg = this.msgData[el.key].releaseMsg;
        },
        deleteTown(el) {
            let townsList = this.selectedTownsData,
                townsIdList = this.selectedTownsIdArray;
            for(let i in townsList) {
                let index = townsList[i].indexOf(el);
                if(index !== -1)
                    townsList[i].splice(index, 1);
            }
        }
    },

    computed: {
        sendingChannel() {
            const msgData = this.msgData;
            let arr = [];
            for(let key in msgData){
                if(msgData[key].selected) {
                    arr.push({ key, text: msgData[key].name });
                }
            }
            this.releaseChannel = arr[0].key;
            return arr;
        },
        townArray() {
            let townsList = this.selectedTownsData;
            let townsArr = [];
            for(let i in townsList) {
                townsArr = townsArr.concat(townsList[i]);
            }
            return townsArr;
        },
        targetWayStat() {
            let townsIdArray = this.selectedTownsIdArray,
                targetDevices = this.targetDevices;
            let statInfo = {
                speakerSum: 0,
                LEDSum: 0
            };

            if(Object.keys(targetDevices).length && townsIdArray.length) {
                for(let i in targetDevices) {
                    let arr = targetDevices[i].filter(dev => townsIdArray.includes(Number(dev.townId)));
                    const key = i === 'TYFON' ? 'speakerSum' : 'LEDSum';
                    statInfo[key] = arr.length;
                }
            }

            return statInfo;
        }
    },

    watch: {
        affectedTownsNameList(nv) {
            let hasSelected = false;
            this.disasterLevel.forEach((dl, index) => {
                if(dl.selected) {
                    if(!nv[index] || !Object.keys(nv[index]).length || hasSelected)
                        dl.selected = false;
                    else {
                        hasSelected = true;
                        this.selectedTownsData = Object.assign({}, nv[index]);
                        this.selectedTownsIdArray = this.affectedTownsIdList[index].concat([]);
                    }
                } else {
                    if(nv[index] && Object.keys(nv[index]).length && !hasSelected) {
                        dl.selected = true;
                        this.selectedTownsData = Object.assign({}, nv[index]);
                        this.selectedTownsIdArray = this.affectedTownsIdList[index].concat([]);
                        hasSelected = true;
                    }
                }
            });
            if(!hasSelected) {
                this.selectedTownsData = {};
                this.selectedTownsIdArray = [];
            }
        }
    }
}
</script>

<style scoped lang="scss">
$mainColor: #299dff;
#modelWarningPanel {
    width: 100%;
    position: relative;
    font-size: 12px;
}

.warning-wrapper {
    width: 100%;
    position: relative;
    margin: 5px 0px;
    line-height: 30px;
    header {
        display: inline-block;
        vertical-align: top;
        padding: 0px 10px;
        color: rgb(72, 97, 138);
        font-weight: bold;
    }
    main {
        display: inline-block;
        vertical-align: top;
    }
}
.led-speaker {
    li {
        margin-right: 10px;
        span {
            color: #e04566;
            padding: 0 2px;
        }
    }
}
.disaster-type {
    .type-select {
        height: 20px;
        margin: 5px 0px;
        border: 1px solid #ddd;
        border-radius: 2px;
        outline: none;
    }
}
.info-channel {
    li {
        padding-right: 14px;
        margin-right: 5px;
        cursor: pointer;
        &:hover {
            color: $mainColor;
        }
    }
}
.disaster-level {
    li {
        padding-right: 14px;
        margin-right: 10px;
        cursor: pointer;
        span {
            em {
                margin: 0;
            }
        }
        span:first-of-type {
            display: inline-block;
            width: 12px;
            height: 12px;
            background: red;
            border: solid 1px #00479d;
            transform: translateY(2px);
        }
        span:last-of-type {
            line-height: 12px;
            display: inline-block;
        }
        &:hover {
            color: $mainColor;
        }
    }
}
.effected-area {
    margin-bottom: 0px;
    main {
        height: 90px;
        ul {
            width: 433px;
            height: 50px;
            max-height: 50px;
            position: relative;
            display: inline-block;
            padding-left: 10px;
            margin-top: 6px;
            line-height: 26px;
            overflow-y: auto;
            border: 1px solid #ddd;
            border-radius: 2px;
            li {
                padding-right: 14px;
                margin-right: 5px;
                cursor: pointer;
                em {
                    margin: 7px 0px 7px 2px;
                }
            }
        }
        .btn {
            width: 36px;
            height: 20px;
            position: absolute;
            right: 15px;
            line-height: 20px;
        }
    }
}
.edit-info {
    margin-top: 0px;
    padding-right: 10px;
    border: none;
    main {
        ul {
            width: 433px;
            position: relative;
            display: inline-block;
            li {
                margin-right: 5px;
                cursor: pointer;
                &:hover {
                    color: $mainColor;
                    text-decoration: underline;
                }
                textarea {
                    width: 433px;
                    resize: none;
                    height: 70px;
                    display: block;
                    border: solid 1px #ddd;
                    border-radius: 2px;
                    cursor: text;
                    box-sizing: border-box;
                    padding: 5px;
                    outline: none;
                }
            }
        }
    }
}
.comfir-btn {
    border: none;
    ul {
        margin-right: 6px;
        float: right;
        li {
            transform: translateY(-12px);
            width: 80px;
            margin-right: 8px;
            margin-top: 10px;
        }
    }
}
.btn {
    height: 30px;
    padding: 0;
    color: $mainColor;
    border: solid 1px $mainColor;
    text-align: center;
    border-radius: 3px;
    line-height: 30px;
    cursor: pointer;
    &:hover {
        color: #fff;
        background: $mainColor;
    }
}
.fl {
  float: left;
}
li {
  display: inline-block;
  font-size: 12px;
  color: #686868;
}
.blue-selected {
  color: $mainColor;
  em {
    width: 12px;
    height: 12px;
    position: absolute;
    display: inline-block;
    margin: 9px 0px 9px 2px;
    vertical-align: top;
    background: url(../../assets/mainMenu/modelIcon.png) -97px -6px no-repeat;
  }
}
</style>
