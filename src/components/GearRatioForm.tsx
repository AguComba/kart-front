import { Grid, TextField } from '@mui/material';
import { useController, type Control } from 'react-hook-form';

type GearRatioFormProps = {
  control: Control<any>;
  name: string;
};

const GearRatioForm = ({ control, name }: GearRatioFormProps) => {
  const crown = useController({ control, name: `${name}.crown` });
  const pinion = useController({ control, name: `${name}.pinion` });

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <TextField
          label="Corona"
          type="number"
          fullWidth
          value={crown.field.value ?? ''}
          onChange={(event) => crown.field.onChange(Number(event.target.value))}
          onBlur={crown.field.onBlur}
          error={Boolean(crown.fieldState.error)}
          helperText={crown.fieldState.error?.message}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Piñón"
          type="number"
          fullWidth
          value={pinion.field.value ?? ''}
          onChange={(event) => pinion.field.onChange(Number(event.target.value))}
          onBlur={pinion.field.onBlur}
          error={Boolean(pinion.fieldState.error)}
          helperText={pinion.fieldState.error?.message}
        />
      </Grid>
    </Grid>
  );
};

export default GearRatioForm;
