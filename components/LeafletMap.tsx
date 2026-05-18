import React, { useCallback, useEffect, useMemo, useRef } from "react";
import WebView from "react-native-webview";
import { regionCoordinates } from "@/data/regionCoordinates";
import type { MapLayer, Region } from "@/types";

interface LeafletMapProps {
  regions: Region[];
  selectedRegion?: Region;
  layer: MapLayer;
  onRegionSelect: (region: Region) => void;
  style?: object;
}

type RegionWithCoords = Region & { lat?: number; lng?: number };

function buildHTML(regions: RegionWithCoords[], selectedId: string | null, layer: string): string {
  const data = JSON.stringify(
    regions.map((r) => ({
      id: r.id,
      name: r.name,
      lat: r.lat,
      lng: r.lng,
      climateType: r.climateType,
      droughtRisk: r.droughtRisk,
      topCrops: r.topCrops,
      confidence: r.confidence,
      annualRainfall: r.annualRainfall,
      avgTemperature: r.avgTemperature,
    }))
  );

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%;overflow:hidden;background:#EAF4E6;font-family:-apple-system,BlinkMacSystemFont,sans-serif}
#map{height:100vh;width:100vw}
.leaflet-control-zoom{border:none!important;box-shadow:0 4px 14px rgba(0,0,0,0.15)!important}
.leaflet-control-zoom a{width:34px!important;height:34px!important;line-height:34px!important;font-size:18px!important;border-radius:10px!important;background:#fff!important;color:#1F5E3B!important;border:1px solid #E7DDC7!important}
.leaflet-control-zoom a:hover{background:#DDEBDD!important}
.leaflet-bar{border:none!important;gap:4px;display:flex;flex-direction:column}
.leaflet-bar a:first-child,.leaflet-bar a:last-child{border-radius:10px!important;border-bottom:1px solid #E7DDC7!important}
.region-tip{background:#fff!important;border:none!important;border-radius:999px!important;padding:3px 10px!important;font-size:11px!important;font-weight:900!important;color:#17231A!important;box-shadow:0 3px 12px rgba(0,0,0,0.18)!important;white-space:nowrap!important}
.leaflet-tooltip-bottom::before,.leaflet-tooltip-top::before{display:none!important}
.leaflet-control-attribution{font-size:9px!important;opacity:0.7}
.pulse{animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.7}}
</style>
</head>
<body>
<div id="map"></div>
<script>
(function(){
var REGIONS=${data};
var selectedId=${JSON.stringify(selectedId)};
var currentLayer=${JSON.stringify(layer)};
var markers={};

var map=L.map('map',{
  center:[-6.3,35.0],
  zoom:6,
  zoomControl:true,
  attributionControl:true,
  maxBounds:[[-15,24],[5,48]],
  maxBoundsViscosity:0.7
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom:18
}).addTo(map);

L.control.zoom({position:'topright'}).addTo(map);

function getColor(r){
  if(currentLayer==='Drought Risk'){
    return r.droughtRisk==='Low'?'#1F5E3B':r.droughtRisk==='Medium'?'#DFAF37':'#B91C1C';
  }
  if(currentLayer==='Rainfall'){
    var m=(r.annualRainfall||'').match(/\\d+/g)||['700'];
    var mm=parseInt(m[0]);
    return mm>=1400?'#1F5E3B':mm>=900?'#2D9CDB':mm>=600?'#DFAF37':'#D97706';
  }
  if(currentLayer==='Temperature'){
    var t=(r.avgTemperature||'').match(/\\d+/g)||['25'];
    var hi=parseInt(t[t.length-1]);
    return hi<=22?'#2D9CDB':hi<=28?'#1F5E3B':'#D97706';
  }
  if(currentLayer==='Soil'){
    return '#8B6F47';
  }
  if(currentLayer==='Market Access'){
    var c=r.confidence||80;
    return c>=90?'#1F5E3B':c>=80?'#2D9CDB':'#DFAF37';
  }
  var conf=r.confidence||80;
  return conf>=90?'#1F5E3B':conf>=80?'#2D9CDB':'#DFAF37';
}

function send(data){
  var s=JSON.stringify(data);
  if(window.ReactNativeWebView){window.ReactNativeWebView.postMessage(s);}
  else if(window.parent!==window){window.parent.postMessage(s,'*');}
}

function buildMarkers(){
  Object.values(markers).forEach(function(m){try{map.removeLayer(m);}catch(e){}});
  markers={};
  REGIONS.forEach(function(r){
    if(!r.lat||!r.lng)return;
    var sel=r.id===selectedId;
    var color=getColor(r);
    var circle=L.circleMarker([r.lat,r.lng],{
      radius:sel?15:9,
      fillColor:sel?'#DFAF37':color,
      color:'#ffffff',
      weight:sel?3:2,
      opacity:1,
      fillOpacity:sel?1:0.88,
      className:sel?'pulse':''
    }).addTo(map);
    circle.bindTooltip(r.name,{
      permanent:sel,
      className:'region-tip',
      direction:'top',
      offset:[0,-6]
    });
    circle.on('click',function(){send({type:'regionSelected',regionId:r.id});});
    markers[r.id]=circle;
  });
}

buildMarkers();

window.updateMap=function(data){
  if(data.type==='selectRegion'){
    selectedId=data.regionId;
    buildMarkers();
    var r=REGIONS.find(function(x){return x.id===data.regionId;});
    if(r&&r.lat&&r.lng){map.flyTo([r.lat,r.lng],8,{duration:1.0,easeLinearity:0.5});}
  }
  else if(data.type==='setLayer'){
    currentLayer=data.layer;
    buildMarkers();
  }
};

// Listen for messages injected via injectJavaScript wrapper
window.addEventListener('message',function(e){
  try{var d=JSON.parse(e.data);if(window.updateMap)window.updateMap(d);}catch(err){}
});
document.addEventListener('message',function(e){
  try{var d=JSON.parse(e.data);if(window.updateMap)window.updateMap(d);}catch(err){}
});

send({type:'mapReady'});
})();
</script>
</body>
</html>`;
}

export function LeafletMap({ regions, selectedRegion, layer, onRegionSelect, style }: LeafletMapProps) {
  const webViewRef = useRef<WebView>(null);
  const isReady = useRef(false);
  const prevSelectedId = useRef<string | undefined>(undefined);
  const prevLayer = useRef<MapLayer>(layer);

  const regionsWithCoords: RegionWithCoords[] = useMemo(
    () =>
      regions.map((r) => ({
        ...r,
        lat: regionCoordinates[r.id]?.lat,
        lng: regionCoordinates[r.id]?.lng,
      })),
    [regions]
  );

  const html = useMemo(
    () => buildHTML(regionsWithCoords, selectedRegion?.id ?? null, layer),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const inject = useCallback((payload: object) => {
    const js = `try{if(window.updateMap)window.updateMap(${JSON.stringify(payload)});}catch(e){} true;`;
    webViewRef.current?.injectJavaScript(js);
  }, []);

  useEffect(() => {
    if (!isReady.current) return;
    if (selectedRegion?.id !== prevSelectedId.current) {
      prevSelectedId.current = selectedRegion?.id;
      if (selectedRegion) inject({ type: "selectRegion", regionId: selectedRegion.id });
    }
  }, [selectedRegion?.id, inject]);

  useEffect(() => {
    if (!isReady.current) return;
    if (layer !== prevLayer.current) {
      prevLayer.current = layer;
      inject({ type: "setLayer", layer });
    }
  }, [layer, inject]);

  const handleMessage = useCallback(
    (event: { nativeEvent: { data: string } }) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === "mapReady") {
          isReady.current = true;
          if (selectedRegion) inject({ type: "selectRegion", regionId: selectedRegion.id });
        }
        if (data.type === "regionSelected") {
          const found = regions.find((r) => r.id === data.regionId);
          if (found) onRegionSelect(found);
        }
      } catch {}
    },
    [regions, selectedRegion, inject, onRegionSelect]
  );

  return (
    <WebView
      ref={webViewRef}
      source={{ html }}
      style={[{ flex: 1 }, style]}
      onMessage={handleMessage}
      javaScriptEnabled
      domStorageEnabled
      originWhitelist={["*"]}
      scrollEnabled={false}
    />
  );
}
