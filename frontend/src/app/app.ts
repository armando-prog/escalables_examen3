import { Component, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NuevaNota, Nota, NotaService } from './nota.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly notaService = inject(NotaService);
  protected titulo = '';
  protected contenido = '';
  protected tituloEditado = '';
  protected contenidoEditado = '';
  protected readonly guardando = signal(false);
  protected readonly cambiosGuardados = signal(false);
  protected readonly notaSeleccionada = signal<Nota | null>(null);

  constructor() {
    this.notaService.cargarNotas();
  }

  protected guardarNota(): void {
    const nuevaNota: NuevaNota = {
      titulo: this.titulo.trim(),
      contenido: this.contenido.trim()
    };

    if (!nuevaNota.titulo || !nuevaNota.contenido || this.guardando()) {
      return;
    }

    this.guardando.set(true);
    this.notaService.agregarNota(nuevaNota).subscribe({
      next: () => {
        this.titulo = '';
        this.contenido = '';
      },
      error: () => this.guardando.set(false),
      complete: () => this.guardando.set(false)
    });
  }

  protected abrirNota(nota: Nota): void {
    this.tituloEditado = nota.titulo;
    this.contenidoEditado = nota.contenido;
    this.cambiosGuardados.set(false);
    this.notaSeleccionada.set(nota);
  }

  protected cerrarNota(): void {
    if (this.guardando()) {
      return;
    }

    this.notaSeleccionada.set(null);
  }

  protected guardarCambios(): void {
    const nota = this.notaSeleccionada();
    const cambios: NuevaNota = {
      titulo: this.tituloEditado.trim(),
      contenido: this.contenidoEditado.trim()
    };

    if (!nota || !cambios.titulo || !cambios.contenido || this.guardando()) {
      return;
    }

    this.guardando.set(true);
    this.cambiosGuardados.set(false);
    this.notaService.actualizarNota(nota._id, cambios).subscribe({
      next: (notaActualizada) => {
        this.notaSeleccionada.set(notaActualizada);
        this.cambiosGuardados.set(true);
      },
      error: () => this.guardando.set(false),
      complete: () => this.guardando.set(false)
    });
  }

  @HostListener('document:keydown.escape')
  protected cerrarNotaConEscape(): void {
    this.cerrarNota();
  }
}
