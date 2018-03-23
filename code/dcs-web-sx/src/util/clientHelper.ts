// const baseUrl = 'http://10.148.83.228:8086/',
// http://10.152.189.241:8086/
const baseUrl = 'http://10.148.83.228:8086/',
  comUrl = `/user/post/,/`;

const newBaseUrl = 'http://10.148.83.228:19960/SxDcs/'

export class larnClient {
  static async getLarnParams() {
    let res = await fetch(baseUrl + 'larn/get/larn_params' + comUrl);
    let data: ClientReturn = await res.json();
    if (data.result === 'S_OK')
      return data.tagObject
    else
      return false
  }

  static async publish(params) {
    let res = await fetch(baseUrl + 'larn/publish' + comUrl, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: computePostString(params),
    });
    let data = await res.json()
    if (data.result === 'S_OK') return true
    else return false
  }
}

export class hydRologyClient {
  static async getRiverInfo() {
    let res = await fetch(baseUrl + 'hyd/river' + comUrl + `?cacheCtrl=${Date.now()}`);
    let data = await res.json();
    if (data.result === 'S_OK')
      return data.tagObject
    else
      return false
  }

  static async addRiverInfo(params) {
    let res = await fetch(baseUrl + 'hyd/river/add' + comUrl, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: computePostString(params),
    })
    let data = await res.json()
    console.log(data)
    if (data.result === 'S_OK') return true
    else return false
  }

  static async updateRiverInfo(params) {
    let res = await fetch(baseUrl + 'hyd/river/update' + comUrl, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: computePostString(params),
    })
    let data = await res.json()
    console.log(data)
    if (data.result === 'S_OK') return true
    else return false
  }

  static async deleteRiverInfo(id: number) {
    let res = await fetch(baseUrl + 'hyd/river/del' + comUrl + `?id=${id}`)
    let data = await res.json()
    console.log(data)
    if (data.result === 'S_OK') return true
    else return false
  }
}

export class planImportClient {
  static async importMea(params) {
    let res = await fetch(baseUrl + 'plan/import/measure' + comUrl, {
      method: 'post',
      body: params
    })
    let data = await res.json()
    console.log(data)
    if (data.result === 'S_OK')
      return true
    else
      return false
  }

  static async importOrgmen(params) {
    let res = await fetch(baseUrl + 'plan/import/orgmen' + comUrl, {
      method: 'post',
      body: params
    })
    let data = await res.json()
    console.log(data)
    if (data.result === 'S_OK')
      return true
    else
      return false
  }

  static async importExpert(params) {
    let res = await fetch(baseUrl + 'plan/import/expert' + comUrl, {
      method: 'post',
      body: params
    })
    let data = await res.json()
    console.log(data)
    if (data.result === 'S_OK')
      return true
    else
      return false
  }

  static async importPoi(params) {
    let res = await fetch(baseUrl + 'poi/import/excel' + comUrl, {
      method: 'post',
      body: params
    })
    let data = await res.json()
    console.log(data)
    if (data.result === 'S_OK')
      return true
    else
      return false
  }
}

export class StationClient {
  static async getStationReal(date: string) {
    let res = await fetch(baseUrl + 'station/real' + comUrl + '?date=' + date);
    let data: ClientReturn = await res.json();
    if (data.result === 'S_OK')
      return data.tagObject
    else
      return false
  }
}

export class UserClient {
  static async getUserById(id: string) {
    let res = await fetch(newBaseUrl + 'user/getUsers', {
      method: 'get',
      mode: 'cors',
      cache: 'no-cache'
    })

    let data: ClientReturn = await res.json()

    if (data.result === 'S_OK') {
      for (let item of data.tagObject) {
        if (item['userid'] === id) {
          return item.username
        }
      }
    }
    else
      return false
  }

  static async getAllRoles() {
    let res = await fetch(baseUrl + 'user/role/all' + comUrl + `?randow=${Math.random()}`);
    let data = await res.json();
    if (data.result === 'S_OK') return data.tagObject;
    else return false;
  }

