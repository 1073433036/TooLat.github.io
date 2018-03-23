export const pollutant = {
	N: '氨',
	F: '氟化物',
	SO2: '二氧化硫',
	Pb: '铅',
	Hg: '汞',
	Be: '铍',
	Cl: '氯气',
	NOX: '氮氧化物',
	PM: '颗粒物',
	Benzene: '苯可溶物',
	BaP: '苯并芘',
	Fuel: '燃料含硫量',
	H2S: '硫化氢',
	HCl: '氯化氢',
	CO: '一氧化碳',
	H2SO4: '硫酸雾',
	Stink: '恶臭',
	NMHC: '非甲烷总烃',
	ACN: '丙烯腈',
	BTEX: '苯系物',
	CH3COCH3: '丙酮',
	CH3OH: '甲醇',
	Fume: '烟尘',
	Stive: '粉尘',
	Asphalt: '沥青油烟',
	Blackness: '烟气黑度',
	Dioxin: '二噁英'
};

export const pollutionSource = {
	furnace: {
		text: '工业炉窑',
		elements: {
			Fume: '烟尘',
			SO2: '二氧化硫',
			F: '氟化物',
			Pb: '铅',
			Hg: '汞',
			Be: '铍',
			Asphalt: '沥青油烟'
		}
	},
	boiler: {
		text: '生产和生活用锅炉',
		elements: {
			SO2: '二氧化硫',
			NOX: '氮氧化物',
			Blackness: '烟气黑度',
			Fume: '烟尘'
		}
	},
	coking: {
		text: '炼焦',
		elements: {
			PM: '颗粒物',
			Benzene: '苯可溶物',
			SO2: '二氧化硫',
			Blackness: '烟气黑度',
			BaP: '苯并芘'
		}
	},
	cement: {
		text: '',
		elements: {
			PM: '颗粒物',
			SO2: '二氧化硫',
			NOX: '氮氧化物',
			F: '氟化物'
		}
	},
	powerplant: {
		text: '火电厂',
		elements: {
			PM: '颗粒物',
			SO2: '二氧化硫',
			NOX: '氮氧化物',
			Blackness: '烟气黑度',
			Fuel: '燃料含硫量',
		}
	},
	ChemE: {
		text: '化工',
		elements: {
			SO2: '二氧化硫',
			H2S: '硫化氢',
			F: '氟化物',
			NOX: '氮氧化物',
			Cl: '氯气',
			HCl: '氯化氢',
			CO: '一氧化碳',
			H2SO4: '硫酸雾',
			Stink: '恶臭',
			PM: '颗粒物',
		}
	},
	petrochemicals: {
		text: '',
		elements: {
			Fume: '烟尘',
			SO2: '二氧化硫',
			NMHC: '非甲烷总烃',
			ACN: '丙烯腈',
			BTEX: '苯系物',
			Stink: '恶臭'
		}
	},
	metallurgy: {
		text: '冶金',
		elements: {
			SO2: '二氧化硫',
			F: '氟化物',
			Cl: '氯气',
			HCl: '氯化氢',
			CO: '一氧化碳',
			Pb: '铅',
			Fume: '烟尘',
			NOX: '氮氧化物',
		}
	},
	electron: {
		text: '电子',
		elements: {
			BTEX: '苯系物',
			CH3COCH3: '丙酮',
			CH3OH: '甲醇',
			F: '氟化物',
		}
	},
	sulfuricAcid: {
		text: '硫酸工业',
		elements: {
			SO2: '二氧化硫',
			H2SO4: '硫酸雾',
			Fume: '烟尘'
		}
	},
	shipbuilding: {
		text: '船舶工业',
		elements: {
			Fume: '烟尘',
			Stive: '粉尘',
			BTEX: '苯系物'
		}
	},
	steel: {
		text: '钢铁工业',
		elements: {
			Stive: '粉尘',
			SO2: '二氧化硫',
			HCl: '氯化氢',
			NOX: '氮氧化物',
		}
	},
	bituminous: {
		text: '沥青工业',
		elements: {
			Asphalt: '沥青烟',
			Stive: '粉尘',
			BaP: '苯并芘',
		}
	},
	lightIndustry: {
		text: '轻工',
		elements: {
			SO2: '二氧化硫',
			H2S: '硫化氢',
			Hg: '汞',
		}
	},
	metals: {
		text: '金属工业',
		elements: {
			SO2: '二氧化硫',
			Stive: '粉尘',
			Fume: '烟尘',
		}
	},
	superphosphate: {
		text: '',
		elements: {
			F: '氟化物',
			Stive: '粉尘',
			SO2: '二氧化硫',
		}
	},
	fertilizer: {
		text: '化肥',
		elements: {
			N: '氨',
			F: '氟化物',
			NOX: '氮氧化物',
			H2S: '硫化氢',
		}
	},
	saponid: {
		text: '合成洗涤剂',
		elements: {
			Stive: '粉尘',
		}
	},
	incinerator: {
		text: '焚烧炉',
		elements: {
			Fume: '烟尘',
			CO: '一氧化碳',
			SO2: '二氧化硫',
			NOX: '氮氧化物',
			HCl: '氯化氢',
			N: '氨',
			Dioxin: '二噁英'
		}
	},
	leather: {
		text: '皮革',
		elements: {
			H2S: '硫化氢',
			N: '氨',
		}
	},
	fulminate: {
		text: '雷汞工业',
		elements: {
			Hg: '汞',
		}
	},
	citricAcid: {
		text: '柠檬酸工业',
		elements: {
			H2S: '硫化氢',
			Stink: '恶臭'
		}
	},
	monosodiumGlutamate: {
		text: '味精工业',
		elements: {
			H2S: '硫化氢',
			Stink: '恶臭'
		}
	},
	others: {
		text: '其他行业',
		elements: {
			PM: '颗粒物',
			SO2: '二氧化硫',
			NOX: '氮氧化物',
			Blackness: '烟气黑度',
		}
	}
}