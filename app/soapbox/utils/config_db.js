export const ConfigDB = {
  find: (configs, group, key) => {
    return configs.find(config =>
      config.isSuperset({ group, key })
    );
  },
};

export default ConfigDB;
