import React from 'react';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';

const Transition = React.forwardRef<unknown, TransitionProps>(
  function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  }
);

function EditTitleDialog({ value, open, onClose }: any) {
  const [name, setName] = React.useState(value);

  function handleChange(event: any) {
    setName(event.target.value);
  }

  function save(event: any) {
    onClose(event, 'save', name);
  }

  React.useEffect(() => {
    setName(value);
  }, [open, value]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      aria-labelledby="form-dialog-title"
    >
      <ValidatorForm onSubmit={save}>
        <DialogTitle id="form-dialog-title">Rename Canvas</DialogTitle>
        <DialogContent>
          <TextValidator
            autoFocus
            name="name"
            label="Enter a new name"
            type="text"
            fullWidth
            value={name}
            onChange={handleChange}
            validators={['required']}
            errorMessages={['A name is required']}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" color="primary">Save</Button>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  );
}

export default EditTitleDialog;