  static async insertRole(name: string, description: string) {
    let res = await fetch(baseUrl + 'user/role/insert' + comUrl + `?name=${name}&description=${description}`);
    let data = await res.json();
    console.log(data)
    if (data.result === 'S_OK') return true;
    else return false;
  }

  static async deleteRole(id) {
    let res = await fetch(baseUrl + 'user/role/del' + comUrl + `?id=${id}`);
    let data = await res.json();
    console.log(data)
    if (data.result === 'S_OK') return true;
    else return false;
  }

  static async logout(userId: string, password: string) {
    let res = await fetch(baseUrl + 'user/logout/web' + comUrl + `?userId=${userId}&password=${password}`);
    let data = await res.json();
    if (data.result === 'S_OK') return true;
    else return false;
  }

  static async getRegInfo() {
    let res = await fetch(baseUrl + 'user/get/reginfo' + comUrl)
    let data = await res.json()
    if (data.result === 'S_OK') return true
    else return false
  }
  
  static async checkreg(userId: string, pass: boolean, release: boolean) {
    let res = await fetch(baseUrl + 'user/checkreg' + comUrl + `?userId=${userId}&pass=${pass}&release=${release}`)
    let data = await res.json();
    if (data.result === 'S_OK') return true;
    else return false;
  }
}

export class prePlanClient {
  static async getPrePlaneById(id: string) {
    let res = await fetch('http://10.148.83.228:8086/emergency/plan/get/id/user/post/,/?planId=' + id, {
      mode: 'cors',
      method: 'get',
      cache: 'no-cache'
    })

    let data: ClientReturn = await res.json()

    if (data.result === 'S_OK') {
      return data.tagObject['name']
    }
    else
      return false
  }

  static async getAllOrganizations() {
    let res = await fetch(baseUrl + 'plan/orgs/list' + comUrl + `?randnom=${Math.random()}`)
    let data = await res.json()
    if (data.result === 'S_OK') return data.tagObject
    else return false
  }

  static async getOrgByDisasterId(disasterId: string, level: number) {
    let res = await fetch(baseUrl + 'plan/orgs/disaster' + comUrl + `?disasterId=${disasterId}&level=${level}&randnom=${Math.random()}`)
    let data = await res.json()
    if (data.result === 'S_OK') return data.tagObject
    else return false
  }

  static async getEmegencyTypeInfo() {
    let res = await fetch(baseUrl + 'plan/emtype/list' + comUrl + `?randnom=${Math.random()}`)
    let data = await res.json()
    if (data.result === 'S_OK') return data.tagObject
    else return false
  }

  static async getDisasterTypeInfo(emTypeId: string) {
    let res = await fetch(baseUrl + 'plan/disaster/emtypeid' + comUrl + `?emTypeId=${emTypeId}&randnom=${Math.random()}`)
    let data = await res.json()
    if (data.result === 'S_OK') return data.tagObject
    else return false
  }

  static async getDuties() {
    let res = await fetch(baseUrl + 'plan/duty/list' + comUrl + `?randnom=${Math.random()}`)
    let data = await res.json()
    if (data.result === 'S_OK') return data.tagObject
    else return false
  }

