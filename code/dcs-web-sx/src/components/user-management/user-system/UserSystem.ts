import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './UserSystem.html?style=./UserSystem.scss'
import { UserClient } from '../../../util/clientHelper'

@WithRender
@Component
export default class UserSystem extends Vue {
	display: any = {
			popup: false,
			editorPopup: false,
			alertPopup: false,
			rolePopup: false,
			delRolePopup: false,
	}
	userList: any = {}         		//用户列表
	listLength: number = 0        //数据长度
	numOfPage: number = 10				//每页多少个数据
	dealUserList: any = []     		//numOfPage个为1个数组
	allPageNum: number = 0        //总页数
	currentPage: number = 0       //当前页数
	allSelect: boolean = false    //全选
	editKey:string = null		      //编辑信息关键字
	alertPopupText = null
	userInfo: string[] = ['username','name','roleId','phoneNum','pwd','email']     //用户信息属性名
	allRoles: any = null				 //角色id

	message: string = null

	newUsername: string = null
	newName: string = null
	newRoleId: string = null
	newPhoneNum: string = null
	newPwd: string = null
	newEmail: string = null

	username: string = null
	name: string = null
	roleId: string = null
	phoneNum: string = null
	pwd: string = null
	email: string = null

	roleName: string = ''
	roleDesc: string = ''

	pageSizes: number[] = [10, 20, 30, 40, 50]
	isPageSizePopupOn: boolean = false

	baseUrl = 'http://10.148.83.228:8086'
	comUrl = 'user/post/,/post'

