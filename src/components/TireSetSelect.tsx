import { MenuItem, TextField } from '@mui/material';
import { useController, type Control } from 'react-hook-form';
import { useTireSets } from '../features/library/hooks/useTireSets';

const CREATE_VALUE = '__create__';

type TireSetSelectProps = {
  control: Control<any>;
  name: string;
  label?: string;
  onCreate?: () => void;
};

const TireSetSelect = ({ control, name, label = 'Juego de gomas', onCreate }: TireSetSelectProps) => {
  const { data: tireSets = [], isLoading } = useTireSets();
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
      {tireSets.map((tire) => (
        <MenuItem key={tire.id} value={tire.id}>
          {tire.name}
        </MenuItem>
      ))}
      <MenuItem value={CREATE_VALUE}>+ Crear juego de gomas</MenuItem>
    </TextField>
  );
};

export default TireSetSelect;
