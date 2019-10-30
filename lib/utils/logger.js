"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    constructor() {
    }
    static getInstance(options = null) {
        Logger.options = options || Logger.options;
        Logger.instance = Logger.instance || new Logger();
        return Logger.instance;
    }
    log(msg, ...args) {
        if (Logger.options.showOutput) {
            console.log(msg, ...args);
        }
    }
    warn(msg, ...args) {
        if (Logger.options.showOutput) {
            console.warn(msg, ...args);
        }
    }
    error(msg, ...args) {
        if (Logger.options.showOutput) {
            console.error(msg, ...args);
        }
    }
}
exports.Logger = Logger;
Logger.options = {
    showOutput: true
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsTUFBYSxNQUFNO0lBTWpCO0lBQWUsQ0FBQztJQUVoQixNQUFNLENBQUMsV0FBVyxDQUFDLFVBQXlCLElBQUk7UUFDOUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUMzQyxNQUFNLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLElBQUksSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUNsRCxPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDekIsQ0FBQztJQUVELEdBQUcsQ0FBQyxHQUFRLEVBQUUsR0FBRyxJQUFXO1FBQzFCLElBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUM7WUFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztTQUMzQjtJQUNILENBQUM7SUFFRCxJQUFJLENBQUMsR0FBUSxFQUFFLEdBQUcsSUFBVztRQUMzQixJQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFDO1lBQzNCLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDNUI7SUFDSCxDQUFDO0lBRUQsS0FBSyxDQUFDLEdBQVEsRUFBRSxHQUFHLElBQVc7UUFDNUIsSUFBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBQztZQUMzQixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO1NBQzdCO0lBQ0gsQ0FBQzs7QUE5Qkgsd0JBK0JDO0FBOUJRLGNBQU8sR0FBa0I7SUFDOUIsVUFBVSxFQUFFLElBQUk7Q0FDakIsQ0FBQyJ9