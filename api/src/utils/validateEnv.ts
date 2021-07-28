import { cleanEnv, str, port } from 'envalid';
   
  function validateEnv() {
    cleanEnv(process.env, {
      ATLAS_URI: str(),
      JWT_SECRET: str(),
      JWT_EXPIRES: str(),
      JWT_REFRESH_SECRET: str(),
      JWT_REFRESH_EXPIRES: str(),
      PORT: port(),
      SESSION_SECRET: str()
    });
  }


export default validateEnv 