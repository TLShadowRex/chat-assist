class ConfigService {
    constructor() {
        this.config = {};
    }

    setConfig(config) {
        this.config = Object.assign(this.config,config);
    }
}

export default new ConfigService();