  static async addDuty(params) {
    let res = await fetch(baseUrl + 'plan/duty/add' + comUrl, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: computePostString(params),
    })
    let data = await res.json()
    if (data.result === 'S_OK') return true
    else return false
  }

  static async updateDuty(params) {
    let res = await fetch(baseUrl + 'plan/duty/update' + comUrl, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: computePostString(params),
    })
    let data = await res.json()
    if (data.result === 'S_OK') return true
    else return false
  }

  static async delDuty(id: number) {
    let res = await fetch(baseUrl + 'plan/duty/del' + comUrl + `?id=${id}&randnom=${Math.random()}`)
    let data = await res.json()
    if (data.result === 'S_OK') return true
    else return false
  }

  static async getUnFinishPlan() {
    let res = await fetch(baseUrl + 'emergency/plan/get/unfinish' + comUrl + `?randnom=${Math.random()}`)
    let data = await res.json()
    if (data.result === 'S_OK') return data.tagObject
    else return false
  }

  static async getPlans() {
    let res = await fetch(baseUrl + 'emergency/plan/get/page' + comUrl + `?pageIndex=1&pageSize=100&randnom=${Math.random()}`)
    let data = await res.json()
    if (data.result === 'S_OK') return data.tagObject
    else return false
  }

  static async startPlan(params) {
    let res = await fetch(baseUrl + 'emergency/plan/start' + comUrl, {
      method: 'post',
      body: params
    })
    let msg: any = await res.json()
    if (msg.result === 'S_OK') return msg.tagObject
    else return false
  }

  static async getEmergencyDuty(planId: string) {
    let res = await fetch(baseUrl + 'emergency/plan/duties' + comUrl + `?planId=${planId}&randnom=${Math.random()}`)
    let msg = await res.json()
    if (msg.result === 'S_OK') return msg.tagObject
    else return false
  }

  static async finishEmergencyDuty(id: string, planId: string, name: string, status: string) {
    let res = await fetch(baseUrl + 'emergency/plan/duty/update' + comUrl + `?id=${id}&planId=${planId}&name=${name}&status=${status}`)
    let msg = await res.json()
    if (msg.result === 'S_OK') return true
    else return false
  }

  static async addEmergencyDuty(params) {
    let res = await fetch(baseUrl + 'emergency/plan/duties/add' + comUrl, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: computePostString(params)
    })
    let msg = await res.json()
    if (msg.result === 'S_OK')
      return true
    else
      return msg.description
  }

  static async finishPlan(params) {
    let res = await fetch(baseUrl + 'emergency/plan/finish' + comUrl, {
      method: 'post',
      body: params
    })
    let msg = await res.json()
    if (msg.result === 'S_OK') return true
    else return msg.description
  }

  static async changePlanLevel(params) {
    let res = await fetch(baseUrl + 'emergency/plan/level/change' + comUrl, {
      method: 'post',
      body: params
    })
    let msg = await res.json()
    if (msg.result === 'S_OK') return msg.tagObject
    else return false
  }

  static async addPublish(params) {
    let res = await fetch(baseUrl + 'emergency/plan/publish' + comUrl, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: computePostString(params)
    })
    let msg = await res.json()
    if (msg.result === 'S_OK')
      return true
    else
      return msg.description
  }

  static async getPlanMeasure(disasterId: string, orgid: number, level: number) {
    let res = await fetch(baseUrl + 'plan/mea/get/org/level' + comUrl + `?disasterId=${disasterId}&orgid=${orgid}&level=${level}&randnom=${Math.random()}`)
    let data = await res.json()
    if (data.result === 'S_OK') return data.tagObject
    else return false
  }

  static async getPlanFax(id) {
    let res = await fetch(baseUrl + 'plan/mea/get/fax' + comUrl + `?id=${id}&randnom=${Math.random()}`)
    let data = await res.json()
    if (data.result === 'S_OK') return data.tagObject
    else return false
  }
}

