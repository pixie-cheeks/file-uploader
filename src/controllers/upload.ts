import type { RequestHandler } from 'express';

const postFileUpload: RequestHandler = (request, response) => {
  console.log(request.file);
  response.redirect('/upload/file');
};

const getFileUpload: RequestHandler = (_request, response) => {
  response.render('upload/file', { title: 'Upload File' });
};

export { getFileUpload, postFileUpload };
