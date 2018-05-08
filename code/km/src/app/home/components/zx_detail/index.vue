<template>
  <div class="zx-detail-page">
    <app-header title="个人征信记录"></app-header>

    <div class="wrapper">
      <div class="controller">
        <table width="980" cellspacing="0" cellpadding="0" border="0" align="center">
          <tbody>
            <br>

            <tr>
              <td>
                <table width="980" cellspacing="0" border="0" align="center">
                  <tbody>
                    <tr>
                      <th colspan="6" align="center">
                        <div class="h1" align="center">
                          <strong>个人信用报告</strong>
                        </div>
                      </th>
                    </tr>
                    <br>
                    <tr>
                      <td colspan="2" width="377" align="left">
                        <strong class="p">报告编号： {{ formTemp.reportInfo.queryTime }} </strong>
                      </td>
                      <td colspan="2" width="300" align="left">
                        <strong class="p">查询时间：{{ formTemp.reportInfo.reportId }} </strong>
                      </td>
                      <td colspan="2" width="300" align="right">
                        <strong class="p">报告时间：{{ formTemp.reportInfo.reportTime }} </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table width="980" cellspacing="0" border="0" align="center">
                  <tbody>
                    <tr>
                      <td width="170" align="left">
                        <strong class="p">姓名： {{ formTemp.userInfo.name }} </strong>
                      </td>
                      <td width="167" align="left">
                        <strong class="p">证件类型：{{ formTemp.userInfo.cardType }} </strong>
                      </td>
                      <td width="269" align="right">
                        <strong class="p">证件号码：{{ formTemp.userInfo.cardNo }} </strong>
                      </td>
                      <td width="133" align="right">
                        <strong class="p">{{ formTemp.userInfo.isMarried }}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br>
                <table width="980" cellspacing="0" cellpadding="0" bordercolor="#e5e1e1" border="1" align="center" height="55">
                  <tbody>
                    <tr bordercolor="#a7dfed" bgcolor="#89cbe4">
                      <td bordercolor="#e5e1e1" width="100%" bgcolor="#9e9bd2" align="center" height="35">
                        <strong class="h1" style="color: white">&nbsp;信贷记录</strong>
                      </td>
                    </tr>
                    <tr bordercolor="#a7dfed">
                      <td bordercolor="#e5e1e1" bgcolor="#f1edec" align="center" height="18">
                        <strong class="p">&nbsp;这部分包含您的信用卡、贷款和其他信贷记录。金额类数据均以人民币计算，精确到元。</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br>
                <table width="100%">
                  <tbody>
                    <tr>
                      <td width="782">
                        <p class="p">
                          <strong><span class="h1">信息概要</span></strong>
                        </p>
                        <table width="100%" align="center">
                          <tbody>
                            <tr>
                              <td width="100%">
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                      <td rowspan="4" width="186" valign="top">
                        <div style="background-color: #f1edec" class="p">
                          <span style="background-color: #f1edec">
                            逾期记录可能影响对您的信用评价。
                          </span>
                        </div>
                        <br>
                        <br>
                        <div class="p" style="background-color: #f1edec">
                          <span style="background-color: #f1edec">购房贷款，包括个人住房贷款、个人商用房（包括商住两用）贷款和个人住房公积金贷款。</span>
                        </div>
                        <br>
                        <div class="p" style="background-color: #f1edec">
                          <span>
                            发生过逾期的信用卡账户，指曾经“未按时还最低还款额”的贷记卡账户和曾经“连续透支60天以上”的准贷记卡账户。
                          </span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td width="782"></td>
                    </tr>
                    <tr>
                      <td width="782">
                        <table width="100%" align="center">
                          <tbody>
                            <tr>
                              <td width="100%">
                                <table width="100%" cellspacing="0" cellpadding="0" bordercolor="#e5e1e1" border="1" height="155">
                                  <tbody>
                                    <tr bordercolor="#89cbe4">
                                      <td bordercolor="#e5e1e1" class="p" width="333" align="center">
                                        &nbsp;
                                      </td>
                                      <td bordercolor="#e5e1e1" class="p" width="300" align="center">
                                        信用卡
                                      </td>
                                      <td bordercolor="#e5e1e1" class="p" width="200" align="center">
                                        购房贷款
                                      </td>
                                      <td bordercolor="#e5e1e1" class="p" width="200" align="center">
                                        其他贷款
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="p" align="left">
                                        &nbsp;账户数
                                      </td>
                                      <td class="p" align="center">
                                        {{ formTemp.credit.creditCard.accountNumber }}
                                      </td>
                                      <td class="p" align="center">
                                        {{ formTemp.credit.purchaseLoan.accountNumber }}
                                      </td>
                                      <td class="p" align="center">
                                        {{ formTemp.credit.otherLoans.accountNumber }}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="p" align="left">
                                        &nbsp;&nbsp;&nbsp;未结清/未销户账户数
                                      </td>
                                      <td class="p" align="center">
                                        {{ formTemp.credit.creditCard.unSettlement }}
                                      </td>
                                      <td class="p" align="center">
                                        {{ formTemp.credit.purchaseLoan.unSettlement }}
                                      </td>
                                      <td class="p" align="center">
                                        {{ formTemp.credit.otherLoans.unSettlement }}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="p" align="left">
                                        &nbsp;发生过逾期的账户数
                                      </td>
                                      <td class="p" align="center">
                                        {{ formTemp.credit.creditCard.delayAccountNumber }}
                                      </td>
                                      <td class="p" align="center">
                                        {{ formTemp.credit.purchaseLoan.delayAccountNumber }}
                                      </td>
                                      <td class="p" align="center">
                                        {{ formTemp.credit.otherLoans.delayAccountNumber }}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="p" align="left">
                                        &nbsp;&nbsp;&nbsp;发生过90天以上逾期的账户数
                                      </td>
                                      <td class="p" align="center">
                                        {{ formTemp.credit.creditCard.delayOver90DayAccountNumber }}
                                      </td>
                                      <td class="p" align="center">
                                        {{ formTemp.credit.purchaseLoan.delayOver90DayAccountNumber }}
                                      </td>
                                      <td class="p" align="center">
                                        {{ formTemp.credit.otherLoans.delayOver90DayAccountNumber }}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="p" align="left">
                                        &nbsp;为他人担保笔数
                                      </td>
                                      <td class="p" align="center">
                                        {{ formTemp.credit.creditCard.guaranteeQuantity }}
                                      </td>
                                      <td class="p" align="center">
                                        {{ formTemp.credit.purchaseLoan.guaranteeQuantity }}
                                      </td>
                                      <td class="p" align="center">
                                        {{ formTemp.credit.otherLoans.guaranteeQuantity }}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td width="782">
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div v-if="0 < formTemp.creditCardInfo.length" class="otherLoanInfo">
                  <span class="h1">
                    <strong>信用卡</strong>
                  </span>
                  <ol class="p olstyle" style="padding-top: 10px;padding-left: 20px;">
                    <li style="list-style-type: decimal; list-style-position: outside"
                      v-for="(item, index) in formTemp.creditCardInfo" :key="index">
                      {{ item }}
                    </li>
                    <br>
                  </ol>
                  <br>
                </div>
                <div v-if="0 < formTemp.purchaseLoanInfo.length" class="purchaseLoanInfo">
                  <span class="h1">
                    <strong>个人购房贷款</strong>
                  </span>
                  <ol class="p olstyle" style="padding-top: 10px;padding-left: 20px;">
                    <li style="list-style-type: decimal; list-style-position: outside"
                      v-for="(item, index) in formTemp.purchaseLoanInfo" :key="index">
                      {{ item }}
                    </li>
                    <br>
                  </ol>
                  <br>
                </div>

                <div v-if="0 < formTemp.otherLoanInfo.length" class="otherLoanInfo">
                  <span class="h1">
                    <strong>其他贷款</strong>
                  </span>
                  <ol class="p olstyle" style="padding-top: 10px;padding-left: 20px;">
                    <li style="list-style-type: decimal; list-style-position: outside"
                      v-for="(item, index) in formTemp.otherLoanInfo" :key="index">
                      {{ item }}
                    </li>
                    <br>
                  </ol>
                  <br>
                </div>

                <div v-if="0 < formTemp.guaranteeInfo.length" class="guaranteeInfo">
                  <span class="h1">
                    <strong>为他人担保</strong>
                  </span>
                  <ol class="p olstyle" style="padding-top: 10px;padding-left: 20px;">
                    <li style="list-style-type: decimal; list-style-position: outside"
                      v-for="(item, index) in formTemp.guaranteeInfo" :key="index">
                      {{ item }}
                    </li>
                    <br>
                  </ol>
                  <br>
                </div>

                <table width="980" cellspacing="0" cellpadding="0" bordercolor="#e5e1e1" border="1" align="center"
                  v-if="!formTemp.publishRecord.taxRecords && !formTemp.publishRecord.civilJudgementRecords && !formTemp.publishRecord.enforceRecords && !formTemp.publishRecord.punishmentRecords && !formTemp.publishRecord.teleconOwnRecords">
                  <tbody>
                    <tr bordercolor="#bfdfff" bgcolor="#a7dfed">
                      <td bordercolor="#e5e1e1" class="h1" style="color: white" width="100%" bgcolor="#9e9bd2" align="center" height="35">
                        &nbsp;公共记录
                      </td>
                    </tr>
                    <tr bordercolor="#a7dfed" bgcolor="#bfdfff">
                      <td bordercolor="#e5e1e1" bgcolor="#f1edec" align="center" height="30">
                        <strong class="p"> 系统中没有您最近5年内的欠税记录、民事判决记录、强制执行记录、行政处罚记录及电信欠费记录。
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table width="980" cellspacing="0" cellpadding="0" bordercolor="#e5e1e1" border="1" align="center"
                  v-if="formTemp.publishRecord.taxRecords || formTemp.publishRecord.civilJudgementRecords || formTemp.publishRecord.enforceRecords || formTemp.publishRecord.punishmentRecords || formTemp.publishRecord.teleconOwnRecords">
                  <tr bordercolor="#bfdfff" bgcolor="#a7dfed">
                    <td colspan="5" bordercolor="#e5e1e1" class="h1" style="color: white" width="100%" bgcolor="#9e9bd2" align="center" height="35">
                      &nbsp;公共记录
                    </td>
                  </tr>
                  <tr>
                    <td align="center" height="30">欠税</td>
                    <td align="center" height="30">民事判决</td>
                    <td align="center" height="30">强制执行</td>
                    <td align="center" height="30">行政处罚</td>
                    <td align="center" height="30">电信欠费</td>
                  </tr>
                  <tr>
                    <td align="center" height="30">{{ formTemp.publishRecord.taxRecords || 0 }}</td>
                    <td align="center" height="30">{{ formTemp.publishRecord.civilJudgementRecords || 0 }}</td>
                    <td align="center" height="30">{{ formTemp.publishRecord.enforceRecords || 0 }}</td>
                    <td align="center" height="30">{{ formTemp.publishRecord.punishmentRecords || 0 }}</td>
                    <td align="center" height="30">{{ formTemp.publishRecord.teleconOwnRecords || 0 }}</td>
                  </tr>
                </table>

                <br>
                <table v-if="0 >= formTemp.personalQueryRecord.length && 0 >= formTemp.providerQueryRecord.length" width="980" cellspacing="0" cellpadding="0" bordercolor="#e5e1e1" border="1" align="center">
                  <tbody>
                    <tr bordercolor="#89cbe4">
                      <td bordercolor="#e5e1e1" class="h1" style="color: white" width="100%" bgcolor="#9e9bd2" align="center" height="35">
                        查询记录
                      </td>
                    </tr>
                    <tr bordercolor="#a7dfed" bgcolor="#bfdfff">
                      <td bordercolor="#e5e1e1" bgcolor="#f1edec" align="center" height="30">
                        <strong class="p">系统中没有您的信用报告最近2年被查询的记录。
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br>
                <table v-if="0 < formTemp.providerQueryRecord.length" width="980" cellspacing="0" cellpadding="0" bordercolor="#e5e1e1" border="0" align="center" style="border-top: 1px dashed #ccc; border-bottom: 1px dashed #ccc; padding-bottom: 20px">
                  <tbody>
                    <tr>
                      <td colspan="4" class="h1" width="100%" align="center" height="35">
                        <strong>机构查询记录明细</strong>
                      </td>
                    </tr>
                    <br>
                    <tr>
                      <td align="center" height="18">编号</td>
                      <td align="center" height="18">查询日期</td>
                      <td align="center" height="18">查询操作员</td>
                      <td align="center" height="18">查询原因</td>
                    </tr>
                    <br>
                    <tr v-for="(item, index) in formTemp.providerQueryRecord">
                      <td align="center" height="30">{{ index + 1}}</td>
                      <td align="center" height="30">{{ item.queryDate }}</td>
                      <td align="center" height="30">{{ item.queryMan }}</td>
                      <td align="center" height="30">{{ item.queryReason }}</td>
                    </tr>
                  </tbody>
                </table>
                <br>
                <table v-if="0 < formTemp.personalQueryRecord.length" width="980" cellspacing="0" cellpadding="0" bordercolor="#e5e1e1" border="0" align="center" style="border-top: 1px dashed #ccc; border-bottom: 1px dashed #ccc; padding-bottom: 20px">
                  <tbody>
                    <tr>
                      <td colspan="4" class="h1" width="100%" align="center" height="35">
                        <strong>个人查询记录明细</strong>
                      </td>
                    </tr>
                    <br>
                    <tr>
                      <td align="center" height="18">编号</td>
                      <td align="center" height="18">查询日期</td>
                      <td align="center" height="18">查询操作员</td>
                      <td align="center" height="18">查询原因</td>
                    </tr>
                    <br>
                    <tr v-for="(item, index) in formTemp.personalQueryRecord">
                      <td align="center" height="30">{{ index + 1}}</td>
                      <td align="center" height="30">{{ item.queryDate }}</td>
                      <td align="center" height="30">{{ item.queryMan }}</td>
                      <td align="center" height="30">{{ item.queryReason }}</td>
                    </tr>
                  </tbody>
                </table>
                <br>
                <table width="980" cellspacing="0" border="0" align="center">
                  <tbody>
                    <tr>
                      <td width="980" align="center">
                        <strong class="h1">说&nbsp;&nbsp;明</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <ol>
                  <li class="p" style="list-style-type: decimal; list-style-position: outside">
                    除查询记录外，本报告中的信息是依据截至报告时间个人征信系统记录的信息生成，征信中心不确保其真实性和准确性，但承诺在信息汇总、加工、整合的全过程中保持客观、中立的地位。
                  </li>
                  <li class="p" style="list-style-type: decimal; list-style-position: outside">
                    本报告仅包含可能影响您信用评价的主要信息，如需获取您在个人征信系统中更详细的记录，请到当地信用报告查询网点查询。信用报告查询网点的具体地址及联系方式可访问征信中心门户网站（www.pbccrc.org.cn）查询。
                  </li>
                  <li class="p" style="list-style-type: decimal; list-style-position: outside">
                    您有权对本报告中的内容提出异议。如有异议，可联系数据提供单位，也可到当地信用报告查询网点提出异议申请。
                  </li>
                  <li class="p" style="list-style-type: decimal; list-style-position: outside">
                    本报告仅供您了解自己的信用状况，请妥善保管。因保管不当造成个人隐私泄露的，征信中心将不承担相关责任。
                  </li>
                  <li class="p" style="list-style-type: decimal; list-style-position: outside">
                    更多咨询，请致电全国客户服务热线400-810-8866。
                  </li>
                </ol>

                <br>
              </td>

            </tr>

          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>