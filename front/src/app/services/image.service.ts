import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  dropHandler(e:dragEvent,success,fail):void {
    if ( ! [...e.dataTransfer.items].some(item => {
      let type = item.type;

      // drop image URL
      if ( type == 'text/plain' || type == 'text/x-moz-url' ) {
        console.log('[ImageService.dropHandler]',type,e.dataTransfer.getData(type));
        // TODO call service to upload image
        fail();
        return true;
      }

      // drop image from local system - TODO accept other formats
      if ( type == 'image/png' || type == 'image/jpeg' ) {
        let file = e.dataTransfer.files[0]
          , reader = new FileReader()
        ;
        reader.onload = e => {
          let data = e.target.result;
          // store student image
          console.log('[ImageService.dropHandler]',type,data.substr(0,40));
          success(data);
        };
        reader.readAsDataURL(file);
        return true;
      }
    })) {
      // drop failed
      console.log('[ImageService.dropHandler]',e.dataTransfer);
      fail();
    }
  }

  // https://stackoverflow.com/questions/6333814/how-does-the-paste-image-from-clipboard-functionality-work-in-gmail-and-google-c
  pasteHandler(e, success, fail=()=>{}):void {
    console.log(e.constructor.name);
    let items = e.clipboardData.items;
    if ( ! [...items].some(item => {
      if ( item.kind === 'file' ) {
        let blob = item.getAsFile()
          , reader = new FileReader()
          //, id = e.target.parentNode.id
        ;
        reader.onload = e => {
           let data = e.target.result;
           console.log('[ImageService.pasteHandler]',data.substr(0,40));
           success(data);
        }
        reader.readAsDataURL(blob);
        return true;
      }
    })) {
      // paste failed
      fail();
    }
  }
}
