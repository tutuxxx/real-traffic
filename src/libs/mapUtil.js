/**
 * Created by ysj on 16/8/29.
 */
import geoTransform from './geoTransform';

var mapUtil = {
  getLayerByAtri: function (map, atriName, atriVal) {
    var curLayer;
    map.getLayers().forEach(function (layer, i) {
      if (layer instanceof ol.layer.Group) {
        layer.getLayers().forEach(function (sublayer, j) {
          if (sublayer.get(atriName) === atriVal) {
            curLayer = sublayer;
          }
        });
      }
    });
    return curLayer;
  },
  transPoints: function (coords, coordType) {
    if (coords === '') {
      return '请输入正确的坐标!';
    }
    // 正则表达式要求
    coords = ',' + coords;
    var points = [];
    var lngs = coords.match(/\d{3}\.\d+/g);
    var lats = coords.match(/[^\d]{1}\d{2}\.\d+/g);

    if (lngs.length == lats.length) {
      for (var i = 0; i < lngs.length; i++) {

        var lat = lats[i].substring(1);
        var lng = lngs[i];
        var trans = [];
        if (coordType == 'wgs84') {
          console.log(lat);
          trans = geoTransform.wgs2gcj(Number(lng), Number(lat));
        } else if (coordType == 'gcj02') {
          trans = [Number(lng), Number(lat)];
        } else if (coordType == 'bd0911') {
          trans = geoTransform.bd2gcj(Number(lng), Number(lat));
        }
        var point = [trans[0], trans[1]];
        points.push(point);
      }
    } else {
      return "输入的精度和纬度个数不匹配!";
    }

    return points;
  },
  drawPoints: function (map, coords, layerName, coordType) {
    var vectorLayer = this.getLayerByAtri(map, 'title', layerName);
    vectorLayer.getSource().clear();
    var points = this.transPoints(coords, coordType);

    if (typeof points == 'string')
      return points;

    points.forEach(function (item, i) {
      var feature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform(points[i], 'EPSG:4326', 'EPSG:3857'))
      });

      feature.setStyle(new ol.style.Style({
        image: new ol.style.Icon(({
          color: '#00ff00',
          src: require('../images/dot.png')
        })),
        text: new ol.style.Text({
          font: '12px',
          text: i + 1 + '',
          offsetY: -15,
          fill: new ol.style.Fill({
            color: 'black'
          })
        })
      }));

      setTimeout(function () {
        vectorLayer.getSource().addFeature(feature);
      }, i * 100);
    });
    return "";
  },
  drawLines: function (map, coords, layerName, coordType) {
    var vectorLayer = this.getLayerByAtri(map, 'title', layerName);
    var points = this.transPoints(coords, coordType);

    vectorLayer.getSource().clear();
    points.forEach(function (obj, idx) {
      points[idx] = ol.proj.transform(obj, 'EPSG:4326', 'EPSG:3857');
    })
    var feature = new ol.Feature({
      geometry: new ol.geom.LineString(
        points)
    });
    feature.setStyle(new ol.style.Style({
      stroke: new ol.style.Stroke({
        width: 3,
        color: [255, 0, 0, 1]
      })
    }));
    vectorLayer.getSource().addFeature(feature);
  },
  drawEoLine: function (map, coords, layerName, coordType) {
    var vectorLayer = this.getLayerByAtri(map, 'title', layerName);
    var points = this.transPoints(coords, coordType);
    var oddPoints = [], evenPoints = [];

    vectorLayer.getSource().clear();
    points.forEach(function (obj, idx) {
      if ((idx + 1) % 2 == 0) {
        evenPoints.push(ol.proj.transform(obj, 'EPSG:4326', 'EPSG:3857'));
      } else {
        oddPoints.push(ol.proj.transform(obj, 'EPSG:4326', 'EPSG:3857'));
      }
    })
    var oddFeature = new ol.Feature({
      geometry: new ol.geom.LineString(
        oddPoints)
    });
    oddFeature.setStyle(new ol.style.Style({
      stroke: new ol.style.Stroke({
        width: 3,
        color: [255, 0, 0, 1]
      })
    }));
    var evenFeature = new ol.Feature({
      geometry: new ol.geom.LineString(
        evenPoints)
    });
    evenFeature.setStyle(new ol.style.Style({
      stroke: new ol.style.Stroke({
        width: 3,
        color: [0, 0, 0, 1]
      })
    }));
    vectorLayer.getSource().addFeature(oddFeature);
    vectorLayer.getSource().addFeature(evenFeature);
  }
};

module.exports = mapUtil;
