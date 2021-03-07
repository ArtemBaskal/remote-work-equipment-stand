import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Avatar, Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import FolderIcon from '@material-ui/icons/AddToPhotos';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import { LinearProgressWithLabel } from 'components/LinearProgressWithLabel';
import {
  setMaxProgress,
  setProgressValue,
} from 'features/fileLoader/fileLoaderSlice';
import { RootState } from 'app/rootReducer';
import { setSnackbarSuccess } from 'features/snackbar/snackbarSlice';

const FILE_DATA_CHANNEL_BINARY_TYPE = 'arraybuffer';
const END_OF_FILE_MESSAGE = 'EOF';
const EMPTY_PROGRESS = 0;
const MIN = 0;

const normalize = (value: number, MAX: number) => ((value - MIN) * 100) / (MAX - MIN);

const useStyles = makeStyles(() => ({
  progress: {
    width: '100%',
  },
  file: {
    display: 'flex',
  },
}));

type IProps = { pcRef: React.RefObject<RTCPeerConnection> };

export const FileLoader = ({ pcRef }: IProps) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const {
    maxProgress,
    progressValue,
  } = useSelector((state: RootState) => state.fileLoader, shallowEqual);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    /* TODO - add drop it text on fullscreen */
    /* TODO - allow adding file form clipboard */
    const dropbox = window;

    const dragenter = (e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();
    };

    const dragover = (e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();
    };

    const drop = (e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();

      const { dataTransfer } = e;

      if (dataTransfer?.files) {
        setSelectedFile(dataTransfer.files[0]);
      }
    };

    dropbox.addEventListener('dragenter', dragenter);
    dropbox.addEventListener('dragover', dragover);
    dropbox.addEventListener('drop', drop);

    return () => {
      dropbox.removeEventListener('dragenter', dragenter);
      dropbox.removeEventListener('dragover', dragover);
      dropbox.removeEventListener('drop', drop);
    };
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;
    setSelectedFile(files[0]);
  };

  const resetFileSelect = () => {
    setSelectedFile(null);
  };

  const sendFile = () => {
    if (!selectedFile || !pcRef.current) {
      return;
    }
    /*
                      Label may not be longer than 65,535 bytes.
                      https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createDataChannel#parameters:~:text=channel.%20This%20string-,may%20not%20be%20longer%20than%2065%2C535%20bytes.
                      Filename sizes may not exceed 255 bytes.
                      https://www.ibm.com/support/knowledgecenter/SSEQVQ_8.1.10/client/c_cmd_filespecsyntax.html
                  */
    /* TODO improve selectedFile transferring https://github.com/webrtc/samples/blob/gh-pages/src/content/datachannel/filetransfer/js/main.js */
    const sendFileChannel = pcRef.current.createDataChannel(selectedFile.name);
    sendFileChannel.binaryType = FILE_DATA_CHANNEL_BINARY_TYPE;
    dispatch(setMaxProgress(selectedFile.size));

    /*
                Firefox cannot send a message larger than 16 Kbytes to Chrome
                https://viblast.com/blog/2015/2/5/webrtc-data-channel-message-size/#blog-body:~:text=Firefox%20cannot%20send%20a%20message%20larger%20than%2016%20Kbytes%20to%20Chrome
                Messages smaller than 16kiB can be sent without concern,
                as all major user agents handle them the same way.
                Beyond that, things get more complicated.
                https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Using_data_channels#understanding_message_size_limits

                Tests have shown that targeting a high water mark of 1 MiB
                and setting a low water mark of 256 KiB results in adequate throughput
                https://stackoverflow.com/questions/56327783/webrtc-datachannel-for-high-bandwidth-application
                https://github.com/w3c/webrtc-pc/issues/1979#issuecomment-486611845
                */
    // 2 ** 18 === 262144;
    // 2 ** 20 === 1048576;
    const CHUNK_SIZE = 262144;
    const LOW_WATER_MARK = 262144;
    const HIGH_WATER_MARK = 1048576;

    const fileReader = new FileReader();
    let offset = 0;

    fileReader.addEventListener('error', (error) => {
      console.error('Error reading selectedFile: ', error);
    });

    fileReader.addEventListener('abort', (event) => {
      console.log('File reading aborted: ', event);
    });

    let isPaused = false;

    const readSlice = (byteOffset: number) => {
      console.log('readSlice', byteOffset);
      const slice = selectedFile.slice(offset, byteOffset + CHUNK_SIZE);
      fileReader.readAsArrayBuffer(slice);
    };
    // TODO UPDATE PAGE TITLE ON FILE LOAD
    fileReader.addEventListener('load', (e: ProgressEvent<FileReader>) => {
      console.log('FileReader.onload', e);
      if (!e.target?.result || sendFileChannel.readyState !== 'open') {
        console.warn('sendFileChannel.readyState is not open:', sendFileChannel.readyState);
        return;
      }

      if (isPaused) {
        console.warn('Unable to write, data channel is paused!');
        return;
      }

      const buffer = e.target.result as ArrayBuffer;
      sendFileChannel.send(buffer);

      offset += buffer.byteLength;
      dispatch(setProgressValue(offset));

      if (offset >= selectedFile.size) {
        sendFileChannel.send(END_OF_FILE_MESSAGE);
        sendFileChannel.close();
        setSelectedFile(null);
        /* Reset progress */
        dispatch(setMaxProgress(EMPTY_PROGRESS));
        dispatch(setProgressValue(EMPTY_PROGRESS));
        resetFileSelect();
        dispatch(setSnackbarSuccess('Файл отправлен'));
        return;
      }

      if (isPaused || sendFileChannel.bufferedAmount < HIGH_WATER_MARK) {
        readSlice(offset);
      } else {
        // Pause once high water mark has been reached
        console.log(`Data channel ${sendFileChannel.label} paused @ ${sendFileChannel.bufferedAmount}`);
        isPaused = true;
      }
      // Otherwise wait for bufferedamountlow event to trigger reading more data
    });

    sendFileChannel.bufferedAmountLowThreshold = LOW_WATER_MARK;
    sendFileChannel.addEventListener('bufferedamountlow', () => {
      if (isPaused) {
        console.debug(`Data channel ${sendFileChannel.label} resumed @ ${sendFileChannel.bufferedAmount}`);
        isPaused = false;
        readSlice(offset);
      }
    });

    sendFileChannel.onopen = () => {
      const FIRST_BYTE_SLICE_NUMBER = 0;
      readSlice(FIRST_BYTE_SLICE_NUMBER);
    };
  };

  return (
    <section>
      <input type="file" id="files" style={{ display: 'none' }} onChange={onChange} />
      {selectedFile && (
        <List className={classes.file}>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <FolderIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={selectedFile.name}
              secondary={new Date(selectedFile.lastModified).toLocaleString()}
              title={`${selectedFile.size} байт`}
            />
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
      {progressValue > EMPTY_PROGRESS
            && selectedFile
        ? (
          <div className={classes.progress}>
            <LinearProgressWithLabel value={normalize(progressValue, maxProgress)} />
          </div>
        ) : <br />}
      {selectedFile && (
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
      )}
      <Button
        component="label"
        htmlFor="files"
        variant="contained"
        size="small"
        id="files"
      >
        Загрузить прошивку
      </Button>
    </section>
  );
};
