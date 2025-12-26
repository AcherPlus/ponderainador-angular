import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-nota-individual',
  standalone: true,
  imports: [],
  templateUrl: './nota-individual.component.html',
  styleUrl: './nota-individual.component.css',
})
export class NotaIndividualComponent implements OnInit {
  @ViewChild('nota1') nota1?: ElementRef;
  @ViewChild('nota2') nota2?: ElementRef;
  @ViewChild('tituloEva1') tituloEva1?: ElementRef;
  @ViewChild('tituloEva2') tituloEva2?: ElementRef;
  @ViewChild('notaEscogida') notaEscogida?: ElementRef;
  @ViewChild('mensajeModal') mensajeModal?: ElementRef;
  @ViewChild('resultadoParrafo') resultadoParrafo?: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    setTimeout(() => this.selectNota());
  }

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

  selectNota = () => {
    const valorSelec1 = this.notaEscogida?.nativeElement.value;
    const evaluaciones: Record<string, [string, string]> = {
      EP: ['Evaluación Continua (40%)', 'Examen Final (30%)'],
      EC: ['Examen Parcial (30%)', 'Examen Final (30%)'],
      EF: ['Examen Parcial (30%)', 'Evaluación Continua (40%)'],
    };

    this.setText(this.tituloEva1, evaluaciones[valorSelec1]?.[0] || 'Evaluación Continua (40%)');
    this.setText(this.tituloEva2, evaluaciones[valorSelec1]?.[1] || 'Examen Final (30%)');
  };

  private setText(element: ElementRef | undefined, text: string): void {
    if (element?.nativeElement) {
      this.renderer.setProperty(element.nativeElement, 'innerHTML', text);
    }
  }

  hallarPonderadoIndividual(nota1: number, nota2: number): number[] {
    let notaMinima = 0,
      notaMaxima = 0;
    const valorSelec1 = this.notaEscogida?.nativeElement.value;

    const calculos: Record<string, () => void> = {
      EP: () => {
        notaMinima = (106 - 4 * nota1) / 3 - nota2;
        notaMaxima = 0.3 * (20 + nota2) + 0.4 * nota1;
      },
      EC: () => {
        notaMinima = (106 - 3 * (nota1 + nota2)) / 4;
        notaMaxima = 0.3 * (nota1 + nota2) + 0.4 * 20;
      },
      EF: () => {
        notaMinima = (106 - 4 * nota2) / 3 - nota1;
        notaMaxima = 0.3 * (nota1 + 20) + 0.4 * nota2;
      },
    };
    calculos[valorSelec1]?.();

    return [Math.round(notaMinima * 10) / 10, Math.round(notaMaxima * 10) / 10];
  }

  botonResultadoIndividual(): void {
    const nota1 = parseFloat(this.nota1?.nativeElement.value);
    const nota2 = parseFloat(this.nota2?.nativeElement.value);

    if (
      !this.resultadoParrafo?.nativeElement ||
      isNaN(nota1) ||
      isNaN(nota2) ||
      nota1 < 0 ||
      nota1 > 20 ||
      nota2 < 0 ||
      nota2 > 20
    ) {
      this.setText(
        this.resultadoParrafo,
        'Resultado no válido, ingrese valores entre 0 y 20.'
      );
      return;
    }

    const [notaMinima, notaMaxima] = this.hallarPonderadoIndividual(
      nota1,
      nota2
    );
    const resultado =
      notaMinima <= 20 && notaMaxima <= 20
        ? `Nota mínima: <b>${notaMinima <= 0 ? 'Aprobado' : notaMinima}</b> <br> Nota máxima: <b>${notaMaxima}</b>`
        : 'Resultado no válido, ingrese valores entre 0 y 20.';

    this.setText(this.resultadoParrafo, resultado);
  }
}