export class SmsClient {
  static async sendPhone(params) {
    let res = await fetch(baseUrl + 'sms/send/phone' + comUrl, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: computePostString(params)
    })
    let msg: any = await res.json()
    console.log(msg)
    if (msg.result === 'S_OK')
      return true
    else
      return msg.description
  }

  static async sendMessageToOrgs(params) {
    let res = await fetch(baseUrl + 'sms/send/org' + comUrl, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: computePostString(params)
    })
    let msg: any = await res.json()
    console.log(msg)
    if (msg.result === 'S_OK')
      return true
    else
      return false
  }

  static async sendMessageToRegions(params) {
    let res = await fetch(baseUrl + 'sms/send/regions' + comUrl, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: computePostString(params)
    })
    let msg: any = await res.json()
    console.log(msg)
    if (msg.result === 'S_OK')
      return true
    else
      return false
  }

  static async getSmsDepartment() {
    let res = await fetch(baseUrl + 'sms/record/department' + comUrl + `?cacheControl=${new Date().getTime()}`)
    let data: ClientReturn = await res.json()
    if (data.result === 'S_OK')
      return data.tagObject
    else
      return false
  }
  static async getSmsCategory() {
    let res = await fetch(baseUrl + 'sms/record/category' + comUrl + `?cacheControl=${new Date().getTime()}`)
    let data: ClientReturn = await res.json()
    if (data.result === 'S_OK')
      return data.tagObject
    else
      return false
  }
  static async seatchHistSms(type: 'name' | 'tag', department: string, category: string, content: string, pageIndex: number, pageSize: number) {
    let middleUrl = ''
    switch (type) {
      case 'name': middleUrl = 'sms/record/find/name'; break;
      case 'tag': middleUrl = 'sms/record/find/tag'; break;
      default: middleUrl = 'sms/record/find/name';
    }
    let res = await fetch(baseUrl + middleUrl + comUrl + `?department=${department}&category=${category}&${type}=${content}&pageIndex=${pageIndex}&pageSize=${pageSize}&cacheControl=${new Date().getTime()}`)
    let data: ClientReturn = await res.json()
    if (data.result === 'S_OK')
      return data.tagObject
    else
      return false
  }
  static async getPersonHistText(phone: string, pageIndex: number, pageSize: number): Promise<Array<HistText>> {
    let res = await fetch(baseUrl + 'sms/record/find/phone' + comUrl + `?phone=${phone}&pageIndex=${pageIndex}&pageSize=${pageSize}&cacheControl=${new Date().getTime()}`)
    let data: any = await res.json()
    if (data.result === 'S_OK')
      return data.tagObject
    else
      return []
  }
  static async sendTextToPeople(phoneList: Array<string>, content: string, category: string): Promise<boolean> {
    let contacts = []
    phoneList.forEach(el => {
      contacts.push({
        phone: el,
        man: '',
        department: ''
      })
    })
    let encodeData = {
      phoneContact: contacts,
      content,
      category,
      tag: 'random tag'
    }
    let bodyData = `stringPhoneContacts=${JSON.stringify(encodeData.phoneContact)}&content=${content}&category=${category}&tag=${'test'}`
    let res = await fetch('http://10.148.83.228:19960/SxDcs/sms/sendMessage', {
      mode: 'cors',
      body: bodyData,
      headers: {
        "Content-Type": 'application/x-www-form-urlencoded'
      },
      method: 'post'
    })
    let data: ClientReturn = await res.json()

    if (data.result === 'S_OK')
      return true
    else
      return false
  }
}

export class RtmpClient {
  static async getPhonePublishList() {
    let res = await fetch(baseUrl + 'live/phone/get/onlive' + comUrl + `?cacheControl=${new Date().getTime()}`)
    let data: ClientReturn = await res.json()
    if (data.result === 'S_OK')
      return data.tagObject
    else
      return false
  }
  static async publishLive(targetId: string, url: string) {
    let res = await fetch(baseUrl + 'live/web/begin' + comUrl + `?targetId=${targetId}&phone=null&url=${url}&release=false&userId=${localStorage.userId}&cacheControl=${new Date().getTime()}`)
    let data: ClientReturn = await res.json()
    if (data.result === 'S_OK')
      return data.tagObject
    else
      return false
  }
  static async stopPublish(targetId: string) {
    let res = await fetch(baseUrl + 'live/web/stop' + comUrl + `?targetId=${targetId}&release=false&cacheControl=${new Date().getTime()}`)
    let data: ClientReturn = await res.json()
    if (data.result === 'S_OK')
      return data.tagObject
    else
      return false
  }
}

export class FisherClient {
  static async sendText(sendTo: Array<number>, content) {
    let encodeData = {
      uerId: localStorage.userId,
      liableIds: sendTo,
      content: content
    }
    let res = await fetch(baseUrl + 'fisher/publish/add' + comUrl, getFetchOption(encodeData))
    let data: ClientReturn = await res.json()

    if (data.result === 'S_OK')
      return true
    else
      return false
  }
  static async getFisherTownState(publishId: string): Promise<Array<TownState>> {
    let res = await fetch(baseUrl + 'fisher/get/townstate' + comUrl + `?publishId=${publishId}&cacheControl=${new Date().getTime()}`)
    let data: any = await res.json()

    if (data.result === 'S_OK')
      return data.tagObject
    else
      return []
  }
  static async startPublish(publishTarget: Array<number>, content: string): Promise<boolean> {
    let encodeData = {
      userId: localStorage.userId,
      liableIds: publishTarget,
      content: content
    }
    let res = await fetch(baseUrl + 'fisher/publish/start' + comUrl, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: computePostString(encodeData)
    })
    let data: ClientReturn = await res.json()

