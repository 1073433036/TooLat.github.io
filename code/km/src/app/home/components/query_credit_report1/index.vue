<template>
  <div class="query-credit-report-page">
    <app-header title="信用报告"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="report-info">
            <div class="report-info-hd">
              信贷全流程报告
            </div>
            <div class="report-list">
              <div class="report-box">
                <div class="item z-table">
                  <div class="item-name">保镖ID</div>
                  <div class="item-info z-table-item">{{resultDesc.id}}</div>
                </div>
                <div class="item z-table">
                  <div class="item-name">报告时间</div>
                  <div class="item-info z-table-item">{{resultDesc.query_time}}</div>
                </div>
                <div class="item z-table">
                  <div class="item-name">查询人姓名</div>
                  <div class="item-info z-table-item">{{resultDesc.name}}</div>
                </div>
                <div class="item z-table">
                  <div class="item-name">查询人手机</div>
                  <div class="item-info z-table-item">{{resultDesc.mobile}}</div>
                </div>
                <div class="item z-table">
                  <div class="item-name">查询人身份证</div>
                  <div class="item-info z-table-item">{{resultDesc.id_number}}</div>
                </div>
              </div>

            </div>

            <div class="ad-score z-table">
              <div class="score-left">
                <div class="score-bg">
                  <div class="score-num">20</div>
                </div>
                <div class="score-title"></div>
              </div>
              <div class="score-info z-table-item">
                评分区间1-100分，分数越高风险越高，本评分基于当前时点的数据资料进行风险识别判断计算。
              </div>
            </div>
            <div class="result-info">
              <div class="result-title fsc-blue">
                信息查询结果
              </div>
              <div class="result-title">
                <div class="z-table">
                  <div class="title z-table-item">检测项</div>
                  <div class="assace">
                    <i class="risk high-risk-icon"></i>存在风险
                  </div>
                </div>
              </div>
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title fsc-red z-table-item">申请记录</div>
                  <div class="assace">
                    <span class="risk-yes">否</span>
                  </div>
                </div>
              </div>

              <div class="analysis">
                <div class="analysis-hd">办理信用卡申请记录</div>
                <div class="analysis-list" >
                  <div class="item z-flex">
                    <div class="item-name">时间</div>
                    <div class="item-info z-flex-item">申请信用卡类型</div>
                  </div>
                  <div class="item z-flex" v-for="(item,index) in resultDesc.result_info.card.apply_list">
                    <div class="item-name">{{item.create_at}}</div>
                    <div class="item-info z-flex-item">{{item.name}}</div>
                  </div>
                </div>
              </div>
              <div class="analysis">
                <div class="analysis-hd">信用卡下卡记录</div>
                <div class="analysis-list" >
                  <div class="item z-flex">
                    <div class="item-name z-flex-item bg-gray">时间</div>
                    <div class="item-info z-flex-item">申请信用卡类型</div>
                    <div class="item-info z-flex-item">下卡状态</div>
                  </div>
                  <div class="item z-flex" v-for="(item,index) in resultDesc.result_info.card.real_list">
                    <div class="item-name z-flex-item bg-gray">{{item.create_at}}</div>
                    <div class="item-info z-flex-item">{{item.name}}</div>
                    <div class="item-info z-flex-item">{{item.status_val}}</div>
                  </div>
                </div>
              </div>
              <!--<div class="analysis">-->
                <!--<div class="analysis-hd">归属地解析</div>-->
                <!--<div class="analysis-list">-->
                  <!--<div class="item z-flex">-->
                    <!--<div class="item-name">身份证所属地</div>-->
                    <!--<div class="item-info z-flex-item">山东省枣庄市峄城区</div>-->
                  <!--</div>-->
                  <!--<div class="item z-flex">-->
                    <!--<div class="item-name">手机所属地</div>-->
                    <!--<div class="item-info z-flex-item">河北省秦皇岛市</div>-->
                  <!--</div>-->
                  <!--<div class="item z-flex">-->
                    <!--<div class="item-name">IP所属地</div>-->
                    <!--<div class="item-info z-flex-item">中国广东广州市</div>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</div>-->

              <!--<div class="device">-->
                <!--<div class="device-hd">-->
                  <!--<div class="result-title  bg-gray">-->
                    <!--<div class="z-table">-->
                      <!--<div class="title fsc-red z-table-item">设备信息</div>-->
                      <!--<div class="assace">-->
                        <!--<span class="risk-yes">否</span>-->
                      <!--</div>-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</div>-->
                <!--<div class="device-list">-->
                  <!--<div class="list-item z-table">-->
                    <!--<div class="item z-table-item bg-gray">设备信息</div>-->
                    <!--<div class="item z-table-item"></div>-->
                    <!--<div class="item z-table-item bg-gray"></div>-->
                    <!--<div class="item z-table-item"></div>-->
                  <!--</div>-->
                  <!--<div class="list-item z-table">-->
                    <!--<div class="item z-table-item bg-gray">启用Cookie</div>-->
                    <!--<div class="item z-table-item">是</div>-->
                    <!--<div class="item z-table-item bg-gray">操作系统</div>-->
                    <!--<div class="item z-table-item">Windows</div>-->
                  <!--</div>-->
                  <!--<div class="list-item z-table">-->
                    <!--<div class="item z-table-item bg-gray">真实IP</div>-->
                    <!--<div class="item z-table-item">116.23.231.243</div>-->
                    <!--<div class="item z-table-item bg-gray">集成sdk版本号</div>-->
                    <!--<div class="item z-table-item">0.0.3</div>-->
                  <!--</div>-->
                  <!--<div class="list-item z-table">-->
                    <!--<div class="item z-table-item bg-gray">tokenid</div>-->
                    <!--<div class="item z-table-item">psyv3rrsa0w0000000</div>-->
                    <!--<div class="item z-table-item bg-gray">设备ID</div>-->
                    <!--<div class="item z-table-item">023afe6ce10d103f337570cf5f4bbcff</div>-->
                  <!--</div>-->
                  <!--<div class="list-item z-table">-->
                    <!--<div class="item z-table-item bg-gray">浏览器</div>-->
                    <!--<div class="item z-table-item">Mozilla/5.0(Macintosh;  Intel MacOS X 10_13_2)-->
                      <!--AppleWebKit/537.36(KHTML, like Gecko)  Chrome/-->
                      <!--63.0.3239.132 Safari/537.36</div>-->
                    <!--<div class="item z-table-item bg-gray">智能ID</div>-->
                    <!--<div class="item z-table-item">s_8c0309c3349274f885baf93ad9a81761</div>-->
                  <!--</div>-->
                  <!--<div class="list-item z-table">-->
                    <!--<div class="item z-table-item bg-gray">帆布指纹</div>-->
                    <!--<div class="item z-table-item">e829b2a1468bc3561ec6abb045528fcc</div>-->
                    <!--<div class="item z-table-item bg-gray">计算器语言</div>-->
                    <!--<div class="item z-table-item">zh-CN^^zh-CN,zh^^-^^-^^-</div>-->
                  <!--</div>-->
                  <!--<div class="list-item z-table">-->
                    <!--<div class="item z-table-item bg-gray">屏幕分辨率</div>-->
                    <!--<div class="item z-table-item">1440^^900^^-^^-</div>-->
                    <!--<div class="item z-table-item bg-gray">插件列表</div>-->
                    <!--<div class="item z-table-item">012df69e7ede2a80549273685d8e6b43</div>-->
                  <!--</div>-->
                  <!--<div class="list-item z-table">-->
                    <!--<div class="item z-table-item bg-gray">启用Flash</div>-->
                    <!--<div class="item z-table-item">否</div>-->
                    <!--<div class="item z-table-item bg-gray">请求来源</div>-->
                    <!--<div class="item z-table-item">https://x.tongdun.cn/#/device/deviceTrial</div>-->
                  <!--</div>-->
                  <!--<div class="list-item z-table">-->
                    <!--<div class="item z-table-item bg-gray">浏览器类型</div>-->
                    <!--<div class="item z-table-item">chrome</div>-->
                    <!--<div class="item z-table-item bg-gray">TCP协议线特征对应的操作系统</div>-->
                    <!--<div class="item z-table-item"></div>-->
                  <!--</div>-->
                  <!--<div class="list-item z-table">-->
                    <!--<div class="item z-table-item bg-gray">浏览器版本</div>-->
                    <!--<div class="item z-table-item">63.0.3239.132</div>-->
                    <!--<div class="item z-table-item bg-gray">字体</div>-->
                    <!--<div class="item z-table-item"></div>-->
                  <!--</div>-->
                  <!--<div class="list-item z-table">-->
                    <!--<div class="item z-table-item bg-gray">浏览器header</div>-->
                    <!--<div class="item z-table-item">*/*</div>-->
                    <!--<div class="item z-table-item bg-gray">浏览器header编码类型</div>-->
                    <!--<div class="item z-table-item">gzip, deflate, br</div>-->
                  <!--</div>-->
                  <!--<div class="list-item z-table">-->
                    <!--<div class="item z-table-item bg-gray">浏览器header语言</div>-->
                    <!--<div class="item z-table-item">zh-CN,zh;q=0.9</div>-->
                    <!--<div class="item z-table-item bg-gray">类型</div>-->
                    <!--<div class="item z-table-item">480</div>-->
                  <!--</div>-->
                  <!--<div class="list-item z-table">-->
                    <!--<div class="item z-table-item bg-gray">开启Debug模式错误原因</div>-->
                    <!--<div class="item z-table-item">否</div>-->
                    <!--<div class="item z-table-item bg-gray">时区</div>-->
                    <!--<div class="item z-table-item">是</div>-->
                  <!--</div>-->


                <!--</div>-->
              <!--</div>-->

            </div>


          </div>
          <div class="report-info">
            <div class="result-info">
              <div class="result-title">
                信息查询结果
              </div>
              <div class="car-report ">
                 <div class="z-flex item">
                   <div class="item-name">车主姓名:</div>
                   <div class="item-info z-flex-item">{{resultDesc.name}}</div>
                 </div>
                <div class="z-flex item">
                  <div class="item-name">车辆识别代码：</div>
                  <div class="item-info z-flex-item">{{resultDesc.result_info.car.info.car_drive_number}}</div>
                </div>
                <div class="z-flex item">
                  <div class="item-name">车牌号码：</div>
                  <div class="item-info z-flex-item">{{resultDesc.result_info.car.info.car_prefix}}{{resultDesc.result_info.car.info.car_number}}</div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">近3个月汽车违章记录</div>
                <div class="analysis-list">
                  <div class="item z-table" v-for="(item,index) in resultDesc.result_info.car.peccancy">
                    <div class="item-name z-table-item">{{item.time}}</div>
                    <div class="item-info z-table-item">
                      <div class="title">{{item.location}}</div>
                      <div class="sm-title">{{item.reason}}</div>
                      <div class="info">
                        <span>扣</span> {{item.degree}}分  <span>罚</span> {{item.count}}元
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
          <div class="report-info">
            <div class="result-info">
              <div class="result-title">
                贷前反欺诈报告
              </div>
              <!--proposerLowRisk-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.proposerHighRisk.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace fsc-red">
                        风险分数:{{listData.proposerHighRisk.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.proposerHighRisk.risk_detail">
                  <div class="item z-table">
                    <div class="item-name z-table-item">类型描述</div>
                    <div class="item-info z-table-item">
                      {{item.hit_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">风险类型</div>
                    <div class="item-info z-table-item">
                      {{item.fraud_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">描述</div>
                    <div class="item-info z-table-item">
                      {{item.description}}
                    </div>
                  </div>
                </div>
              </div>
              <!--proposerHighRisk-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.proposerLowRisk.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace fsc-red">
                        风险分数:{{listData.proposerLowRisk.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.proposerLowRisk.risk_detail">
                  <div class="item z-table">
                    <div class="item-name z-table-item">类型描述</div>
                    <div class="item-info z-table-item">
                      {{item.hit_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">风险类型</div>
                    <div class="item-info z-table-item">
                      {{item.fraud_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">描述</div>
                    <div class="item-info z-table-item">
                      {{item.description}}
                    </div>
                  </div>
                </div>
              </div>
              <!--idCardCourtDiscredit-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.idCardCourtDiscredit.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace fsc-red">
                        风险分数:{{listData.idCardCourtDiscredit.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.idCardCourtDiscredit.risk_detail">
                  <div class="item z-table">
                    <div class="item-name z-table-item">类型描述</div>
                    <div class="item-info z-table-item">
                      {{item.hit_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">风险类型</div>
                    <div class="item-info z-table-item">
                      {{item.fraud_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">描述</div>
                    <div class="item-info z-table-item">
                      {{item.description}}
                    </div>
                  </div>
                </div>
              </div>
             <!--idCardHighRiskOrder-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.idCardHighRiskOrder.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace fsc-red">
                        风险分数:{{listData.idCardHighRiskOrder.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.idCardHighRiskOrder.risk_detail">
                  <div class="item z-table">
                    <div class="item-name z-table-item">类型描述</div>
                    <div class="item-info z-table-item">
                      {{item.hit_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">风险类型</div>
                    <div class="item-info z-table-item">
                      {{item.fraud_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">描述</div>
                    <div class="item-info z-table-item">
                      {{item.description}}
                    </div>
                  </div>
                </div>
              </div>
              <!--idCardHighRisk-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.idCardHighRisk.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace fsc-red">
                        风险分数:{{listData.idCardHighRisk.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.idCardHighRisk.risk_detail">
                  <div class="item z-table">
                    <div class="item-name z-table-item">类型描述</div>
                    <div class="item-info z-table-item">
                      {{item.hit_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">风险类型</div>
                    <div class="item-info z-table-item">
                      {{item.fraud_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">描述</div>
                    <div class="item-info z-table-item">
                      {{item.description}}
                    </div>
                  </div>
                </div>
              </div>
              <!--idCardCrime-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.idCardCrime.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace fsc-red">
                        风险分数:{{listData.idCardCrime.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.idCardCrime.risk_detail">
                  <div class="item z-table">
                    <div class="item-name z-table-item">类型描述</div>
                    <div class="item-info z-table-item">
                      {{item.hit_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">风险类型</div>
                    <div class="item-info z-table-item">
                      {{item.fraud_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">描述</div>
                    <div class="item-info z-table-item">
                      {{item.description}}
                    </div>
                  </div>
                </div>
              </div>
            <!--idCardCourtCarry-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.idCardCourtCarry.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace fsc-red">
                        风险分数:{{listData.idCardCourtCarry.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.idCardCourtCarry.risk_detail">
                  <div class="item z-table">
                    <div class="item-name z-table-item">类型描述</div>
                    <div class="item-info z-table-item">
                      {{item.hit_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">风险类型</div>
                    <div class="item-info z-table-item">
                      {{item.fraud_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">描述</div>
                    <div class="item-info z-table-item">
                      {{item.description}}
                    </div>
                  </div>
                </div>
              </div>
              <!--idCardTuitionArrears-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.idCardTuitionArrears.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace  fsc-red">
                        风险分数:{{listData.idCardTuitionArrears.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.idCardTuitionArrears.risk_detail">
                  <div class="item z-table">
                    <div class="item-name z-table-item">类型描述</div>
                    <div class="item-info z-table-item">
                      {{item.hit_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">风险类型</div>
                    <div class="item-info z-table-item">
                      {{item.fraud_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">描述</div>
                    <div class="item-info z-table-item">
                      {{item.description}}
                    </div>
                  </div>
                </div>
              </div>
              <!--idCardOverdueCredit-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.idCardOverdueCredit.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report" v-for="(item,index) in listData.idCardOverdueCredit.risk_detail">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace fsc-red">
                        风险分数:{{listData.idCardOverdueCredit.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" >
                  <div class="item z-table">
                    <div class="item-name z-table-item">逾期次数</div>
                    <div class="item-info z-table-item">
                      {{item.discredit_times}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">逾期金额</div>
                    <div class="item-info z-table-item" >
                      <div v-for="(key,val) in item.overdue_details">{{key.overdue_amount_range}}</div>

                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">逾期天数</div>
                    <div class="item-info z-table-item" >
                      <div v-for="(key,val) in item.overdue_details">{{key.overdue_day_range}}</div>
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">逾期入库时间</div>
                    <div class="item-info z-table-item" >
                      <div v-for="(key,val) in item.overdue_details">{{key.overdue_time}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <!--idCardLeaseDefault-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.idCardLeaseDefault.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace fsc-red">
                        风险分数:{{listData.idCardLeaseDefault.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.idCardLeaseDefault.risk_detail">
                  <div class="item z-table">
                    <div class="item-name z-table-item">类型描述</div>
                    <div class="item-info z-table-item">
                      {{item.hit_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">风险类型</div>
                    <div class="item-info z-table-item">
                      {{item.fraud_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">描述</div>
                    <div class="item-info z-table-item">
                      {{item.description}}
                    </div>
                  </div>
                </div>
              </div>
            <!--idCardCourtCase-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.idCardCourtCase.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace fsc-red">
                        风险分数:{{listData.idCardCourtCase.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.idCardCourtCase.risk_detail">
                  <div class="item z-table">
                    <div class="item-name z-table-item">类型描述</div>
                    <div class="item-info z-table-item">
                      {{item.hit_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">风险类型</div>
                    <div class="item-info z-table-item">
                      {{item.fraud_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">描述</div>
                    <div class="item-info z-table-item">
                      {{item.description}}
                    </div>
                  </div>
                </div>
              </div>
              <!--idCardOverdueCreditVague-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.idCardOverdueCreditVague.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace fsc-red">
                        风险分数:{{listData.idCardOverdueCreditVague.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.idCardOverdueCreditVague.risk_detail">
                  <div class="" v-for="(key,val) in item.fuzzy_list_details">
                    <div class="item z-table">
                      <div class="item-name z-table-item">类型描述</div>
                      <div class="item-info z-table-item">
                        {{key.fraud_type_display_name}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">风险类型</div>
                      <div class="item-info z-table-item">
                        {{key.fuzzy_id_number}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">描述</div>
                      <div class="item-info z-table-item">
                        {{key.fuzzy_name}}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <!--idCardCourtDiscreditVague-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.idCardCourtDiscreditVague.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace fsc-red">
                        风险分数:{{listData.idCardCourtDiscreditVague.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.idCardCourtDiscreditVague.risk_detail">
                  <div class="" v-for="(key,val) in item.fuzzy_list_details">
                    <div class="item z-table">
                      <div class="item-name z-table-item">类型描述</div>
                      <div class="item-info z-table-item">
                        {{key.fraud_type_display_name}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">风险类型</div>
                      <div class="item-info z-table-item">
                        {{key.fuzzy_id_number}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">描述</div>
                      <div class="item-info z-table-item">
                        {{key.fuzzy_name}}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <!--idCardCourtCarryVague-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.idCardCourtCarryVague.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace fsc-red">
                        风险分数:{{listData.idCardCourtCarryVague.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.idCardCourtCarryVague.risk_detail">
                  <div class="" v-for="(key,val) in item.fuzzy_list_details">
                    <div class="item z-table">
                      <div class="item-name z-table-item">类型描述</div>
                      <div class="item-info z-table-item">
                        {{key.fraud_type_display_name}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">风险类型</div>
                      <div class="item-info z-table-item">
                        {{key.fuzzy_id_number}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">描述</div>
                      <div class="item-info z-table-item">
                        {{key.fuzzy_name}}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <!--idCardCourtCaseVague-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.idCardCourtCaseVague.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace fsc-red">
                        风险分数:{{listData.idCardCourtCaseVague.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.idCardCourtCaseVague.risk_detail">
                  <div class="" v-for="(key,val) in item.fuzzy_list_details">
                    <div class="item z-table">
                      <div class="item-name z-table-item">类型描述</div>
                      <div class="item-info z-table-item">
                        {{key.fraud_type_display_name}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">风险类型</div>
                      <div class="item-info z-table-item">
                        {{key.fuzzy_id_number}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">描述</div>
                      <div class="item-info z-table-item">
                        {{key.fuzzy_name}}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <!--idCardArrearsCompany-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.idCardArrearsCompany.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace  fsc-red">
                        风险分数:{{listData.idCardArrearsCompany.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.idCardArrearsCompany.risk_detail">
                  <div class="item z-table">
                    <div class="item-name z-table-item">类型描述</div>
                    <div class="item-info z-table-item">
                      {{item.hit_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">风险类型</div>
                    <div class="item-info z-table-item">
                      {{item.fraud_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">描述</div>
                    <div class="item-info z-table-item">
                      {{item.description}}
                    </div>
                  </div>
                </div>
              </div>
              <!--idCardIntentionalViolation-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.idCardIntentionalViolation.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace  fsc-red">
                        风险分数:{{listData.idCardIntentionalViolation.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.idCardIntentionalViolation.risk_detail">
                  <div class="item z-table">
                    <div class="item-name z-table-item">类型描述</div>
                    <div class="item-info z-table-item">
                      {{item.hit_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">风险类型</div>
                    <div class="item-info z-table-item">
                      {{item.fraud_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">描述</div>
                    <div class="item-info z-table-item">
                      {{item.description}}
                    </div>
                  </div>
                </div>
              </div>
              <!--idCardArrears-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.idCardArrears.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace  fsc-red">
                        风险分数:{{listData.idCardArrears.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.idCardArrears.risk_detail">
                  <div class="item z-table">
                    <div class="item-name z-table-item">类型描述</div>
                    <div class="item-info z-table-item">
                      {{item.hit_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">风险类型</div>
                    <div class="item-info z-table-item">
                      {{item.fraud_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">描述</div>
                    <div class="item-info z-table-item">
                      {{item.description}}
                    </div>
                  </div>
                </div>
              </div>
              <!--idCardArrearsCompanyArrears-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.idCardArrearsCompanyArrears.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace  fsc-red">
                        风险分数:{{listData.idCardArrearsCompanyArrears.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.idCardArrearsCompanyArrears.risk_detail">
                  <div class="item z-table">
                    <div class="item-name z-table-item">类型描述</div>
                    <div class="item-info z-table-item">
                      {{item.hit_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">风险类型</div>
                    <div class="item-info z-table-item">
                      {{item.fraud_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">描述</div>
                    <div class="item-info z-table-item">
                      {{item.description}}
                    </div>
                  </div>
                </div>
              </div>
              <!--idCardOverdueCreditStill-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.idCardOverdueCreditStill.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace  fsc-red">
                        风险分数:{{listData.idCardOverdueCreditStill.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.idCardOverdueCreditStill.risk_detail">
                  <div class="item z-table">
                    <div class="item-name z-table-item">类型描述</div>
                    <div class="item-info z-table-item">
                      {{item.hit_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">风险类型</div>
                    <div class="item-info z-table-item">
                      {{item.fraud_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">描述</div>
                    <div class="item-info z-table-item">
                      {{item.description}}
                    </div>
                  </div>
                </div>
              </div>
              <!--phoneFalse-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.phoneFalse.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace  fsc-red">
                        风险分数:{{listData.phoneFalse.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.phoneFalse.risk_detail">
                  <div class="item z-table">
                    <div class="item-name z-table-item">类型描述</div>
                    <div class="item-info z-table-item">
                      {{item.hit_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">风险类型</div>
                    <div class="item-info z-table-item">
                      {{item.fraud_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">描述</div>
                    <div class="item-info z-table-item">
                      {{item.description}}
                    </div>
                  </div>
                </div>
              </div>
              <!--phoneTrumpet-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.phoneTrumpet.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace  fsc-red">
                        风险分数:{{listData.phoneTrumpet.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.phoneTrumpet.risk_detail">
                  <div class="item z-table">
                    <div class="item-name z-table-item">类型描述</div>
                    <div class="item-info z-table-item">
                      {{item.hit_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">风险类型</div>
                    <div class="item-info z-table-item">
                      {{item.fraud_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">描述</div>
                    <div class="item-info z-table-item">
                      {{item.description}}
                    </div>
                  </div>
                </div>
              </div>
              <!--phoneHarassment-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.phoneHarassment.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace  fsc-red">
                        风险分数:{{listData.phoneHarassment.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.phoneHarassment.risk_detail">
                  <div class="item z-table">
                    <div class="item-name z-table-item">类型描述</div>
                    <div class="item-info z-table-item">
                      {{item.hit_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">风险类型</div>
                    <div class="item-info z-table-item">
                      {{item.fraud_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">描述</div>
                    <div class="item-info z-table-item">
                      {{item.description}}
                    </div>
                  </div>
                </div>
              </div>
              <!--phoneHighRisk-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.phoneHighRisk.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace  fsc-red">
                        风险分数:{{listData.phoneHighRisk.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.phoneHighRisk.risk_detail">
                  <div class="item z-table">
                    <div class="item-name z-table-item">类型描述</div>
                    <div class="item-info z-table-item">
                      {{item.hit_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">风险类型</div>
                    <div class="item-info z-table-item">
                      {{item.fraud_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">描述</div>
                    <div class="item-info z-table-item">
                      {{item.description}}
                    </div>
                  </div>
                </div>
              </div>
              <!--phoneOverdueCredit-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.phoneOverdueCredit.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report" v-for="(item,index) in listData.phoneOverdueCredit.risk_detail">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace  fsc-red">
                        风险分数:{{listData.phoneOverdueCredit.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" >
                  <div class="item z-table">
                    <div class="item-name z-table-item">逾期次数</div>
                    <div class="item-info z-table-item">
                      {{item.discredit_times}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">逾期金额</div>
                    <div class="item-info z-table-item" >
                      <div v-for="(key,val) in item.overdue_details">{{key.overdue_amount_range}}</div>

                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">逾期天数</div>
                    <div class="item-info z-table-item" >
                      <div v-for="(key,val) in item.overdue_details">{{key.overdue_day_range}}</div>
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">逾期入库时间</div>
                    <div class="item-info z-table-item" >
                      <div v-for="(key,val) in item.overdue_details">{{key.overdue_time}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <!--phoneLeaseDefault-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.phoneLeaseDefault.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace  fsc-red">
                        风险分数:{{listData.phoneLeaseDefault.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.phoneLeaseDefault.risk_detail">
                  <div class="item z-table">
                    <div class="item-name z-table-item">类型描述</div>
                    <div class="item-info z-table-item">
                      {{item.hit_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">风险类型</div>
                    <div class="item-info z-table-item">
                      {{item.fraud_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">描述</div>
                    <div class="item-info z-table-item">
                      {{item.description}}
                    </div>
                  </div>
                </div>
              </div>
              <!--phoneFill-->
              <!--phoneArrearsCompany-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.phoneArrearsCompany.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace  fsc-red">
                        风险分数:{{listData.phoneArrearsCompany.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.phoneArrearsCompany.risk_detail">
                  <div class="item z-table">
                    <div class="item-name z-table-item">类型描述</div>
                    <div class="item-info z-table-item">
                      {{item.hit_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">风险类型</div>
                    <div class="item-info z-table-item">
                      {{item.fraud_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">描述</div>
                    <div class="item-info z-table-item">
                      {{item.description}}
                    </div>
                  </div>
                </div>
              </div>
              <!--phoneOverdueCreditStill-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.phoneOverdueCreditStill.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace  fsc-red">
                        风险分数:{{listData.phoneOverdueCreditStill.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.phoneOverdueCreditStill.risk_detail">
                  <div class="item z-table">
                    <div class="item-name z-table-item">类型描述</div>
                    <div class="item-info z-table-item">
                      {{item.hit_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">风险类型</div>
                    <div class="item-info z-table-item">
                      {{item.fraud_type_display_name}}
                    </div>
                  </div>
                  <div class="item z-table">
                    <div class="item-name z-table-item">描述</div>
                    <div class="item-info z-table-item">
                      {{item.description}}
                    </div>
                  </div>
                </div>
              </div>
              <!--idCardAssociation-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.idCardAssociation.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis list-box-pd">
                <div class="analysis-hd bg-t">
                  <div class="title fsc-red">
                    频度详情
                  </div>
                </div>
                <div class="analysis-list" v-for="(item , index) in listData.idCardAssociation.risk_detail">
                  <div class="item z-table" v-for="(key , val) in item.frequency_detail_list">
                    <div class="item-info z-t-l z-table-item" >
                      {{key.detail}}
                      <div class="" v-for="(k , v) in key.data">{{k}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <!--idAssociationCard-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.idAssociationCard.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis list-box-pd">
                <div class="analysis-hd bg-t">
                  <div class="title fsc-red">
                    频度详情
                  </div>
                </div>
                <div class="analysis-list" v-for="(item , index) in listData.idAssociationCard.risk_detail">
                  <div class="item z-table" v-for="(key , val) in item.frequency_detail_list">
                    <div class="item-info z-t-l z-table-item" >
                      {{key.detail}}
                      <div class="" v-for="(k , v) in key.data">{{k}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <!--idCardMany-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.idCardMany.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis list-box-pd">
                <div class="analysis-hd bg-t">
                  <div class="title fsc-red">
                    频度详情
                  </div>
                </div>
                <div class="analysis-list" v-for="(item , index) in listData.idCardMany.risk_detail">
                  <div class="item z-table" v-for="(key , val) in item.cross_frequency_detail_list">
                    <div class="item-info z-t-l z-table-item" >
                      {{key.detail}}
                    </div>
                  </div>
                </div>
              </div>
              <!--phoneMany-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.phoneMany.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis list-box-pd">
                <div class="analysis-hd bg-t">
                  <div class="title fsc-red">
                    频度详情
                  </div>
                </div>
                <div class="analysis-list" v-for="(item , index) in listData.phoneMany.risk_detail">
                  <div class="item z-table" v-for="(key , val) in item.cross_frequency_detail_list">
                    <div class="item-info z-t-l z-table-item" >
                      {{key.detail}}
                    </div>
                  </div>
                </div>
              </div>
              <!--idCardDayMany-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.idCardDayMany.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis list-box-pd">
                <div class="analysis-hd bg-t">
                  <div class="title fsc-red">
                    频度详情
                  </div>
                </div>
                <div class="analysis-list" v-for="(item , index) in listData.idCardDayMany.risk_detail">
                  <div class="item z-table" v-for="(key , val) in item.frequency_detail_list">
                    <div class="item-info z-t-l z-table-item" >
                      {{key.detail}}
                    </div>
                  </div>
                </div>
              </div>
              <!--idCardDayLoan-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.idCardDayLoan.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace  fsc-red">
                        风险分数:{{listData.idCardDayLoan.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.idCardDayLoan.risk_detail">
                  <div  v-for="(key,val) in item.platform_detail_dimension">
                    <div class="item z-table">
                      <div class="item-name z-table-item">维度</div>
                      <div class="item-info z-table-item">
                        {{key.dimension}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">数量</div>
                      <div class="item-info z-table-item">
                        {{key.count}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">详情</div>
                      <div class="item-info z-table-item">
                        <div class="" v-for="(k,i) in key.detail">
                          {{k.industry_display_name}}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--monthLoan-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.monthLoan.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace  fsc-red">
                        风险分数:{{listData.monthLoan.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.monthLoan.risk_detail">
                  <div  v-for="(key,val) in item.platform_detail_dimension">
                    <div class="item z-table">
                      <div class="item-name z-table-item">维度</div>
                      <div class="item-info z-table-item">
                        {{key.dimension}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">数量</div>
                      <div class="item-info z-table-item">
                        {{key.count}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">详情</div>
                      <div class="item-info z-table-item">
                        <div class="" v-for="(k,i) in key.detail">
                          {{k.industry_display_name}}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--monthsLoan-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.monthsLoan.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace  fsc-red">
                        风险分数:{{listData.monthsLoan.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.monthsLoan.risk_detail">
                  <div  v-for="(key,val) in item.platform_detail_dimension">
                    <div class="item z-table">
                      <div class="item-name z-table-item">维度</div>
                      <div class="item-info z-table-item">
                        {{key.dimension}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">数量</div>
                      <div class="item-info z-table-item">
                        {{key.count}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">详情</div>
                      <div class="item-info z-table-item">
                        <div class="" v-for="(k,i) in key.detail">
                          {{k.industry_display_name}}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--monthsCredit-->
              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.monthsCredit.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report">
                <div class="analysis-hd">
                  <div class="result-title">
                    <div class="z-table">
                      <div class="title z-table-item fsc-red">风险异常</div>
                      <div class="assace  fsc-red">
                        风险分数:{{listData.monthsCredit.score}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="analysis-list" v-for="(item,index) in listData.monthsCredit.risk_detail">
                  <div  v-for="(key,val) in item.platform_detail_dimension">
                    <div class="item z-table">
                      <div class="item-name z-table-item">维度</div>
                      <div class="item-info z-table-item">
                        {{key.dimension}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">数量</div>
                      <div class="item-info z-table-item">
                        {{key.count}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">详情</div>
                      <div class="item-info z-table-item">
                        <div class="" v-for="(k,i) in key.detail">
                          {{k.industry_display_name}}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
          <div class="report-info">
            <div class="result-info">
              <div class="result-title">
                贷前反欺诈报告的附件:法院详情
              </div>

              <div class="result-title  bg-gray">
                <div class="z-table">
                  <div class="title  z-table-item">{{listData.idCardCourtDiscredit.risk_name}}</div>
                  <div class="assace">
                    <span class="risk-no">是</span>
                  </div>
                </div>
              </div>
              <div class="analysis car-report"  v-for="(item,index) in listData.idCardCourtDiscredit.risk_detail">
                <div class="analysis-list mb-15" v-for="(key,val) in item.court_details">
                  <div  >
                    <div class="item z-table">
                      <div class="item-name z-table-item">风险类型</div>
                      <div class="item-info z-table-item">
                        {{key.fraud_type_display_name}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">命中属性值</div>
                      <div class="item-info z-table-item">
                        {{key.value}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">执行法院</div>
                      <div class="item-info z-table-item">
                        {{key.specific_circumstances}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">立案时间</div>
                      <div class="item-info z-table-item">
                        {{key.case_date}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">做出依据执行法院</div>
                      <div class="item-info z-table-item">
                        {{key.evidence_court}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">被执行人履行情况</div>
                      <div class="item-info z-table-item">
                        {{key.carry_out}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="result-info">
              <div class="analysis car-report"  v-for="(item,index) in listData.idCardCourtCarry.risk_detail">
                <div class="analysis-list mb-15" v-for="(key,val) in item.court_details">
                  <div  >
                    <div class="item z-table">
                      <div class="item-name z-table-item">风险类型</div>
                      <div class="item-info z-table-item">
                        {{key.fraud_type}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">命中属性值</div>
                      <div class="item-info z-table-item">
                        {{key.value}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">执行法院</div>
                      <div class="item-info z-table-item">
                        {{key.execute_court}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">立案时间</div>
                      <div class="item-info z-table-item">
                        {{key.case_date}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">做出依据执行法院</div>
                      <div class="item-info z-table-item">
                        {{key.evidence_court}}
                      </div>
                    </div>
                    <div class="item z-table">
                      <div class="item-name z-table-item">被执行人</div>
                      <div class="item-info z-table-item">
                        {{key.executed_name}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div class="report-info">
            <div class="result-info">
              <div class="result-title">
                报告数据说明
              </div>
            <div class="report-ad">
              <p>贷前报告数据查询报告由本人授权查询，数据来源包括芝麻信用，各大运营商，各类征信平台，各大网贷平台卡盟科技只做大数据信息的获取及分析，不对原始信息做任何修改，报告仅供参考使用，如果您对报告有异议，出于对平台隐私保护，卡盟科技不做任何解释。</p>
              <p>由于报表生成需要处理大量数据，受网络波动等因素的影响，可能会造成部分数据获取不完善的情况，对此我们深感歉意，同时您的理解和支持</p>
            </div>
            </div>


          </div>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
