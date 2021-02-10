import { Injectable } from '@angular/core';
import * as ObsWebSocket from 'obs-websocket-js';

@Injectable({
  providedIn: 'root'
})
export class ObsService {

  obs: ObsWebSocket = new ObsWebSocket();
  scenes: any[] = [];
  activeScene: string;

  constructor() { }

  public connect() {
    this.obs.connect({
      address: '192.168.0.137:4444'
    });

    this.obs.on('ConnectionOpened', () => {
      this.obs.send('GetSceneList').then(data => {
        if (data && data.scenes && data.scenes.length > 0) {
          this.scenes = data.scenes;
          this.setScene(this.scenes[0].name);
          this.activeScene = this.scenes[0].name;
        }
        else this.scenes = [];
      })
    });

    this.obs.on('SwitchScenes', data => {
      this.activeScene = data['scene-name'];
    });
  }

  public setScene(name: string) {
    if (!this.scenes.some(s => s.name == name))
      return;

    this.obs.send('SetCurrentScene', {
      'scene-name': name
    });
  }
}