	async initUserList() {
		const url = `${this.baseUrl}/user/getallusers/${this.comUrl}?random=${Math.random()}`; 
		let res: any = await fetch(url);
		let mes: any = await res.json();
		if(mes.result === 'S_OK') {
				const obj = mes.tagObject;
				for(let i in obj) {
						const id = obj[i].userId;
						this.$set(this.userList, id, Object.assign({selected: false, show: true}, obj[i]));
				}
				this.dealList();
		} else {
			Vue['prototype']['$message']({
				type: 'error',
				message: mes.description
			})
		}
	}
	dealList() {
		const userList = this.userList;
		let showUserList = {};
		for(let i in userList) {
				if(userList[i].show)
						showUserList[i] = userList[i];
		}
		this.listLength = Object.keys(showUserList).length;
		this.allPageNum = Math.ceil(this.listLength / this.numOfPage);

		this.dealUserList = [];
		//按每10个数据为一组格式化数据
		const showUserListKeys = Object.keys(showUserList);
		for(let i = 0; i < this.allPageNum; i++) {
				let obj = {};
				for(let j = 0; j < this.numOfPage; j++) {
						const key = showUserListKeys[this.numOfPage*i+j];
						if(key) obj[key] = userList[key];
				}
				this.dealUserList.push(obj);
		}
		console.log(this.dealUserList);
	}
	//新增用户
	toggleUserPopup(bool) {
		this.display.popup = bool;
		if(!bool)
				this.newUsername = this.newName = this.newRoleId = this.newPhoneNum = this.newPwd = this.newEmail = undefined;
	}
	async submitInfo() {
		if(!this.newName || !this.newRoleId) {
			let tip = !this.newName ? '姓名不得为空！' : '角色名称不得为空！'
			Vue['prototype']['$message']({
				type: 'error',
				message: tip
			})
			return
		}
		let nickname = this.newUsername ? this.newUsername : '',
				name = this.newName ? this.newName : '',
				roleId = this.newRoleId ? this.newRoleId : '',
				phoneNum = this.newPhoneNum ? this.newPhoneNum : '',
				password = this.newPwd ? this.newPwd : '',
				email = this.newEmail ? this.newEmail : '';
		const url = `${this.baseUrl}/user/register/${this.comUrl}?nickname=${nickname}&name=${name}&roleId=${roleId}&phoneNum=${phoneNum}&password=${password}&email=${email}`;

		let res: any = await fetch(url);
		let mes: any = await res.json();
		if(mes.result === 'S_OK') {
			this.initUserList();
			this.toggleUserPopup(false);
			Vue['prototype']['$message']({
				type: 'success',
				message: mes.description
			})
		} else {
			Vue['prototype']['$message']({
				type: 'error',
				message: mes.description
			})
		}
	}
	//删除按钮 删除所有选中
	deleteAllSelect() {
		let selectArr = [];
		const userList = this.userList;
		for(let i in userList) {
				if(userList[i].selected) {
						selectArr.push(i);
				}
		}
		if(!selectArr.length) {
			Vue['prototype']['$message']({
				type: 'error',
				message: '请先选择需要删除的信息'
			})
			return
		}
		Vue['prototype']['$confirm']('确定删所有选中的信息吗？', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(() => {
			for(let key of selectArr) {
				this.delUserMsg(key);
			}
		}).catch(() => {  })
	}
	//通过id删除数据函数
	async delUserMsg(key) {
		const url = `${this.baseUrl}/user/delete/id/${this.comUrl}?userId=${key}`;
		let res: any = await fetch(url);
		let mes: any = await res.json();
		if(mes.result === 'S_OK') {
			delete this.userList[key];
			this.dealList();
			//this.initUserList();
			Vue['prototype']['$message']({
				type: 'success',
				message: '删除成功!'
			})
		} else {
			Vue['prototype']['$message']({
				type: 'error',
				message: mes.description
			})
		}
	}
	//全选 单选
	toggleAllSel() {
		this.allSelect = !this.allSelect;
		const userList = this.userList;
		for(let i in userList) {
				userList[i].selected = this.allSelect;
		}
	}
	toggleDetailSel(key) {
		this.userList[key].selected = !this.userList[key].selected;
	}
	//修改用户信息
	toggleEditPopup(bool) {
		this.display.editorPopup = bool;
	}
	editUserMsg(msg, key) {
		this.username = msg.username;
		this.name = msg.name;
		this.roleId = msg.roleId;
		this.phoneNum = msg.phoneNum;
		this.pwd = msg.pwd;
		this.email = msg.email;
		this.toggleEditPopup(true);
		this.editKey = key;
	}
	deleteUserMsg(key) {
		Vue['prototype']['$confirm']('确定删除此行信息吗？', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(() => {
			this.delUserMsg(key);
		}).catch(() => {  })
	}
	async submitEditInfo() {
		if(!this.name || !this.roleId) {
			let tip = !this.name ? '姓名不得为空！' : '角色名称不得为空！'
			Vue['prototype']['$message']({
				type: 'error',
				message: tip
			})
			return
		}
		const key = this.editKey;
		let obj = this.userList[key];
		obj.username = this.username ? this.username : '';
		obj.name = this.name ? this.name : '';
		obj.roleId = this.roleId ? this.roleId : '';
		obj.phoneNum = this.phoneNum ? this.phoneNum : '';
		obj.pwd = this.pwd ? this.pwd : '';
		obj.email = this.email ? this.email : '';
		let suffix = '';
		for(let i in obj) {
				if(i !== 'selected' && i !== 'show')
						suffix += '&' + i + '=' + obj[i];
		}
		suffix = suffix.substring(1);
		const url = `${this.baseUrl}/user/update/${this.comUrl}?` + suffix;
		let res: any = await fetch(url);
		let mes: any = await res.json();
		if(mes.result === 'S_OK') {
				this.initUserList();
				this.toggleEditPopup(false);
		} else {
			Vue['prototype']['$message']({
				type: 'error',
				message: mes.description
			})
		}
	}
	//更改当前页数
	changePageNaum(type) {
		if(type === 0 && this.currentPage !== 0) this.currentPage--; 
		if(type === 1 && this.currentPage < this.allPageNum - 1) this.currentPage++;
	}
	//搜索
	search() {
		const message = this.message;
		if(message) {
				const msgRegExp = new RegExp(message);
				let userList = this.userList;
				for(let i in userList) {
						let info = userList[i];
						info.show = false;
						for(let det of this.userInfo) {
								if(msgRegExp.test(info[det])) {
										info.show = true;
										break;
								}
						}
				}
				this.currentPage = 0;
				this.dealList();
		} else {
				for(let i in this.userList) {
						this.userList[i].show = true;
				}
				this.dealList();
		}
	}
	//初始化所有角色id	
	async initAllRoles() {
		let res = await UserClient.getAllRoles();
		if(res) {
			let obj = {}
			for(let info of res) {
				obj[info.roleId] = info
			}
			this.allRoles = { ...obj };
		}
	}
	toggleRolePopup() {
		this.display.rolePopup = !this.display.rolePopup
	}
	async insertRole() {
		let res = await UserClient.insertRole(this.roleName, this.roleDesc);
		if(res) {
			Vue['prototype']['$message']({
				type: 'success',
				message: '角色添加成功!'
			})
			this.initAllRoles()
		} else {
			Vue['prototype']['$message']({
				type: 'error',
				message: '角色添加失败!'
			})
		}
	}

	toggleDelRolePopup() {
		this.display.delRolePopup = !this.display.delRolePopup
	}
	delRole(key) {
		Vue['prototype']['$confirm']('确定删所该部门角色吗？', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(async () => {
			let res = await UserClient.deleteRole(key)
			if(res) {
				Vue['prototype']['$message']({
					type: 'success',
					message: '角色删除成功!'
				})
				this.initAllRoles()
			} else {
				Vue['prototype']['$message']({
					type: 'error',
					message: '角色删除失败!'
				})
			}
		}).catch(() => {  })
	}

	togglePageSize(num: number) {
		this.isPageSizePopupOn = false
		if (this.numOfPage === num) return
		this.numOfPage = num
		this.dealList()
	}

	async mounted () {
		await this.initAllRoles();
		this.initUserList();
	}
}