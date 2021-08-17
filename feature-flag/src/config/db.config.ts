import { registerAs } from '@nestjs/config';

const buildUri = () => {
  const url = process.env.MONGO_DB_URI || 'mongodb://localhost:27017/feature-flag';
  const val = url.split('//');

  const user= process.env.MONGO_DB_USER || '';
    const pass= process.env.MONGO_DB_PASS || '';
  const userInfo = !!user && !!pass ? `${user}:${pass}@` : '';
  console.log(`${val[0]}//${userInfo}${val[1]}`);
  return `${val[0]}//${userInfo}${val[1]}`;
};

export default registerAs('dbConfig', () => ({
  uri: buildUri(),
}));