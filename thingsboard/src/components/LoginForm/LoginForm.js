import classNames from 'classnames/bind';
import styles from './LoginForm.module.scss';

import Input from '../Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faLayerGroup, faLock } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';
import { useState } from 'react';
import { authenticate } from '~/services/request';
import { useAuth } from '~/contexts/AuthContext';
const cx = classNames.bind(styles);

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [_platform, set_Platform] = useState('');
  // const [token, setToken] = useState('');
  const { setIsAuthenticated, setToken, setPlatform } = useAuth();
  const handleSubmit = async () => {
    alert('OK!');
    const token = await authenticate({ username, password, platform: _platform });
    if (token) {
      setIsAuthenticated(true);
      setPlatform(_platform);
      setToken(token);
    } else {
      console.log('Authentication failed!');
    }
  };
  // async function test(token) {
  //   const pageSize = 10,
  //     page = 0;
  //   const data = await getDevicesInfo({ token: token, platform: platform, pageSize, page });
  //   return data;
  // }
  // async function test1(platform, token) {
  //   const data = await test(token);
  //   const { entityType, id } = data[0].id;
  //   const timeseriesData = await getAttributesData({ entityType, entityId: id, token, platform });
  //   console.log(timeseriesData);
  // }
  // test();
  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>Log In</div>
      <Input
        Icon={<FontAwesomeIcon icon={faEnvelope} />}
        label="Username"
        placeholder="Email"
        className={cx('input')}
        onChange={setUsername}
      />
      <Input
        Icon={<FontAwesomeIcon icon={faLock} />}
        label="Password"
        placeholder="Password"
        className={cx('input')}
        onChange={setPassword}
      />
      <Input
        Icon={<FontAwesomeIcon icon={faLayerGroup} />}
        label="platform"
        placeholder="Platform"
        className={cx('input')}
        onChange={set_Platform}
      />
      <Button title="submit" size="large" className={cx('button')} onClick={handleSubmit} />
    </div>
  );
}

export default LoginForm;
