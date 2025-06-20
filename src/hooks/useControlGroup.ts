"use client";

import { useState, useEffect, useCallback } from 'react';
import { ListGroupAll, ListDevice } from '@/interface/control';
import {RuleUserItem} from '@/model/rule';
import { ListLatLong } from '@/interface/map';



export function useControlGroup() {
  const [groups, setGroups] = useState<ListGroupAll[]>([]);
  const [dataRule, setDataRule] = useState<RuleUserItem>({});
  const [loading, setLoading] = useState(true);

  // ใช้ useCallback เพื่อไม่ให้ฟังก์ชันถูกสร้างใหม่ทุกครั้งที่ re-render
  const fetchGroupAll = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/group/get-data-group-all', { 
          method: "POST",
          body: JSON.stringify({})
    });
      if (!response.ok) throw new Error('Failed to fetch groups');
      const res = await response.json();
      const data: ListGroupAll[] = res.data;
      setGroups(data);
      setLoading(false);

      return data;
    } catch (error) {
      console.error('Error fetching groups:', error);
      // ควรมีการจัดการ error ที่ดีกว่านี้ เช่น set state error เพื่อแสดงผลบน UI
    } finally {
      setLoading(false);
    }
  }, []);

  const imsiData = async (): Promise<[]> => {
    try {
      const response = await fetch('/api/service/get-data-imsi-all' ,
        {
          method: "POST",
          body: JSON.stringify({})
        }); 
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const res = await response.json();
      return res.data;
      
    } catch (error) {
      console.error('Error fetching users:', error);
      return []; 
    }
  };

  const addGroup = async (dataGroupName: string) => {
    // Logic ของ fetchPushDataGroup
    const response = await fetch("/api/group/push-data-group", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        group_name: dataGroupName,
      }),
     });
    if (response.ok) {
      await fetchGroupAll(); // เมื่อสำเร็จให้ดึงข้อมูลใหม่
      return true;
    }
    return false;
  };

  const pushImsi = async (dataGroupName: string , dataGroupCode: string , dataImsi: string) => {

    const res = await fetch("/api/group/push-imsi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        group_code: dataGroupCode,
        group_name: dataGroupName,
        imsi: dataImsi,
      }),
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await res.json();
    if (res.status == 200) {
      return dataGroupDetail(dataGroupName);;
    } else {
      const data: ListDevice[] = []
      return data
    }
  };

  const dataGroupDetail =  async (dataGroupName: string) : Promise<ListDevice[]> => {
    try {
      const res = await fetch("/api/group/get-data-group-detail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Key": "1234",
        },
        body: JSON.stringify({
          group_name: dataGroupName,
          type_search: "OR",
        }),
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await res.json();
      const data: ListDevice[] = result.data;
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      const data: ListDevice[] = []
      return data;
    }
  };

  const deleteGroup = async (dataGroupName: string, dataGroupCode : string) => {
       
    const res = await fetch("/api/group/delete-group-name", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        group_name: dataGroupName,
        group_code: dataGroupCode,
      }),
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await res.json();
    if (res.status == 200) {
       fetchGroupAll();
    } else {
      
    }
  };



  

  const deleteImsiInGroup = async (dataGroupName: string, dataGroupCode: string, imsi : string) => {
       
    const res = await fetch("/api/group/delete-imsi-group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        group_code: dataGroupCode,
        group_name: dataGroupName,
        imsi: imsi,
      }),
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await res.json();
    if (res.status == 200) {
      return dataGroupDetail(dataGroupName);
      
    } else {
      const data: ListDevice[] = []
      return data
    }
  };

  const sendCommand = async (typeOpen : string , value : string, commandType : string , dimPercent : string) => {
    
    if(typeOpen === "group"){

      const res = await fetch("/api/group/control-group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Key": "1234",
        },
        body: JSON.stringify({
          type_open: typeOpen,
          group_code: value,
          command_type: commandType,
          dim_percent: dimPercent,
        }),
      });
  
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await res.json();
      if (res.status == 200) {
        
        return dataLatLong("group", value)
        
      } else {
        const data: ListLatLong[] = []
        return data
      }

    }
    else if(typeOpen === "multi_imsi"){

      const res = await fetch("/api/group/control-imsi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Key": "1234",
        },
        body: JSON.stringify({
          type_open: typeOpen,
          list_imsi: value,
          command_type: commandType,
          dim_percent: dimPercent,
        }),
      });
  
      const result = await res.json();
      if (res.status == 200) {
        return dataLatLong("imsi", value)
        
      } else {
        const data: ListLatLong[] = []
        return data
      }

    }
    else{
      const data: ListLatLong[] = []
      return data
    }

  };

  const dataLatLong = async (typeSearch: string, dataSearch : string) => {
       
    const res = await fetch("/api/map/get-lat-long", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        type_search: typeSearch,
        list_value: dataSearch,
        type_group: "code",
        status_lamp: "all",
        type_gps: "mobile_pole_rtu",
      }),
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await res.json();
    if (res.status == 200) {
      const data: ListLatLong[] = result.data;
      return data;
    } else {
      const data: ListLatLong[] = []
      return data
    }
  };

  const configDevice = async (dataGroupName : string ,imsi : string , latLamp : string, longLamp : string , namePole : string , nameGov : string) => {
    
    const res = await fetch("/api/group/config-device", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        imsi: imsi,
        lat_lamp: latLamp,
        long_lamp: longLamp,
        name_pole: namePole,
        name_gov: nameGov,
      }),
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await res.json();
    if (res.status == 200) {
      
      return dataGroupDetail(dataGroupName);
      
    } else {
      const data: ListDevice[] = []
      return data
    }

  };

  const fetchRule = async () : Promise<RuleUserItem> => {
    const res = await fetch("/api/service/get-data-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await res.json();
    if (res.status == 200) {
      const data: RuleUserItem = {config : result.data.groupConfig[1] === 1 ? true : false , control : result.data.groupConfig[2] === 1 ? true : false};
      setDataRule(data);
      return data;
    } else {
      const dataFalse: RuleUserItem = {config : false , control : false};
      setDataRule(dataFalse);
      return dataFalse
    }
  };

  useEffect(() => {
    fetchRule(); // ควรย้าย logic ของ fetchRule มาในนี้ด้วย
    fetchGroupAll();
    imsiData(); // ควรย้าย logic ของ fetchImsiAll มาในนี้ด้วย
  }, [fetchGroupAll]);

  return{
    dataRule,
    loading,
    groups,
    addGroup,
    pushImsi,
    deleteGroup,
    deleteImsiInGroup,
    sendCommand,
    dataLatLong,
    imsiData,
    configDevice,
    dataGroupDetail,
  };


}