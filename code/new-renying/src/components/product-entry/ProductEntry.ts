import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './ProductEntry.html?style=./ProductEntry.scss'

import * as CONFIG from '../../config/productId'

import CreatearticlePopup from '../Product/createarticle-popup/CreatearticlePopup'
import HistoryarticlePopup from '../Product/historyarticle-popup/HistoryarticlePopup'
import WindRadar from '../Product/wind-radar/WindRadar'
import localCloud from '../Product/local-cloud/LocalCloud'
import NowCasting from '../Product/now-casting/NowCasting'
import MicradiationPopup from '../Product/micradiation-popup/MicradiationPopup'
import ActualproductPopup from '../Product/actualproduct-popup/ActualproductPopup'
import EcwmfInter from '../Product/ecwmf-inter/EcwmfInter'
import SunflowerInfrared from '../Product/sunflower-infrared/SunflowerInfrared'
import reservoirLevel from '../Product/reservoir-level/ReservoirLevel'
import riverLevel from '../Product/river-level/RiverLevel'
import forestFire from '../Product/forest-fire/ForestFire'
import dryCondition from '../Product/dry-condition/DryCondition'
import grapes1km from '../Product/grapes-1km/Grapes1km'
import grapes3km from '../Product/grapes-3km/Grapes3km'
import weatherForecast from '../Product/weather-forecast/WeatherForecast'
import agricultureAnalysis from '../Product/agricultrue-analysis/AgricultureAnalysis'
import SatelliteProduct from '../Product/satellite-product/SatelliteProduct'
import GrapesMode from '../Product/grapes-mode/GrapesMode'
import SatelliteCloud from '../Product/satelite-cloud/SateliteCloud'

@WithRender
@Component
export default class ProductEntry extends Vue {
  @Getter('systemStore/articleViewHolder_global') articleViewHolder_global
  @Getter('systemStore/productViewHolder_global') productViewHolder_global

  articleView = null
  windRadarView = null
  localCloudView = null
  castingView = null
  micradiationView = null
  actualproductView = null
  ecwmfInterView = null
  sunflowerView = null
  windradarView = null
  reservoirLevelView = null
  riverLevelView = null
  forestFireView = null
  dryConditionView = null
  grapes1kmView = null
  grapes3kmView = null
  weatherForecastView = null
  agricultureAnalysisView = null
  satelliteProductView = null
  grapesModeView = null
  satelliteCloudView = null

  @Watch('articleViewHolder_global')
  onarticleViewHolder_globalChanged(val: any, oldVal: any): void {
    if (val.type === 'create') this.articleView = CreatearticlePopup
    else if (val.type === "history") this.articleView = HistoryarticlePopup
    else this.articleView = null
  }

  @Watch('productViewHolder_global')
  onproductViewHolder_globalChanged(val: any, oldVal: any): void {
    this.localCloudView = val[CONFIG.localCloud] ? localCloud : null
    this.castingView = val[CONFIG.nowCasting] ? NowCasting : null
    this.micradiationView = val[CONFIG.micradiation] ? MicradiationPopup : null
    this.actualproductView = val[CONFIG.actualproduct] ? ActualproductPopup : null
    this.ecwmfInterView = val[CONFIG.ecwmfInter] ? EcwmfInter : null
    this.sunflowerView = val[CONFIG.sunflower] ? SunflowerInfrared : null
    this.windradarView = val[CONFIG.windradar] ? WindRadar : null
    this.reservoirLevelView = val[CONFIG.reservoirLevel] ? reservoirLevel : null
    this.riverLevelView = val[CONFIG.riverLevel] ? riverLevel : null
    this.forestFireView = val[CONFIG.forestFire] ? forestFire : null
    this.dryConditionView = val[CONFIG.dryCondition] ? dryCondition : null
    this.grapes1kmView = val[CONFIG.grapes1km] ? grapes1km : null
    this.grapes3kmView = val[CONFIG.grapes3km] ? grapes3km : null
    this.weatherForecastView = val[CONFIG.weatherForecast] ? weatherForecast : null
    this.agricultureAnalysisView = val[CONFIG.agricultureAnalysis] ? agricultureAnalysis : null
    this.satelliteProductView = val[CONFIG.satelliteProduct] ? SatelliteProduct : null
    this.grapesModeView = val[CONFIG.grapesMode] ? GrapesMode :null
    this.satelliteCloudView = val[CONFIG.satelliteCloud] ? SatelliteCloud : null
  }
}