import React, { useState, useEffect, useRef } from 'react';
import {
  Button, Snackbar, ListItemText, Avatar,
  List, ListItem, ListItemAvatar, ListItemSecondaryAction, IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import FolderIcon from '@material-ui/icons/AddToPhotos';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: '20rem',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const FileUploader = () => {
  const classes = useStyles();
  const [file, setFile] = useState();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    /* TODO - add drop it text on fullscreen */
    const dropbox = window;

    dropbox.addEventListener('dragenter', dragenter, false);
    dropbox.addEventListener('dragover', dragover, false);
    dropbox.addEventListener('drop', drop, false);

    function dragenter(e: any) {
      e.stopPropagation();
      e.preventDefault();
    }

    function dragover(e: any) {
      e.stopPropagation();
      e.preventDefault();
    }

    function drop(e: any) {
      e.stopPropagation();
      e.preventDefault();

      const dt = e.dataTransfer;
      const { files } = dt;

      setFile(files[0]);
    }

    return () => {
      dropbox.removeEventListener('dragenter', dragenter, false);
      dropbox.removeEventListener('dragover', dragover, false);
      dropbox.removeEventListener('drop', drop, false);
    };
  }, []);

  const handleFileSelect = (e: any) => {
    setFile(e.target.files[0]);
  };

  const resetFileSelect = () => {
    setFile(null);

    if (ref.current) {
      ref.current.value = ref.current.defaultValue;
    }
  };

  const sendFile = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('files[]', file);

    await fetch('/', {
      method: 'POST',
      body: formData,
    });

    setOpen(true);

    resetFileSelect();
  };

  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className={classes.root}>
      <form method="post" encType="multipart/form-data">
        <input
          ref={ref}
          type="file"
          id="files"
          accept=".jpg"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
        {file && (
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <FolderIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={file.name} secondary={file.lastModifiedDate.toLocaleString()} title={`${file.size} байт`} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={resetFileSelect}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        )}
        <Button
          component="label"
          htmlFor="files"
          variant="contained"
          size="small"
        >
          Загрузить
        </Button>
        {file && (
          <>
            <Button
              component="button"
              color="primary"
              onClick={sendFile}
              variant="contained"
              type="submit"
              size="small"
            >
              Отправить
            </Button>
          </>
        )}
        <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
          <Alert severity="success">
            Файл успешно отправлен
          </Alert>
        </Snackbar>
      </form>
    </div>
  );
};

export default FileUploader;
