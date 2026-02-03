import { MenuItem, TextField } from '@mui/material';
import { useController, type Control } from 'react-hook-form';
import { useTracks } from '../features/library/hooks/useTracks';

const CREATE_VALUE = '__create__';

type TrackSelectProps = {
  control: Control<any>;
  name: string;
  label?: string;
  onCreateTrack?: () => void;
};

const TrackSelect = ({ control, name, label = 'Circuito', onCreateTrack }: TrackSelectProps) => {
  const { data: tracks = [], isLoading } = useTracks();
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
          onCreateTrack?.();
          return;
        }
        field.onChange(value);
      }}
      onBlur={field.onBlur}
      error={Boolean(fieldState.error)}
      helperText={fieldState.error?.message}
      disabled={isLoading}
    >
      {tracks.map((track) => (
        <MenuItem key={track.id} value={track.id}>
          {track.name}
        </MenuItem>
      ))}
      <MenuItem value={CREATE_VALUE}>+ Crear circuito</MenuItem>
    </TextField>
  );
};

export default TrackSelect;