    if (data.result === 'S_OK')
      return true
    else
      return false
  }
  static async getUnFinish(): Promise<any> {
    let res = await fetch(baseUrl + 'fisher/get/unfinish' + comUrl + `?cacheControl=${new Date().getTime()}`)
    let data: ClientReturn = await res.json()

    if (data.result === 'S_OK')
      return data.tagObject
    else
      return false
  }
  static async finishPublish(publishId: string) {
    let res = await fetch(baseUrl + 'fisher/publish/finish' + comUrl + `?publishId=${publishId}`)
    let data: ClientReturn = await res.json()

    if (data.result === 'S_OK')
      return data.tagObject
    else
      return false
  }
  static async
  static async getTextTemplate(): Promise<any> {
    let res = await fetch(baseUrl + 'fisher/template/get' + comUrl)
    let data: ClientReturn = await res.json()

    if (data.result === 'S_OK')
      return data.tagObject
    else
      return false
  }
  static async getAllPublishTarget(): Promise<any> {
    let res = await fetch(baseUrl + 'fisher/listliables' + comUrl + `?cacheControl=${new Date().getTime()}`)
    let data: ClientReturn = await res.json()

    if (data.result === 'S_OK')
      return data.tagObject
    else
      return false
  }
}

export class ExpertClient {
  static async getExperts() {
    let res = await fetch(baseUrl + 'plan/expert/list' + comUrl + `?random=${Math.random()}`)
    let data = await res.json()
    if (data.result === 'S_OK')
      return data.tagObject
    else
      return false
  }

  static async addExpert(params: any) {
    let res = await fetch(baseUrl + 'plan/expert/add' + comUrl, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: computePostString(params),
    });
    let data = await res.json()
    console.log(data);
    if (data.result === 'S_OK')
      return data.tagObject
    else
      return false
  }

  static async updateExpert(params: any) {
    let res = await fetch(baseUrl + 'plan/expert/update' + comUrl, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: computePostString(params),
    });
    let data = await res.json()
    if (data.result === 'S_OK')
      return data.tagObject
    else
      return false
  }

  static async delExpert(id: number) {
    let res = await fetch(baseUrl + 'plan/expert/del' + comUrl + `?id=${id}`);
    let data = await res.json()
    if (data.result === 'S_OK')
      return true
    else
      return false
  }
}

export class OrganizationClient {
  static async getAllOrganizations() {
    let res = await fetch(baseUrl + 'plan/orgs/list' + comUrl + `?randnom=${Math.random()}`)
    let data = await res.json()
    if (data.result === 'S_OK') return data.tagObject
    else return false
  }

  static async addOrganizations(params) {
    let res = await fetch(baseUrl + 'plan/orgs/add' + comUrl, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: computePostString(params),
    })
    let data = await res.json()
    if (data.result === 'S_OK') return true
    else return false
  }

  static async updateOrganizations(params) {
    let res = await fetch(baseUrl + 'plan/orgs/update' + comUrl, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: computePostString(params),
    })
    let data = await res.json()
    if (data.result === 'S_OK') return true
    else return false
  }

  static async delOrganizations(id: string) {
    let res = await fetch(baseUrl + 'plan/orgs/del' + comUrl + `?id=${id}&randnom=${Math.random()}`)
    let data = await res.json()
    if (data.result === 'S_OK') return true
    else return false
  }
}

export class DisasterTypeClient {
  static async getEmegencyTypeInfo() {
    let res = await fetch(baseUrl + 'plan/emtype/list' + comUrl + `?randnom=${Math.random()}`)
    let data = await res.json()
    if (data.result === 'S_OK') return data.tagObject
    else return false
  }

