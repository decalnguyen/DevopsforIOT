import classNames from 'classnames/bind';
import styles from './DataExplorer.module.scss';
import Table from '~/components/Table';
import { useEffect, useState } from 'react';
import { getAttributesData, getDevicesInfo, getTimeseriesData } from '~/services/request';
import { useAuth } from '~/contexts/AuthContext';

const cx = classNames.bind(styles);

function DataExplorer() {
  const { token, platform, username } = useAuth();
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [attributesData, setAttributesData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      console.log('token: ', token);
      const deviceInfos = await getDevicesInfo({ token, platform });
      console.log('deviceInfos:', deviceInfos);
      if (!deviceInfos) return;
      const devices = deviceInfos.map((device) => {
        const current = device.id;
        return {
          entityType: current.entityType,
          entityId: current.id,
        };
      });
      console.log(devices);
      const timeSeriesDataPromises = devices.map(async (device) => {
        const { entityType, entityId } = device;
        const data = await getTimeseriesData({ entityType, entityId, token, platform });
        return data;
      });
      const attributesDataPromises = devices.map(async (device) => {
        const { entityType, entityId } = device;
        const data = await getAttributesData({ entityType, entityId, token, platform });
        return data;
      });
      const timeSeriesData = await Promise.all(timeSeriesDataPromises);
      const attributesData = await Promise.all(attributesDataPromises);
      setTimeSeriesData(timeSeriesData);
      setAttributesData(attributesData);
      console.log('attributes: ', attributesData);
      console.log('timeseries: ', timeSeriesData);
    };
    fetchData();
  }, [token, platform, username]);

  return (
    <div className={cx('wrapper')}>
      <Table data={attributesData} type="attribute" />
      <Table data={timeSeriesData} type="timeSeries" />
    </div>
  );
}

export default DataExplorer;
