import { Component,ViewChild,NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MapsAPILoader } from '@agm/core'

declare var google: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  @ViewChild("search") 
  public searchElementRef;
  
  constructor(public navCtrl: NavController, public zone: NgZone,private mapsAPILoader: MapsAPILoader) {
    
  }
 ionViewDidLoad() {
  let componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'long_name',
    country: 'long_name',
    postal_code: 'short_name'
  };
  
  //reference : https://github.com/ramsatt/Ionic-3---Google-Map-Auto-Complete-Search
  this.mapsAPILoader.load().then(() => {  
    let nativeHomeInputBox = document.getElementById('searching').getElementsByTagName('input')[0];
    let autocomplete = new google.maps.places.Autocomplete(nativeHomeInputBox, {
         types: ["address"]
      });

    //To get user's location  
    this.getMyLocation(autocomplete);
    //To fill address form
    autocomplete.addListener("place_changed", () => {
      this.zone.run(() => {
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();
        console.log(place);
        for (var component in componentForm) {
          document.getElementById(component).getElementsByTagName('input')[0].value = '';
          document.getElementById(component).getElementsByTagName('input')[0].disabled = false;
          }
        for (var i = 0; i < place.address_components.length; i++) {
          var addressType = place.address_components[i].types[0];
          if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            document.getElementById(addressType).getElementsByTagName('input')[0].value = val;
            }
          }        
        });
      });
    });
  }

  getMyLocation(autocomplete) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=> {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
          };
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
          });
        autocomplete.setBounds(circle.getBounds());
        });
      }
  }
}
