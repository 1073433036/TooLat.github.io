<template>
  <transition name="slide">
  <div v-if="isOpenProtocol" class="protocol_detail_page">
    <h3 v-if="hasTitle" class="protocol-title">{{title}}</h3>
    <div class="protocol-content">
      <div class="wrapper">
        <scroller>
          <div class="detail" v-if="isHtml" v-html="protocolContent"></div>
          <div class="detail" else>
            <h1 class="h1">用户个人隐私保护协议</h1>
            <ul class="protocol-list">
              <h3>协议内容</h3>
              <li>
                （1）用户必须合法使用网络服务，不作任何违法违规用途，自觉维护本网站的声誉，遵守所有使用网络服务的网络协议、规定、程序和惯例。
              </li>
              <li>
                （2）为保证服务质量，用户应向本网站提供真实、准确的个人资料，个人资料如有变更，应立即修正。如因用户提供的个人资料不实或不准确，给用户自身造成任何性质的损失，均由用户自行承担。卡盟v金服承诺任何在本网站提交的用户信息，仅限用于卡盟v金服为用户提供的服务。
              </li>
              <li>
                （3）卡盟v金服承诺为用户的隐私及其他个人信息采取严格保密措施，并在必要时销毁数据。未经用户授权不得向第三方公开或泄露用户个人资料的内容，但由于政府要求、法律政策需要等原因除外。在用户发送信息的过程中和本网站收到信息后，本网站将遵守行业通用的标准来保护用户的私人信息。但是任何通过因特网发送的信息或电子版本的存储方式都无法确保100%的安全性。因此，本网站会尽力使用商业上可接受的方式来保护用户的个人信息，但不对用户信息的安全作任何担保。
              </li>
              <li>
                （4）本网站有权在必要时修改服务条例，本网站的服务条例一旦发生变动，将会在本网站的重要页面上提示修改内容，用户如不同意新的修改内容，须立即停止使用本协议约定的服务，否则视为用户完全同意并接受新的修改内容。根据客观情况及经营方针的变化，本网站中断或停止服务的权利，用户对此表示理解并完全认同。
              </li>
              <li>
                （5）本保密协议、卡盟v金服《服务条款》、卡盟v金服官网相关页面服务说明以及您确认同意的订购页面上的内容等，均为本协议不可分割的一部分，与本协议具有同等法律效力！
              </li>
            </ul>
          </div>
        </scroller>
      </div>
    </div>
    <!-- <div class="protocol-choose">
      <div class="input-group">
        <input type="checkbox" id="checkbox" v-model="isAccept" value="accept" ref="checkbox">
        <label for="checkbox">
          <em class="rect"></em>
          <span class="tx-span">我已阅读并接受该协议</span>
        </label>
      </div>
    </div> -->
    <div class="protocol-end-btn" v-on:click.stop="closeProtocol">关闭</div>
  </div>
  </transition>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>