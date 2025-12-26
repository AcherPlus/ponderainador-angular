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
  templateUrl: './nota-total.component.html',
  styleUrl: './nota-total.component.css',
})
export class NotaTotalComponent implements OnInit {
  @ViewChild('nota1') nota1?: ElementRef;
  @ViewChild('nota2') nota2?: ElementRef;
  @ViewChild('nota3') nota3?: ElementRef;
  @ViewChild('mensajeModal') mensajeModal?: ElementRef;
  @ViewChild('resultadoParrafo') resultadoParrafo?: ElementRef;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void { }

  validarSoloNumeros(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;

    // Permite números (48-57) y punto (46)
    if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    
    console.log("Reconociendo...")
    return true;
  }

  validarRangoYDecimales(input: HTMLInputElement): void {
    let valor = input.value;

    // Evitar más de un punto decimal
    const puntos = valor.split('.').length - 1;
    if (puntos > 1) {
      valor = valor.slice(0, -1);
    }

    // Limitar a dos decimales
    if (valor.includes('.')) {
      const partes = valor.split('.');
      if (partes[1].length > 2) {
        valor = partes[0] + '.' + partes[1].slice(0, 2);
      }
    }

    // Validar rango 0-20
    const num = parseFloat(valor);
    if (!isNaN(num)) {
      if (num > 20) valor = '20';
      if (num < 0) valor = '0';
    }

    // Actualizar el valor
    input.value = valor;
  }

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
