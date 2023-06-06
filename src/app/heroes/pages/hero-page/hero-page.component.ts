import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap } from 'rxjs';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: [],
})
export class HeroPageComponent implements OnInit {
  public hero?: Hero;
  constructor(
    private heroesService: HeroesService,
    //voy a leer el url con un servicio que ya viene propio en el router
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    //como ya tengo la ruta activa, y aqui yo ya tengo acceso a todos los parametros como un observable. aqui ya me puedo subscribir
    this.activatedRoute.params
      .pipe(
        delay(3000),
        switchMap(({ id }) => this.heroesService.getHeroById(id))
      )
      .subscribe((hero) => {
        if (!hero) return this.router.navigate(['/heroes/list']);
        console.log('my hero', hero);
        return (this.hero = hero);
      });
  }
  goBack(): void {
    this.router.navigateByUrl('heroes/list');
  }
}
