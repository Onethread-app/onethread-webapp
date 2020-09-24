import axios from 'axios';

export const handleDownload = (file: any) => {
  const filename = file.s3Key.split('/')[1];

  axios({
    url: file.link,
    method: 'GET',
    responseType: 'blob',
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}`);
    document.body.appendChild(link);
    link.click();
  });
};