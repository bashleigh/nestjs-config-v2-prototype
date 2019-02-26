export default class TestConfigClass {
  public static port: number = process.env.PORT ? parseInt(process.env.PORT) : 0;
};
