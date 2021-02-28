import { VueService } from "@/Game/VueService/VueService";

export interface PlayerProps {
  placeholder: string
}

export class Player {
  resourceMeter: number;
  
  // 101 for rounding issues. I want fractional costs like 1/3 which is 33.33
  // So we'll use 101 and round down for displaying.
  // This is a character-wide rule for now.
  RESOURCE_METER_MAXIMUM = 101;
  RESOURCE_METER_BEGIN = 50;
  

  constructor(props: PlayerProps){
    this.resourceMeter = this.RESOURCE_METER_BEGIN;
  }

  setResourceMeter(value: number){
    const newValue = Math.max(value, this.RESOURCE_METER_MAXIMUM);

    VueService.primaryPlayerResourceMeter = newValue; // the frontend service plants its dirty fingers everywhere
    this.resourceMeter = newValue;
  }
}