import React, { useEffect, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import 'features/led/LedIndicator.css';
import { setLed } from 'features/led/ledSlice';
import { RootState } from 'app/rootReducer';
import { Button } from '@material-ui/core';

const LedIndicator: React.FC = () => {
  const led = useSelector((state: RootState) => state.led, shallowEqual);
  const dispatch = useDispatch();
  const ws = useRef<WebSocket>(null);

  useEffect(() => {
    (ws.current as WebSocket) = new WebSocket('ws://localhost:8080/ws');

    ws.current!.onopen = () => {
      console.log('WS connected');
      ws.current!.send('Ping from client');
    };

    ws.current!.onclose = (event: CloseEvent) => {
      console.log('WS closed connection', event);
    };

    ws.current!.onerror = (error) => {
      console.log('WS error', error);
    };

    ws.current!.onmessage = (event: MessageEvent) => {
      console.log('WS message', event.data);
      dispatch(setLed(JSON.parse(event.data)));
    };

    return () => {
      ws.current!.close();
    };
  }, []);

  const renderLed = ([name, isOn]: [string, boolean], idx: number) => (
    <div key={name} className="led__item">
      <span>{idx + 1}</span>
      <span className={classNames('led', { led__off: !isOn, led__on: isOn })} />
    </div>
  );

  const onClickOn = () => {
    ws.current!.send('ON');
  };

  const onClickOff = () => {
    ws.current!.send('OFF');
  };

  const renderButtonOn = () => <Button variant="contained" onClick={onClickOn} color="primary">Включить</Button>;
  const renderButtonOff = () => <Button variant="contained" onClick={onClickOff} color="secondary">Выключить</Button>;

  return (
    <div className="board">
      <div className="led__container">
        {Object.entries(led).map(renderLed)}
      </div>
      {renderButtonOn()}
      {renderButtonOff()}
    </div>
  );
};

export default LedIndicator;