  static async getDisasterTypeInfo(emTypeId: string) {
    let res = await fetch(baseUrl + 'plan/disaster/emtypeid' + comUrl + `?emTypeId=${emTypeId}&randnom=${Math.random()}`)
    let data = await res.json()
    if (data.result === 'S_OK') return data.tagObject
    else return false
  }

  static async addDisasterTypeInfo(params) {
    let res = await fetch(baseUrl + 'plan/disaster/add' + comUrl, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: computePostString(params),
    });
    let data = await res.json()
    if (data.result === 'S_OK') return true
    else return false
  }

  static async updateDisasterTypeInfo(params) {
    let res = await fetch(baseUrl + 'plan/disaster/update' + comUrl, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: computePostString(params),
    });
    let data = await res.json()
    if (data.result === 'S_OK') return true
    else return false
  }

  static async delDisasterTypeInfo(id) {
    let res = await fetch(baseUrl + 'plan/disaster/del' + comUrl + `?id=${id}`)
    let data = await res.json()
    if (data.result === 'S_OK') return true
    else return false
  }
}

export class MearsureClient {
  static async getMearsureByName(name: string) {
    let res = await fetch(baseUrl + 'plan/mea/get/name/' + comUrl + `?name=${name}&random=${Math.random()}`);
    let data = await res.json()
    if (data.result === 'S_OK')
      return data.tagObject
    else
      return false
  }

  static async getMeaByDisasterId(disasterId: string) {
    let res = await fetch(baseUrl + 'plan/mea/get/name' + comUrl + `?disasterId=${disasterId}&random=${Math.random()}`);
    let data = await res.json()
    if (data.result === 'S_OK')
      return data.tagObject
    else
      return false
  }

  static async getMearsure(orgId: number) {
    let res = await fetch(baseUrl + 'plan/mea/get/org' + comUrl + `?orgId=${orgId}&random=${Math.random()}`)
    let data = await res.json()
    if (data.result === 'S_OK')
      return data.tagObject
    else
      return false
  }

  static async addMearsure(params: any) {
    let res = await fetch(baseUrl + 'plan/mea/add' + comUrl, {
      method: 'post',
      body: params
    })
    let data = await res.json()
    console.log(data)
    if (data.result === 'S_OK')
      return data.tagObject
    else
      return false
  }

  static async updateMearsure(params: any) {
    let res = await fetch(baseUrl + 'plan/mea/update' + comUrl, {
      method: 'post',
      body: params
    })
    let data = await res.json()
    console.log(data)
    if (data.result === 'S_OK')
      return data.tagObject
    else
      return false
  }

  static async updateMearsureNofax(params: any) {
    let res = await fetch(baseUrl + 'plan/mea/update/nofax' + comUrl, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: computePostString(params),
    });
    let data = await res.json()
    console.log(data)
    if (data.result === 'S_OK')
      return data.tagObject
    else
      return false
  }

  static async delMearsure(id: number) {
    let res = await fetch(baseUrl + 'plan/mea/del' + comUrl + `?id=${id}`);
    let data = await res.json()
    console.log(data)
    if (data.result === 'S_OK')
      return true
    else
      return false
  }
}

export class OrgMenClient {
  static async getOrgMen() {
    let res = await fetch(baseUrl + 'plan/men/list' + comUrl + `?random=${Math.random()}`);
    let msg: any = await res.json();
    if (msg.result === 'S_OK')
      return msg.tagObject
    else
      return false
  }

  static async addOrgMen(params: any) {
    let res = await fetch(baseUrl + 'plan/men/add' + comUrl, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: computePostString(params),
    });
    let data = await res.json()
    if (data.result === 'S_OK')
      return data.tagObject
    else
      return false
  }

  static async updateOrgMen(params: any) {
    let res = await fetch(baseUrl + 'plan/men/update' + comUrl, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: computePostString(params),
    });
    let data = await res.json()
    if (data.result === 'S_OK')
      return data.tagObject
    else
      return false
  }

  static async delOrgMen(id: number) {
    let res = await fetch(baseUrl + 'plan/men/del' + comUrl + `?id=${id}`);
    let data = await res.json()
    if (data.result === 'S_OK')
      return true
    else
      return false
  }
}

