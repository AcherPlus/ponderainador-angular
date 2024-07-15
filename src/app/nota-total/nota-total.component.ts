import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-nota-total',
  standalone: true,
  imports: [],
  templateUrl: './nota-total.component.html',
  styleUrl: './nota-total.component.css'
})

export class NotaTotalComponent implements OnInit {

  @ViewChild('nota1') nota1?: ElementRef;
  @ViewChild('nota2') nota2?: ElementRef;
  @ViewChild('nota3') nota3?: ElementRef;
  @ViewChild('mensajeModal') mensajeModal?: ElementRef;
  @ViewChild('resultadoParrafo') resultadoParrafo?: ElementRef;

  constructor(private rendered2: Renderer2) { }

  ngOnInit(): void {
  }

  hallarPonderadoTotal(nota1: number, nota2: number, nota3: number): number {
    let total = 0.3 * (nota1 + nota3) + 0.4 * (nota2);

    if (total >= 0 && total <= 20) {
      return Math.round(total * 10) / 10;
    } else {
      return NaN;
    }
  }

  botonResultadoTotal() {
    //Para las notas
    const nota1 = parseFloat(this.nota1?.nativeElement.value);
    const nota2 = parseFloat(this.nota2?.nativeElement.value);
    const nota3 = parseFloat(this.nota3?.nativeElement.value);

    //Para el modal
    const mensajeModal = this.mensajeModal?.nativeElement;
    const resultadoParrafo = this.resultadoParrafo?.nativeElement;

    //Para evitar que se muestre los mensajes más de una vez
    this.clearChildren(mensajeModal);
    this.clearChildren(resultadoParrafo);

    if ((nota1 <= 20 && nota1 >= 0) && (nota2 <= 20 && nota2 >= 0) && (nota3 <= 20 && nota3 >= 0)) {
      let resultado = this.hallarPonderadoTotal(nota1, nota2, nota3);

      if (!isNaN(resultado)) {
        if (resultado > 15) {
          this.rendered2.appendChild(mensajeModal, this.rendered2.createText('Felicidades'));
          this.rendered2.setStyle(mensajeModal, 'color', 'green');
        } else if (resultado > 10 && resultado <= 15) {
          this.rendered2.appendChild(mensajeModal, this.rendered2.createText('A seguir mejorando'));
          this.rendered2.setStyle(mensajeModal, 'color', '#B8860B');
        } else if (resultado >= 0 && resultado < 10) {
          this.rendered2.appendChild(mensajeModal, this.rendered2.createText('Reprobaste'));
          this.rendered2.setStyle(mensajeModal, 'color', 'red');
        } else {
          this.rendered2.appendChild(mensajeModal, this.rendered2.createText('CUIDADO'));
          this.rendered2.setStyle(mensajeModal, 'color', 'red');
        }

        resultadoParrafo.innerHTML = `Haz obtenido un puntaje de <b>${resultado}</b>`;
      }
    } else {
      //Texto h1
      this.rendered2.appendChild(mensajeModal, this.rendered2.createText('¡AVISO!'));
      this.rendered2.setStyle(mensajeModal, 'color', 'red');
      //Texto p
      this.rendered2.appendChild(resultadoParrafo, this.rendered2.createText('Ingrese valores entre 0 y 20.'));
      this.rendered2.setStyle(resultadoParrafo, 'color', 'red');
    }
  }

  clearChildren(element: any) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}
