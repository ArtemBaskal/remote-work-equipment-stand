import React, { useCallback, useMemo, useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { useDispatch, useSelector } from 'react-redux';
import { setSnackbarInfo } from 'features/snackbar/snackbarSlice';
import { RootState } from 'app/rootReducer';
import { InputSlider } from 'components/InputSlider';
import { ControlInput } from 'components/ControlInput';
import { Extends } from 'helpers/types';

/*
1 - считать уровень сигнала на пине,
2 - задать низкий уровень сигнала на пине,
3 - задать высокий уровень сигнала
4 - генерировать ШИМ сигнал
*/
enum COMMAND {
  READ = 1,
  DISABLE = 2,
  ENABLE = 3,
  PWM = 4
}

const commandRecords: Record<COMMAND, string> = {
  [COMMAND.READ]: 'Считать уровень сигнала',
  [COMMAND.DISABLE]: 'Задать низкий уровень сигнала',
  [COMMAND.ENABLE]: 'Задать высокий уровень сигнала',
  [COMMAND.PWM]: 'Генерировать ШИМ сигнал',
};

type pinNumberType = typeof pinNumbers[number];
type pinNumberPWMType = Extends<pinNumberType, 3 | 5 | 9 | 10 | 11>

const pinNumbers = [2, 3, 4, 5, 8, 9, 10, 11] as const;
const pinNumbersPWM: pinNumberPWMType[] = [3, 5, 9, 10, 11];

/*
duty: 0 - 255
frequency: 2000 - 20000
*/
type commands = {
  command_type: COMMAND,
  pin_number: pinNumberType,
  duty: number,
  frequency: number
}

type IProps = {
  dcRef: React.MutableRefObject<RTCDataChannel | null>,
};

export const Controls = ({ dcRef }: IProps) => {
  const dispatch = useDispatch();
  const dataChannelOpen = useSelector((state: RootState) => state.webrtc.dataChannelOpen);

  const [commandType, setCommandType] = useState<COMMAND>(COMMAND.ENABLE);
  const [pinNumber, setPinNumber] = useState<pinNumberType>(2);
  const [duty, setDuty] = useState<number>(255);
  const [frequency, setFrequency] = useState<number>(2000);
  const setDutyCb = useCallback(setDuty, []);
  const setFrequencyCb = useCallback(setFrequency, []);

  const isPWM = commandType === COMMAND.PWM;
  const pins = isPWM ? pinNumbersPWM : pinNumbers;

  const onSend = useCallback(() => {
    const combinedValues: commands = {
      command_type: commandType,
      pin_number: pinNumber,
      duty,
      frequency,
    };
    const stringifiedValue = JSON.stringify(combinedValues, null, 4);

    if (dcRef.current && dataChannelOpen) {
      console.log('Send command:', stringifiedValue);
      dcRef.current.send(stringifiedValue);

      const commandMessage = isPWM
        ? `${commandRecords[commandType]} с частотой ${frequency} и скважность ${duty} на пине ${pinNumber}`
        : `${commandRecords[commandType]} на пине ${pinNumber}`;
      dispatch(setSnackbarInfo(`Команда "${commandMessage}" отправлена`));
    } else {
      console.error('dcRef.current, dataChannelOpen:', dcRef.current, dataChannelOpen);
    }
  }, [commandType, pinNumber, duty, frequency, dataChannelOpen, dcRef.current, isPWM]);

  const onChangeCommandType = useCallback((e: React.ChangeEvent<{ value: unknown }>) => {
    const { value } = e.target;
    if (typeof value !== 'string') {
      console.error('commandType is not a string: ', value);
      return;
    }

    setCommandType(parseInt(value, 10));
  }, []);

  const onChangePinNumber = useCallback((e: React.ChangeEvent<{ value: unknown; }>) => {
    const { value } = e.target;
    if (typeof value !== 'string') {
      console.error('commandType is not a string: ', value);
      return;
    }

    setPinNumber(parseInt(value, 10) as pinNumberType);
  }, []);

  const commandChildren = useMemo(() => Object.entries(commandRecords).map(([code, label]) => (
    <option key={code} value={code} disabled={code === COMMAND.READ.toString()}>
      {label}
    </option>
  )), [commandRecords]);

  const pinChildren = useMemo(() => pins.map((pin: number) => (
    <option key={pin} value={pin}>
      {`Пин ${pin}`}
    </option>
  )), [pins]);

  return (
    <section style={{ marginTop: '2rem' }}>
      {dataChannelOpen && (
        <Grid container spacing={3}>
          <ControlInput
            xs={6}
            sm={4}
            value={commandType}
            onChange={onChangeCommandType}
            label="Команда"
            id="commandType"
          >
            {commandChildren}
          </ControlInput>
          <ControlInput
            xs={6}
            sm={2}
            value={pinNumber}
            onChange={onChangePinNumber}
            label={`Номер пина${isPWM ? ' (ШИМ)' : ''}`}
            id="pinNumber"
          >
            {pinChildren}
          </ControlInput>
          {isPWM && (
          <>
            <Grid item>
              <InputSlider min={0} max={255} value={duty} setValue={setDutyCb} label="Скважность" disabled={!isPWM} />
            </Grid>
            <Grid item>
              <InputSlider
                min={2000}
                max={20000}
                step={1000}
                value={frequency}
                setValue={setFrequencyCb}
                label="Частота"
                disabled={!isPWM}
              />
            </Grid>
          </>
          )}
        </Grid>
      )}
      <Grid container spacing={2} alignItems="flex-start">
        <Grid item>
          <Button
            component="button"
            color="primary"
            onClick={onSend}
            variant="text"
            type="submit"
            size="medium"
            disabled={!dataChannelOpen}
            endIcon={<SendIcon />}
          >
            Отправить команду
          </Button>
        </Grid>
      </Grid>
    </section>
  );
};