export class GeographyClient {
  static async getCountyBound(countyId: number) {
    let res = await fetch(baseUrl + 'geography/findcounty' + comUrl + `?countyId=${countyId}`);
    let msg: any = await res.json();
    if (msg.result !== 'S_OK') {
      console.error('边界数据出错');
      return false;
    }
    else {
      return msg.tagObject;
    }
  }

  static async getTownsBound(countyId: number) {
    let res = await fetch(baseUrl + 'geography/findtowns/county' + comUrl + `?countyId=${countyId}`);
    let msg: any = await res.json();
    if (msg.result === 'S_OK')
      return msg.tagObject;
    else
      return false;
  }

  static async getTownBound(townId: number) {
    let res = await fetch(baseUrl + 'geography/findtown' + comUrl + `?townId=${townId}`);
    let msg: any = await res.json();
    if (msg.result === 'S_OK')
      return msg.tagObject;
    else
      return false;
  }
}

export class PoiClient {
  static async getAllEntities(poiName: string) {
    let res = await fetch(baseUrl + 'poi/entity/all' + comUrl + `?poiName=${poiName}`);
    let msg: any = await res.json();
    if (msg.result === 'S_OK')
      return msg.tagObject;
    else
      return false;
  }

  static async findByType(countyId: number, poiName: string, type: string) {
    let res = await fetch(baseUrl + 'poi/entity/type' + comUrl + `?countyId=${countyId}&poiName=${poiName}&type=${type}`);
    let msg: any = await res.json();
    if (msg.result === 'S_OK')
      return msg.tagObject;
    else
      return false;
  }
}

export class ImageClient {
  static getOceanUrl(start: string, leadtime: number) {
    const url = baseUrl + 'wind/uv' + comUrl 
      + `post?start=${start}&leadtime=${leadtime}&left=105&right=115&top=22&bottom=17&width=2000&height=2000&cacheCtrl=${Date.now()}`;
    return url;
  }
}

export class videoClient {
  static async getVideoUrl(type: number, devId: number) {
    let res: any = await fetch(baseUrl + 'video/stream/push' + comUrl + `?type=${type}&devId=${devId}&cacheCtrl=${Date.now()}`);
    let msg: any = await res.json();
    if (msg.result === 'S_OK')
      return msg.tagObject;
    else
      return false;
  }

  static async getAllVideo() {
    const url = baseUrl + 'video/get/all' + comUrl + `?cacheCtrl=${Date.now()}`
    let res: any = await fetch(url);
    let msg: any = await res.json();
    if (msg.result === 'S_OK')
      return msg.tagObject;
    else
      return false;
  }

  static async addVideoDev(params: any) {
    const url = baseUrl + 'video/add' + comUrl
    let res = await fetch(url, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: computePostString(params),
    })
    let msg: any = await res.json();
    if (msg.result === 'S_OK')
      return true;
    else
      return msg.description;
  }

  static async updateVideoDev(params: any) {
    const url = baseUrl + 'video/update' + comUrl
    let res = await fetch(url, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: computePostString(params),
    })
    let msg: any = await res.json();
    console.log(msg)
    if (msg.result === 'S_OK')
      return true;
    else
      return msg.description;
  }

  static async deleteVideoDev(id: string) {
    const url = baseUrl + 'video/del' + comUrl + '?id=' + id
    let res: any = await fetch(url);
    let msg: any = await res.json();
    console.log(msg)
    if (msg.result === 'S_OK')
      return true;
    else
      return false;
  }
}

export class EventClient {
  static async startEventDeal(name, description, userId) {
    const url = baseUrl + 'event/deal/start' + comUrl + `?name=${name}&description=${description}&userId=${userId}`;
    let res: any = await fetch(url);
    let msg: any = await res.json();
    if (msg.result === 'S_OK')
      return msg.tagObject;
    else
      return false;
  }

  static async stopEventDeal(id) {
    const url = baseUrl + 'event/deal/finish' + comUrl + `?id=${id}`;
    let res: any = await fetch(url);
    let msg: any = await res.json();
    if (msg.result === 'S_OK')
      return msg.tagObject;
    else
      return false;
  }

