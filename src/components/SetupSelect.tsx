import { MenuItem, TextField } from '@mui/material';
import { useController, type Control } from 'react-hook-form';
import { useKartSetups } from '../features/library/hooks/useKartSetups';

const CREATE_VALUE = '__create__';

type SetupSelectProps = {
  control: Control<any>;
  name: string;
  label?: string;
  onCreate?: () => void;
};

const SetupSelect = ({ control, name, label = 'Setup', onCreate }: SetupSelectProps) => {
  const { data: setups = [], isLoading } = useKartSetups();
  const { field, fieldState } = useController({ control, name });

  return (
    <TextField
      select
      fullWidth
      label={label}
      value={field.value ?? ''}
      onChange={(event) => {
        const value = event.target.value;
        if (value === CREATE_VALUE) {
          onCreate?.();
          return;
        }
        field.onChange(value);
      }}
      onBlur={field.onBlur}
      error={Boolean(fieldState.error)}
      helperText={fieldState.error?.message}
      disabled={isLoading}
    >
      <MenuItem value="">Sin selección</MenuItem>
      {setups.map((setup) => (
        <MenuItem key={setup.id} value={setup.id}>
          {setup.name}
        </MenuItem>
      ))}
      <MenuItem value={CREATE_VALUE}>+ Crear setup</MenuItem>
    </TextField>
  );
};

export default SetupSelect;
