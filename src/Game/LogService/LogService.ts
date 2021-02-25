export interface LogConfig {
  MAX_LOGS_BEFORE_SUPPRESSING: number;
  TIMEOUT_MS: number;
} 

export class LogImplementation {
  config: LogConfig;
  lastLogTime: number;
  logBlock: any[] 
  isHiding: boolean;
  notifiedUserOfSuppressing: boolean;

  constructor(config: LogConfig){
    this.config = config;
    this.lastLogTime = Date.now();
    this.logBlock = [] 
    this.isHiding = false;
    this.notifiedUserOfSuppressing = false;
  }

  log(content: any){
    const currentLogTime = Date.now();

    if (this.isHiding){
      if (currentLogTime - this.lastLogTime < this.config.TIMEOUT_MS){
        return;
      }
      else {
        this.isHiding = false;
        this.logBlock = [];
      }
    }

    this.logBlock.push(content);

    if (this.logBlock.length > this.config.MAX_LOGS_BEFORE_SUPPRESSING){
      this.isHiding = true;
      if (!this.notifiedUserOfSuppressing){
        console.log("TOO MANY CONSOLE LOGS! SUPPRESSING....")
        this.notifiedUserOfSuppressing = true;
      }
    }
    else {
      console.log(content)
      this.lastLogTime = currentLogTime;
    }
  }

  setConfig(config: LogConfig){
    this.config = config;
  }
}

export const LogService = new LogImplementation({TIMEOUT_MS: 200, MAX_LOGS_BEFORE_SUPPRESSING: 4})