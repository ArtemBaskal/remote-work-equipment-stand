import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';

const useStyles = makeStyles({
  root: {
    width: 250,
  },
  input: {
    width: 60,
  },
});

type IProps = {
    label?: string,
    min?: number,
    max?: number,
    step?: number,
    value: number,
    setValue: (value: number) => void,
    disabled?: boolean,
}

function InputSlider({
  label,
  min,
  max,
  step,
  value,
  setValue,
  disabled,
}: IProps) {
  const classes = useStyles();

  const handleSliderChange = (event: any, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < min!) {
      setValue(min!);
    } else if (value > max!) {
      setValue(max!);
    }
  };

  return (
    <div className={classes.root}>
      {label && (
        <Typography id="input-slider" gutterBottom>
          {label}
        </Typography>
      )}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider
            value={value}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            max={max}
            min={min}
            step={step}
            disabled={disabled}
          />
        </Grid>
        <Grid item>
          <Input
            className={classes.input}
            value={value}
            margin="dense"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step,
              min,
              max,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
            disabled={disabled}
          />
        </Grid>
      </Grid>
    </div>
  );
}

InputSlider.defaultProps = {
  label: '',
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
};

// @ts-ignore
// eslint-disable-next-line no-func-assign
InputSlider = memo(InputSlider);

export { InputSlider };
