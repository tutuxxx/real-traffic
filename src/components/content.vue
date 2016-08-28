<script>
  import ol from 'openlayers';
  import 'ol3-layerswitcher/src/ol3-layerswitcher';
  import geoTransform from '../libs/geoTransform';
  import ips from '../config/ips';
  export default {
    el: '#main-container',
    data: function () {
      return {
        // 决定画点线框是否显示
        ispaint: 1,
        olmap: '',
        coords: '22.53764,114.01991;22.58765,114.08345;22.53765,114.06345;22.63765,114.06345',
        paintTip: '',
        coordType:'gcj02'
      };
    },
    computed: {
      baseUrl: function () {
        var ip = window.location.href.split('//')[1].split(':')[0];
        if (ip === ips.serverIp || ip === 'localhost') {
          return 'http://'+ips.serverIp+':8080';
        } else if (ip === ips.localIp) {
          return 'http://'+ips.localIp+':8080';
        }
      }
    },
    methods: {
      toggle: function () {
        var _this = this;// this保存当前作用域对象，否则setTimeout中this拿不到值
        _this.ispaint = !_this.ispaint;
        setTimeout(function () {
          _this.olmap.updateSize();
        }, 500);
      },
      initOl3: function () {
        // 分辨率，每个象元代表的实地距离
        var resolutions = [
          611.4962265625,
          305.74811328125,
          152.874056640625,
          76.4370283203125,
          38.21851416015625,
          19.10925708007813,
          9.554628540039063,
          4.777314270019532,
          2.388657135009766,
          1.194328567504883,
          0.5971642837524414
        ];

        // 定义瓦片网格
        var tilegrid = new ol.tilegrid.TileGrid({
          extent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
          resolutions: resolutions    // 设置分辨率
        });

        var tileSource = new ol.source.TileImage({  // ol.source.XYZ的父类
          projection: 'EPSG:3857',
          tileGrid: tilegrid,
          tileUrlFunction: function (tileCoord) {
            var z = tileCoord[0] + 8;
            var x = tileCoord[1];
            var y = -tileCoord[2] - 1;
            return 'http://'+ips.baseLayerIp+'/tiles/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vector&STYLE=default&TILEMATRIXSET=ESPG:900913&TILEMATRIX=ESPG:900913:' + z + '&TILEROW=' + y + '&TILECOL=' + x + '&FORMAT=image/png';
          }
        });

        var tileLayer = new ol.layer.Tile({
          source: tileSource,
          type: 'base',
          visible: true,
          title: '底图'
        });

        var openStreetMapLayer = new ol.layer.Tile({
          source: new ol.source.OSM(),
          type: 'base',
          visible: false,
          title: 'OSM'
        });

        // 高德地图层
        var gaodeMapLayer = new ol.layer.Tile({
          source: new ol.source.XYZ({
            url:'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
          }),
          type: 'base',
          visible: false,
          title: '高德'
        });


        // google地图层
        var googleMapLayer = new ol.layer.Tile({
          source: new ol.source.XYZ({
            url:'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i345013117!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0'
          }),
          type: 'base',
          visible: false,
          title: 'Google'
        });

        var trafficRoad = new ol.layer.Tile({
          title: '实时路况',
          source: new ol.source.TileWMS({
            url: this.baseUrl + '/geoserver/pgsql/wms',
            params: { 'LAYERS': 'pgsql:shenzhen_gis', 'TILED': true },
            serverType: 'geoserver'
          })
        });

        var trafficArrow = new ol.layer.Tile({
          title: '道路流向',
          visible: false,
          source: new ol.source.TileWMS({
            url: this.baseUrl + '/geoserver/pgsql/wms',
            params: { 'LAYERS': 'pgsql:guangdong_tools', 'TILED': true },
            serverType: 'geoserver'
          })
        });

        var baseGroup = new ol.layer.Group({
          'title': '底图',
          layers: [
            googleMapLayer,gaodeMapLayer,openStreetMapLayer,tileLayer
          ]
        });

        var overGroup = new ol.layer.Group({
          'title': '叠加图层',
          layers: [
            trafficRoad,
            trafficArrow
          ]
        });

        this.olmap = new ol.Map({
          // 在默认控件的基础上，再加上其他内置的控件
          controls: ol.control.defaults({
            attribution: false,
            rotate: false,
            zoom: false
          }).extend([
            new ol.control.FullScreen(),
            new ol.control.MousePosition({
              projection: ol.proj.get('EPSG:4326'),
              coordinateFormat: function (coordinate) {
                return ol.coordinate.format(coordinate, '{x}, {y}', 5);
              }
            }),
            new ol.control.OverviewMap(),
            new ol.control.ZoomSlider(),
            new ol.control.ZoomToExtent({
              extent: [12670775, 2594979, 12717707, 2572086]
            }),
            new ol.control.LayerSwitcher({
              tipLabel: 'Légende' // Optional label for button
            })
          ]),

          // 设置地图图层
          layers: [
            baseGroup,
            overGroup
          ],
          // 设置显示地图的视图
          view: new ol.View({
            center: ol.proj.transform([114.034428, 22.598805], 'EPSG:4326', 'EPSG:3857'),
            zoom: 12,
            projection: ol.proj.get('EPSG:3857')
          }),
          // 让id为map的div作为地图的容器
          target: 'map'
        });

        var point_div = document.getElementById('expand-point');
        var point_overlay = new ol.Overlay({
          element: point_div,
          positioning: 'center-center'
        });
        this.olmap.addOverlay(point_overlay);
        point_overlay.setPosition(ol.proj.transform([114.034428, 22.598805], 'EPSG:4326', 'EPSG:3857'));
      },
      drawPoints: function () {
        var points=this.coords.split(';');

        var vectorSource = new ol.source.Vector({
          features: []
        });

        var vectorLayer = new ol.layer.Vector({
          source: vectorSource
        });

        this.olmap.addLayer(vectorLayer);

        var rome = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.transform([114.034428, 22.598805], 'EPSG:4326', 'EPSG:3857'))
        });
        rome.setStyle(new ol.style.Style({
          image: new ol.style.Icon( ({
            color: 'red',
            src: '../images/dot.png'
          }))
        }));

        vectorLayer.getSource().addFeature(rome);
      }

    },
    ready: function () {
      this.initOl3();
    },
    beforeDestroy: function () {

    }
  };