  static async getUnfinishEvent() {
    const url = baseUrl + 'event/deal/get/unfinish' + comUrl + '?random=' + Math.random();
    let res: any = await fetch(url);
    let msg: any = await res.json();
    if (msg.result === 'S_OK')
      return msg.tagObject;
    else
      return false;
  }

  static async getFinishEvent() {
    const url = baseUrl + 'event/deal/get/finish' + comUrl + '?random=' + Math.random();
    let res: any = await fetch(url);
    let msg: any = await res.json();
    if (msg.result === 'S_OK')
      return msg.tagObject;
    else
      return false;
  }

  static async addEmergencyRegion(eventId, region) {
    let params = {
      eventId,
      region,
    };
    let res = await fetch(baseUrl + 'event/deal/region/add' + comUrl, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: computePostString(params),
    });
    let msg: any = await res.json();
    if (msg.result === 'S_OK')
      return true;
    else
      return false;
  }

  static async getEmergencyRegions(eventId) {
    const url = baseUrl + 'event/deal/region/get' + comUrl + `?eventId=${eventId}&random=${Math.random()}`;
    let res: any = await fetch(url);
    let msg: any = await res.json();
    if (msg.result === 'S_OK')
      return msg.tagObject;
    else
      return false;
  }

  static async deleteEmergencyRegions(id) {
    const url = baseUrl + 'event/deal/region/del' + comUrl + `?id=${id}`;
    let res: any = await fetch(url);
    let msg: any = await res.json();
    if (msg.result === 'S_OK')
      return true;
    else
      return false;
  }    
}

function computePostString(data) {
  let encodedString = ''
  Object.keys(data).forEach((key, index) => {
    if (typeof data[key] != 'object') {
      if (index !== 0) encodedString += '&'
      encodedString += `${key}=${data[key]}`
    } else if (Array.isArray(data[key])) {
      if (index !== 0) encodedString += '&'
      data[key].forEach((el, arrIndex) => {
        if (typeof el == 'object' && !Array.isArray(el)) {
          Object.keys(el).map((item, i) => {
            if (!(arrIndex == 0 && i == 0)) encodedString += '&'
            encodedString += `${key}[${arrIndex}][${item}]=${el[item]}`
          })
        } else {
          if (arrIndex !== 0) encodedString += '&'
          encodedString += `${key}[]=${el}`
        }
      })
    } else {
      Object.keys(data[key]).forEach(subKey => {
        if (index !== 0) encodedString += '&'
        encodedString += `${key}[${subKey}]=${data[key][subKey]}`
      })
    }
  })
  return encodedString
}

function getFetchOption(data: object) {
  let fetchOption = {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
  let encodedString = ''
  Object.keys(data).forEach((key, index) => {
    if (typeof data[key] != 'object') {
      if (index !== 0) encodedString += '&'
      encodedString += `${key}=${data[key]}`
    } else if (Array.isArray(data[key])) {
      if (index !== 0) encodedString += '&'
      data[key].forEach((el, arrIndex) => {
        if (typeof el == 'object' && !Array.isArray(el)) {
          Object.keys(el).map((item, i) => {
            if (!(arrIndex == 0 && i == 0)) encodedString += '&'
            encodedString += `${key}[${arrIndex}][${item}]=${el[item]}`
          })
        } else {
          if (arrIndex !== 0) encodedString += '&'
          encodedString += `${key}[]=${el}`
        }
      })
    } else {
      Object.keys(data[key]).forEach(subKey => {
        if (index !== 0) encodedString += '&'
        encodedString += `${key}[${subKey}]=${data[key][subKey]}`
      })
    }
  })
  console.info(encodedString)
  fetchOption.body = encodedString
  return fetchOption
}

interface ClientReturn {
  result: 'S_NOT_FOUND' | 'S_OK'
  description: string
  tagObject: null | Array<any>
}

interface TownState {
  backcnt: number
  id: string
  man: string
  phone: string
  publishId: string
  state: number
  total: number
  responetime: number
  town: number
}

interface HistText {
  category: string
  content: string
  datetime: string
  department: string
  errResult: string
  id: number
  name: string
  phone: string
  rxtx: string
  tag: string
}