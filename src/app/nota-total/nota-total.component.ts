import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-nota-total',
  standalone: true,
  imports: [],
  templateUrl: './nota-total.component.html',
  styleUrl: './nota-total.component.css',
})
export class NotaTotalComponent implements OnInit {
  @ViewChild('nota1') nota1?: ElementRef;
  @ViewChild('nota2') nota2?: ElementRef;
  @ViewChild('nota3') nota3?: ElementRef;
  @ViewChild('mensajeModal') mensajeModal?: ElementRef;
  @ViewChild('resultadoParrafo') resultadoParrafo?: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}

  private hallarPonderadoTotal(
    nota1: number,
    nota2: number,
    nota3: number
  ): number {
    const total = 0.3 * (nota1 + nota3) + 0.4 * nota2;
    return total >= 0 && total <= 20 ? Math.round(total * 10) / 10 : NaN;
  }

  botonResultadoTotal(): void {
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

    if ([nota1, nota2, nota3].every((nota) => nota >= 0 && nota <= 20)) {
      const resultado = this.hallarPonderadoTotal(nota1, nota2, nota3);
      if (!isNaN(resultado)) {
        this.mostrarMensaje(
          mensajeModal,
          resultado > 15
            ? 'Felicidades'
            : resultado > 10
            ? 'A seguir mejorando'
            : resultado >= 0
            ? 'Reprobaste'
            : 'CUIDADO',
          resultado > 15 ? 'green' : resultado > 10 ? '#B8860B' : 'red'
        );
        resultadoParrafo.innerHTML = `Haz obtenido un puntaje de <b>${resultado}</b>`;
      }
    } else {
      this.mostrarMensaje(mensajeModal, '¡AVISO!', 'red');
      this.mostrarMensaje(
        resultadoParrafo,
        'Ingrese valores entre 0 y 20.',
        'red'
      );
    }
  }

  private mostrarMensaje(
    element: HTMLElement,
    mensaje: string,
    color: string
  ): void {
    this.renderer.appendChild(element, this.renderer.createText(mensaje));
    this.renderer.setStyle(element, 'color', color);
  }

  private clearChildren(element: HTMLElement): void {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}
