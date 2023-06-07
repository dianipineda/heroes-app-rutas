import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Publisher, Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [],
})
export class NewPageComponent implements OnInit {
  //esto no es un formulario reactivo, simplemente es una propiedad reactiva de este componente, es una pequeña pieza de controler
  public id = new FormControl('');

  //Esto si es un formulario reactivo
  // superhero: new FormControl('', {nonNullable: true}) -> Revisar por que no se puede
  // alter_ego: new FormControl<Publisher>(Publisher.DCComics),-> Revisar por que no se puede
  public heroForm = new FormGroup({
    id: new FormControl(''),
    superhero: new FormControl(''),
    publisher: new FormControl(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });
  public publishers = [
    { id: 'DC Comics', value: 'DC-Comics' },
    { id: 'Marvel Comics', value: 'Marvel-Comics' },
  ];
  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.heroesService.getHeroById(id)))
      .subscribe((hero) => {
        if (!hero) return this.router.navigateByUrl('/');
        this.heroForm.reset(hero);
        return;
      });
  }

  //*Getter
  //Este getter fue creado porque en la version de angular del curso Typescript advertia el siguiente error
  //!Argument of type partial is not assignable to parameter of type
  // Significa que el argumento pasado en la funcion no es exactatamente del tipo requerido
  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit(): void {
    // console.log({
    //   formIsValid: this.heroForm.valid,
    //   value: this.heroForm.value,
    // });
    //!Argument of type partial is not assignable to parameter of type
    //this.heroesService.updateHero(this.heroForm.value);

    if (this.heroForm.invalid) return;
    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero).subscribe((hero) => {
        //TODO: Mostrar snackbar
        this.showSnackBar(`${hero.superhero} actualizado correctamente`);
      });
      return;
    }
    this.heroesService.addHero(this.currentHero).subscribe((hero) => {
      //TODO: Mostrar snackbar y navegar a la ruta /heroes/edit/hero.id
      this.router.navigate(['/heroes/edit/', hero.id]);
      this.showSnackBar(`${hero.superhero} creado correctamente`);
    });
  }

  actionDelete(confirm: boolean) {
    if (!confirm) return;
    this.heroesService
      .deleteHero(this.currentHero.id)
      .subscribe((wasDeleted) => {
        if (wasDeleted) this.router.navigate(['/heroes']);
      });
  }

  onDeleteHero() {
    if (!this.currentHero.id) throw Error('Hero id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    //*forma 3 de hacer el delete
    dialogRef
      .afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() => this.heroesService.deleteHero(this.currentHero.id)),
        filter((wasDeleted: boolean) => wasDeleted)
      )
      .subscribe(() => this.router.navigate(['/heroes']));

    //* forma 2 de hacer el delete
    // dialogRef.afterClosed().subscribe((result) => {
    //   this.actionDelete(result);
    // });

    //* forma 1 de hacer el delete
    // dialogRef.afterClosed().subscribe((result) => {
    //   //console.log(`Dialog result: ${result}`);
    //   if (!result) return;
    //   this.heroesService
    //     .deleteHero(this.currentHero.id)
    //     .subscribe((wasDeleted) => {
    //       if (wasDeleted) this.router.navigate(['/heroes']);
    //     });
    // });
  }

  showSnackBar(message: string): void {
    this.snackbar.open(message, 'ok', {
      duration: 2500,
    });
  }
}
