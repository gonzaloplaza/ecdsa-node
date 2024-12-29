import { getApp } from '@/app';

const port = 3042;

getApp().then((app) => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });
});
