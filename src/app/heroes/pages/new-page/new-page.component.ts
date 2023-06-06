import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Publisher } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [],
})
export class NewPageComponent {
  //esto no es un formulario reactivo, simplemente es una propiedad reactiva de este componente, es una pequeña pieza de controler
  public id = new FormControl('');

  //Esto si es un formulario reactivo
  public heroForm = new FormGroup({
    id: new FormControl(''),
    superhero: new FormControl(''),
    // superhero: new FormControl('', {nonNullable: true}) -> Revisar por que no se puede
    publisher: new FormControl(''),
    alter_ego: new FormControl(Publisher.DCComics),
    // alter_ego: new FormControl<Publisher>(Publisher.DCComics),-> Revisar por que no se puede
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });
  public publishers = [
    { id: 'DC Comics', value: 'DC-Comics' },
    { id: 'Marvel Comics', value: 'Marvel-Comics' },
  ];
}