</script>

<template lang="pug">
  #expand-point
  #map(:class="[ispaint===0?'':ispaint?'small-map':'big-map']")
    .btn-container.ol-control
      button.paint-point(@click="toggle")
        i.fa.fa-edit
  .paint-container(animation="paint",v-show="ispaint")
    .paint-title
      label
        | 源坐标系：GCJ-02
        input(name="latlon_type",value="gcj02",type="radio",v-model="coordType")
      label
        | WGS-84
        input(name="latlon_type",value="wgs84",type="radio",v-model="coordType")
      label
        | BD0911
        input(name="latlon_type",value="bd0911",type="radio",v-model="coordType")
      input.paint-btn(@click="drawPoints",value="画轨迹点",type="button")
      input.paint-btn(@click="drawLines",value="画轨迹线",type="button")
      input.paint-btn(@click="drawEoLine",value="画奇偶线",type="button")
      input.paint-btn(@click="clearLines",value="清除轨迹",type="button")
      span#trace_info {{paintTip}}
    .paint-content
      textarea#txt_latlons(v-model="coords")
</template>

<style lang="sass">
  @import '../../node_modules/openlayers/dist/ol.css';
  @import '../../node_modules/ol3-layerswitcher/src/ol3-layerswitcher.css';
  @import '../styles/map.scss';
  @keyframes small-map {
    0% {
      height: 100%
    }
    100% {
      height: calc(100% - 120px)
    }
  }

  @keyframes big-map {
    0% {
      height: calc(100% - 120px)
    }
    100% {
      height: 100%
    }
  }

  .main {
    position: relative;
    height: 100%;

  #map {
    height: 100%;
    background: url('../images/map-background.jpg') repeat;
    position: relative;

  &.small-map {
    height: calc(100% - 120px);
    animation: small-map .5s;
  }

  &.big-map {
    height: 100%;
    animation: big-map .5s;
  }

  .btn-container {
    position: absolute;
    bottom: 1rem;
    right: .5rem;
    z-index: 1000;
    width: 28px;
    height: 28px;

  .paint-point {
    width: 26px;
    height: 26px;
    vertical-align: middle;
  }

  }

  }
  .paint-container {
    width: 100%;
    height: 120px;

  &.paint-transition {
    transition: all .5s ease;
    height: 120px;
    background-color: #ccc;
    overflow: hidden;
  }

  /* .paint-enter 定义进入的开始状态 */
  /* .paint-leave 定义离开的结束状态 */
  &.paint-enter,&.paint-leave {
    height: 0;
  }

  .paint-title {
    background: linear-gradient(90deg, #1d976c 10%, #93f9b9 90%);
    color: #fff;
    height:1rem;
    font-size: 1rem;

      .paint-btn{
        background: #1d976c;
        border-radius:.3rem;
        cursor:pointer;
        margin-left:.4rem;

      &:hover{
         background: #2ECC71;
       }
      }

      label{
        margin-right:.5rem;

        input{
          margin-left:.3rem;
          height:16px;
        }
      }
  }

  .paint-content{
    height:calc(100% - 1rem);
    width:100%;
  }

  textarea{
    font-family:arial,sans-serif;
    font-size:.8rem;
    height:100%;
    width:100%;

    &:focus{
       -webkit-box-shadow:inset 0 0 5px red;
       -moz-box-shadow:inset 0 0 5px red;
       box-shadow:inset 0 0 5px red;
     }
  }


  }

  }
</style>
