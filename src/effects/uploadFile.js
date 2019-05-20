import axios from 'axios';

const uploadFile = ({
  url, file, onUploadProgress, httpVerb,
}) => axios[httpVerb || 'put'](url, file, {
  headers: {
    'Content-Type': file.type,
  },
  onUploadProgress,
});

export default uploadFile;
