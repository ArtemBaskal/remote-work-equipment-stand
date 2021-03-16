import React, { memo } from 'react';
import {
  FormControl, Grid, GridSize, InputLabel, Select,
} from '@material-ui/core';

type IProps = {
    value: number | string,
    onChange: (e: React.ChangeEvent<{ value: unknown; }>) => void,
    label: string,
    xs: GridSize,
    sm: GridSize,
    id: string,
    children: React.ReactNode,
}

export const ControlInput = memo(({
  value,
  onChange,
  label,
  xs,
  sm,
  id,
  children,
}: IProps) => (
  <Grid item xs={xs} sm={sm}>
    <FormControl variant="standard" fullWidth>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Select
        native
        value={value}
        onChange={onChange}
        label={label}
        inputProps={{
          name: label,
          id,
        }}
      >
        {children}
      </Select>
    </FormControl>
  </Grid>
));
