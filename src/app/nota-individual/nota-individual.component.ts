import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-nota-individual',
  standalone: true,
  imports: [],
  templateUrl: './nota-individual.component.html',
  styleUrl: './nota-individual.component.css'
})
export class NotaIndividualComponent implements OnInit {

  @ViewChild('nota1') nota1?: ElementRef;
  @ViewChild('nota2') nota2?: ElementRef;
  @ViewChild('tituloEva1') tituloEva1?: ElementRef;
  @ViewChild('tituloEva2') tituloEva2?: ElementRef;
  @ViewChild('notaEscogida') notaEscogida?: ElementRef;
  @ViewChild('mensajeModal') mensajeModal?: ElementRef;
  @ViewChild('resultadoParrafo') resultadoParrafo?: ElementRef;

  constructor(private rendered2: Renderer2){}

  ngOnInit(): void {
      setTimeout(() => {
        this.selectNota();
      });
  }

  selectNota = ()=>{
    const valorSelec1 = this.notaEscogida?.nativeElement.value;

    // Limpiar contenido de los elementos títuloEva1 y títuloEva2
    if (this.tituloEva1 && this.tituloEva1.nativeElement) {
      this.tituloEva1.nativeElement.innerHTML = '';
    }
    if (this.tituloEva2 && this.tituloEva2.nativeElement) {
      this.tituloEva2.nativeElement.innerHTML = '';
    }

    if(valorSelec1 == "EP"){
      this.rendered2.appendChild(this.tituloEva1?.nativeElement, this.rendered2.createText('Evaluación Continua'));
      this.rendered2.appendChild(this.tituloEva2?.nativeElement, this.rendered2.createText('Examen Final'));
    }
    else if(valorSelec1 == "EC"){
      this.rendered2.appendChild(this.tituloEva1?.nativeElement, this.rendered2.createText('Examen Parcial'));
      this.rendered2.appendChild(this.tituloEva2?.nativeElement, this.rendered2.createText('Examen Final'));
    }
    else if(valorSelec1 == "EF"){
      this.rendered2.appendChild(this.tituloEva1?.nativeElement, this.rendered2.createText('Examen Parcial'));
      this.rendered2.appendChild(this.tituloEva2?.nativeElement, this.rendered2.createText('Evaluación Continua'));
    }
  }

  hallarPonderadoIndividual(nota1:number, nota2:number): number[]{
    let resultados = [];
    let notaMinima = 0, notaMaxima = 0;
    const valorSelec1 = this.notaEscogida?.nativeElement.value;

    switch(valorSelec1){
      case "EP":  notaMinima = ((106 - 4 * nota1)/3) - nota2;
                  notaMaxima = 0.3 * (20 + nota2) + 0.4 * (nota1);
                  break;   
      case "EC":  notaMinima = ((106 - 3 * (nota1 + nota2))/4);
                  notaMaxima = 0.3 * (nota1 + nota2) + 0.4 * (20);
                  break;
      case "EF":  notaMinima = ((106 - 4 * nota2)/3) - nota1;
                  notaMaxima = 0.3 * (nota1 + 20) + 0.4 * (nota2);
                  break; 
      default:
        break;
    }

    resultados[0] = Math.round(notaMinima*10)/10;
    resultados[1] = Math.round(notaMaxima*10)/10;

    return resultados;
  }

  botonResultadoIndividual(){
    const nota1 = parseFloat(this.nota1?.nativeElement.value);
    const nota2 = parseFloat(this.nota2?.nativeElement.value);
    const resultadoParrafo = this.resultadoParrafo?.nativeElement;
    let resultadoMinMax = this.hallarPonderadoIndividual(nota1,nota2);

    if (resultadoMinMax.length > 0) {
      resultadoParrafo.textContent = '';
      if (resultadoMinMax[0] <= 20.0 && resultadoMinMax[1] <= 20.0) {
        resultadoParrafo.innerHTML = `Nota mínima: <b>${resultadoMinMax[0]}</b> <br> Nota máxima: <b>${resultadoMinMax[1]}</b>`;
      } else {
        resultadoParrafo.innerHTML = `Resultado no válido, ingrese valores entre 0 y 20.`;
      }
    }
  }
}
