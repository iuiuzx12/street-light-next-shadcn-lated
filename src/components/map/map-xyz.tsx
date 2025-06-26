import React, { ReactElement, useEffect, useRef, useState } from "react";
import { Feature, Map, Overlay, View } from "ol";
import { fromLonLat, transformExtent } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import "ol/ol.css";
import { Point } from "ol/geom";
import { Style as OLStyle, Icon as OLIcon } from "ol/style";
import "@/app/styles/map.css";
import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";
import {Card, CardContent} from "../ui/card"
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { ListLatLong } from "@/interface/map";
import ButtonModeAuto from "../button/btn-mode-auto";
import Attribution from 'ol/control/Attribution';
import { RuleUserItem } from "@/model/rule";
import { X , Loader2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";




function calculateNewCoordinates(lat: number, long: number, distanceKm: number) {
  const earthRadiusKm = 6371;
  const deltaLat = distanceKm / earthRadiusKm;
  const newLatUp = lat + deltaLat * (180 / Math.PI);
  const newLatDown = lat - deltaLat * (180 / Math.PI);
  const deltaLong =
    distanceKm / (earthRadiusKm * Math.cos(lat * (Math.PI / 180)));
  const newLongRight = long + deltaLong * (180 / Math.PI);
  const newLongLeft = long - deltaLong * (180 / Math.PI);
  return {
    top: { lat: newLatUp, long: long },
    bottom: { lat: newLatDown, long: long },
    right: { lat: lat, long: newLongRight },
    left: { lat: lat, long: newLongLeft },
  };
}


export type OutputDataMap = {
  id?: string;
  gateway_id?: string;
  imsi?: string;
  lat?: string;
  lng?: string;
  status: string;
  type_schedule: string;
  using_sensor: string;
  last_power: string;
};

export type DetailImsi = {
  group?: any | null;
  imsi?: any | null;
  gateway_id?: any | null;
  type_schedule?: any | null;
  using_sensor?: any | null;
  last_update?: any | null;
  last_command?: any | null;
  last_status?: any | null;
  number_gov?: any | null;
  street_light_name: any | null;
} | null;

interface InputDataMap {
  dataRule : RuleUserItem
  data: ListLatLong[] | null;
  high  : string;
}

const DetailsSkeleton = () => (
  <div className="space-y-3">
    <div className="space-y-2">
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[220px]" />
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[240px]" />
      <Skeleton className="h-4 w-[180px]" />
      <Skeleton className="h-4 w-[210px]" />
    </div>
    <div className="grid grid-cols-3 gap-2 pt-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  </div>
);


const StaticMapXYZComponent: React.FC<InputDataMap> = ( {data , high , dataRule}) => {
  const t = useTranslations("MapTotal");

  const mapRef = useRef(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isLoadingOpen, setLoadingOpen] = React.useState(false);
  const [isLoadingClose, setLoadingClose] = React.useState(false);
  const [isLoadingRead, setLoadingRead] = React.useState(false);
  const [isDisabledOpen , setDisabledOpen] = React.useState(true);
  const [isDisabledClose , setDisabledClose] = React.useState(true);
  const [isDisabledRead , setDisabledRead] = React.useState(true);
  const [dataDetailImsi, setDataDetailImsi] = React.useState<DetailImsi>(null);
  const [btnMode, setBtnMode] = React.useState<ReactElement<any, any>>();
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID ?? "LOCAL";

  const popupRef = useRef<Overlay | null>(null);

  useEffect(() => {
    if (data) {
      //console.log(data)
    }

    const lat = Number(process.env.NEXT_PUBLIC_MAP_LAT ?? 14.031702);
    const lng = Number(process.env.NEXT_PUBLIC_MAP_LONG ?? 100.344048);
    const zoom = Number(process.env.NEXT_PUBLIC_MAP_ZOOM ?? 12);
    const km = Number(process.env.NEXT_PUBLIC_MAP_KM ?? 20);

    const icons: { [key: number]: string } = {
      0: "/icon/lamp/lamp-gray-a.png",
      1: "/icon/lamp/lamp-gray-m.png",
      2: "/icon/lamp/lamp-gray-e.png",
      3: "/icon/lamp/lamp-gray-dis.png",
      4: "/icon/lamp/lamp-green-a.png",
      5: "/icon/lamp/lamp-green-m.png",
      6: "/icon/lamp/lamp-green-e.png",
      7: "/icon/lamp/lamp-green-dis.png",
      8: "/icon/lamp/lamp-yellow.png",
      9: "/icon/lamp/lamp-blue-a.png",
      10: "/icon/lamp/lamp-red-dis24.png",
    };

    const dataLatLong = calculateNewCoordinates(lat, lng, km);
    const extent = [
      dataLatLong.left.long,
      dataLatLong.bottom.lat,
      dataLatLong.right.long,
      dataLatLong.top.lat,
    ];

    const map = new Map({
      //target: "map",
      target: mapRef.current!,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: process.env.NEXT_PUBLIC_MAP_URL,
            attributions: [
              '© <a href="https://qgis.org/">QGIS</a>',
              '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
              '<a href="https://hub.docker.com/r/maptiler/tileserver-gl">TileServer GL</a>',
            ],
          }),
        }),

        new VectorLayer({
          source: new VectorSource({
            features: [],
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([lng, lat]),
        zoom: zoom,
        minZoom: zoom - 10,
        maxZoom: zoom + 10,
        extent: transformExtent(extent, "EPSG:4326", "EPSG:3857"),
      }),
      controls: [
        new Attribution({
          collapsible: false, 
        }),
      ],
    });

    const vectorSource = new VectorSource();
    data?.forEach((item: OutputDataMap) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([Number(item.lng), Number(item.lat)])),
        imsi: item.imsi,
        gateway_id : item.gateway_id,
        type_schedule : item.type_schedule,
        using_sensor : item.using_sensor,
        
      });

      //var icon_map;
      let icon_map = Number(0);

      switch (item.status) {
        case "0":
          if (
            item.type_schedule !== "manual" &&
            item.using_sensor.toLowerCase() !== "false"
          ) {
            icon_map = 0;
          } else {
            icon_map = 1;
          }
          break;
        case "1":
          if (
            item.type_schedule !== "manual" &&
            item.using_sensor.toLowerCase() !== "false"
          ) {
            icon_map = 4;
          } else {
            icon_map = 5;
          }
          break;
        case "2":
          if (
            item.type_schedule !== "manual" &&
            item.using_sensor.toLowerCase() !== "false"
          ) {
            icon_map = 0;
          } else {
            icon_map = 1;
          }
          break;
        case "3":
          if (parseInt(item.last_power) > 5) {
            icon_map = 6;
          } else {
            icon_map = 2;
          }
          break;
        case "4":
          if (
            item.type_schedule !== "manual" &&
            item.using_sensor.toLowerCase() !== "false"
          ) {
            icon_map = 10;
          } else {
            icon_map = 10;
          }
          break;
        case "5":
          if (parseInt(item.last_power) > 5) {
            icon_map = 7;
          } else {
            icon_map = 3;
          }
          break;
        case "6":
          if (parseInt(item.last_power) > 5) {
            icon_map = 7;
          } else {
            icon_map = 3;
          }
          break;
      }

      //console.log(item);
      const style = new OLStyle({
        image: new OLIcon({
          src: icons[icon_map],
          scale: 0.5,
          anchor: [0.5, 1],
        }),
      });

      feature.setStyle(style);
      vectorSource.addFeature(feature);
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    map.addLayer(vectorLayer);

    if (!popupRef.current) {
        const popupElement = overlayRef.current;
        if (popupElement) {
        const popup = new Overlay({
            element: popupElement,
            positioning: 'bottom-center',
            stopEvent: false,
            offset: [0, -30],
        });
        popupRef.current = popup;
        map.addOverlay(popupRef.current);
        }
    }

    map.on("click", async function (event) {
      const pixel = map.getEventPixel(event.originalEvent);
      const feature = map.getFeaturesAtPixel(pixel)[0];
      const currentPopup = popupRef.current;

      if (feature) {
        const geometry = feature.getGeometry();
        
        if (geometry && geometry instanceof Point) {
          const coordinates = geometry.getCoordinates();
          if(currentPopup){
            currentPopup.setPosition(coordinates);
            setOverlayVisible(true);
          }
          setDisabledOpen(true)
          setDisabledClose(true)
          setDisabledRead(true)

          const res = await fetch("/api/map/get-detail-device", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "API-Key": "1234",
            },
            body: JSON.stringify({
              imsi: feature.get("imsi"),
            }),
          });

          const result = await res.json();
          if (res.status == 200) {
            if(dataRule.config === false){
              setIsLoaded(true);
              setDisabledOpen(true)
              setDisabledClose(true)
              setDisabledRead(true)

            }
            else{
              setIsLoaded(true);
              setDisabledOpen(false)
              setDisabledClose(false)
              setDisabledRead(false)
            }
            setDataDetailImsi({
              group: result.data.group_name,
              imsi: result.data.imsi,
              gateway_id : feature.get("gateway_id"),
              type_schedule : feature.get("type_schedule"),
              using_sensor : feature.get("using_sensor"),
              last_update: result.data.last_update,
              last_status: result.data.last_status,
              last_command: result.data.last_command,
              number_gov: result.data.number_gov,
              street_light_name: result.data.street_light_name,
            });
            setBtnMode(<ButtonModeAuto disabled={dataRule.control ?? false} deviceId={result.data.imsi} typeMode={feature.get("type_schedule")} using={feature.get("using_sensor")}></ButtonModeAuto>);
            
          } else {

          }
        }

      } else {
      }
    });

    map.getViewport().addEventListener("mousemove", (event) => {
      const pixel = map.getEventPixel(event);
      const feature = map.forEachFeatureAtPixel(pixel, (feature) => feature);
      if (feature) {
        map.getViewport().style.cursor = "pointer";
      } else {
        map.getViewport().style.cursor = "";
      }
    });

    return () => {
      map.setTarget(undefined);
    };
  }, [data,dataRule.config,dataRule.control]);

  const command = async (type: string, imsi : string) => {
    
    switch (type) {
      case "open":
        setLoadingOpen(true)
        setDisabledClose(true)
        setDisabledRead(true)
        const resOpen = fetchCommand(imsi, "1","100")
        if (await resOpen == true){
          setLoadingOpen(false)
          setDisabledClose(false)
          setDisabledRead(false)
        }
        break;
      case "close":
        setLoadingClose(true)
        setDisabledOpen(true)
        setDisabledRead(true)
        const resClose = fetchCommand(imsi, "0","1")
        if (await resClose == true){
          setLoadingClose(false)
          setDisabledOpen(false)
          setDisabledRead(false)
        }
        break;
      case "read":
        setLoadingRead(true)
        setDisabledOpen(true)
        setDisabledClose(true)
        fetchReadPower(imsi)
        break;
    
      default:
        break;
    }
  };

  const fetchCommand = async (imsi : string , command : string, dim : string) => {
    const res = await fetch("/api/command/control", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        type_open: "imsi",
        imsi: imsi,
        subscribe: projectId +"/RESPONSE/" + imsi,
        wait_time: "20",
        command_type: command,
        dim_percent: dim,
      }),
    });

        const result = await res.json();
        if (res.status == 200) {
        return true
        } else {
        setLoadingOpen(false)
        setLoadingClose(false)
        setLoadingRead(false)
        setDisabledOpen(false)
        setDisabledClose(false)
        setDisabledRead(false)
        return false
        }
  };

  const fetchReadPower = async (imsi : string) => {
    const message = {
      Type : "GetPower",
      TOKEN : generateRandomToken(15)
    }
    const res = await fetch("/api/command/get-data-power", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        topic: dataDetailImsi?.gateway_id + "/" +imsi,
        message: JSON.stringify(message),
        subscribe: projectId + "/" + imsi,
        wait_time: "20"
      }),
    });

        const result = await res.json();
        if (res.status == 200) {

        setLoadingOpen(false)
        setLoadingClose(false)
        setLoadingRead(false)
        setDisabledOpen(false)
        setDisabledClose(false)
        setDisabledRead(false)
        
        } else {

        setLoadingOpen(false)
        setLoadingClose(false)
        setLoadingRead(false)
        setDisabledOpen(false)
        setDisabledClose(false)
        setDisabledRead(false)

        }
  };

  const generateRandomToken = (length : number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomToken = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      randomToken += chars[randomIndex];
    }
    return randomToken;
  };

  const close = () => {
    setIsLoaded(false);
    setOverlayVisible(false);
  };

  return (
    <div className="relative m-1">
        <div ref={mapRef} className={high} style={{ width: "100%" }} />

        {overlayVisible && (
            <Card ref={overlayRef} className="absolute top-4 left-4 z-10 w-[350px]">
            <CardContent className="p-4">
                <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={close}
                >
                <X className="h-4 w-4" />
                </Button>

                <div className="space-y-3 pt-6">
                {isLoaded ? (
                    <>
                    {/* ข้อมูลจริง */}
                    <p><strong>{t(`imsi`)}:</strong> {dataDetailImsi?.imsi}</p>
                    <p><strong>{t(`group`)}:</strong> {dataDetailImsi?.group}</p>
                    <p><strong>{t(`last-update`)}:</strong> {dataDetailImsi?.last_update}</p>
                    <p><strong>{t(`last-command`)}:</strong> {dataDetailImsi?.last_command}</p>
                    <p><strong>{t(`last-status`)}:</strong> {dataDetailImsi?.last_status}</p>
                    <p><strong>{t(`gov`)}:</strong> {dataDetailImsi?.number_gov}</p>
                    <p><strong>{t(`streetlight-name`)}:</strong> {dataDetailImsi?.street_light_name}</p>
                    <div className="flex items-center gap-2">
                        <strong>{t(`auto-mode`)}:</strong> {btnMode}
                    </div>

                    {/* ปุ่ม Actions */}
                    <div className="grid grid-cols-3 gap-2 pt-4">
                        <Button
                        disabled={isLoadingOpen || isDisabledOpen}
                        onClick={() => command("open", dataDetailImsi?.imsi)}
                        >
                        {isLoadingOpen && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoadingOpen ? t(`btn-wait-open`) : t(`btn-open`)}
                        </Button>
                        <Button
                        variant="destructive"
                        disabled={isLoadingClose || isDisabledClose}
                        onClick={() => command("close", dataDetailImsi?.imsi)}
                        >
                        {isLoadingClose && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t(`btn-close`)}
                        </Button>
                        <Button
                        disabled={isLoadingRead || isDisabledRead}
                        onClick={() => command("read", dataDetailImsi?.imsi)}
                        >
                        {isLoadingRead && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t(`btn-read`)}
                        </Button>
                    </div>
                    </>
                ) : (
                    <DetailsSkeleton />
                )}
                </div>
            </CardContent>
            </Card>
        )}
    </div>
  );
};

export default StaticMapXYZComponent;